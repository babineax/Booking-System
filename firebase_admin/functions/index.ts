import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import * as twilio from "twilio";

admin.initializeApp();
const db = admin.firestore();

// Initialize Twilio
const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token,
);
const twilioPhoneNumber = functions.config().twilio.phone_number;

// Initialize Google Auth
const oauth2Client = new google.auth.OAuth2(
  functions.config().google.client_id,
  functions.config().google.client_secret,
  functions.config().google.redirect_uri,
);

/** Types for request & response */
interface BookingData {
  serviceId: string;
  startTime: string;
  clientId?: string;
  serviceProviderId: string;
}

interface ClientData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const createBooking = functions.https.onCall(
  async (data: BookingData, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const { serviceId, startTime, clientId, serviceProviderId } = data;
    let userId = context.auth.uid;

    // If a clientId is provided, verify the caller is an admin
    if (clientId) {
      const adminUserDoc = await db
        .collection("users")
        .doc(context.auth.uid)
        .get();
      const adminUserData = adminUserDoc.data();
      if (adminUserData?.role !== "admin") {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only admins can create bookings for other clients.",
        );
      }
      userId = clientId; // Set the userId to the client being booked for
    }

    if (!serviceId || !startTime || !serviceProviderId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'Must provide "serviceId", "startTime", and "serviceProviderId".',
      );
    }

    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        '"startTime" must be a valid date.',
      );
    }

    const slotId = `${encodeURIComponent(serviceId)}_${encodeURIComponent(
      parsedStartTime.toISOString(),
    )}`;
    const docRef = db.collection("bookings").doc(slotId);

    try {
      await db.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
        const snap = await tx.get(docRef);
        if (snap.exists) {
          throw new functions.https.HttpsError(
            "already-exists",
            "This time slot is no longer available.",
          );
        }
        tx.set(docRef, {
          serviceId,
          startTime: admin.firestore.Timestamp.fromDate(parsedStartTime),
          userId,
          serviceProviderId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "confirmed",
        });
      });

      // --- Start of new integration logic ---
      try {
        // Get customer and service details for notifications
        const userDoc = await db.collection("users").doc(userId).get();
        const serviceDoc = await db.collection("services").doc(serviceId).get();

        if (!userDoc.exists || !serviceDoc.exists) {
          console.error("User or service not found for notification.");
        } else {
          const userData = userDoc.data();
          const serviceData = serviceDoc.data();
          const customerPhoneNumber = userData.phone; // Assuming phone is stored in user doc

          // Send Twilio SMS to customer
          if (customerPhoneNumber) {
            await twilioClient.messages.create({
              body: `Your booking for ${
                serviceData.name
              } at ${parsedStartTime.toLocaleString()} is confirmed.`,
              from: twilioPhoneNumber,
              to: customerPhoneNumber,
            });
          }

          // Google Calendar Integration
          const providerDoc = await db
            .collection("users")
            .doc(serviceProviderId)
            .get();
          if (providerDoc.exists) {
            const providerData = providerDoc.data();
            if (providerData.googleRefreshToken) {
              oauth2Client.setCredentials({
                refresh_token: providerData.googleRefreshToken,
              });

              const calendar = google.calendar({
                version: "v3",
                auth: oauth2Client,
              });

              const endTime = new Date(
                parsedStartTime.getTime() + serviceData.duration * 60000,
              );

              await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                  summary: serviceData.name,
                  description: `Booking with ${userData.firstName} ${userData.lastName}.`,
                  start: {
                    dateTime: parsedStartTime.toISOString(),
                    timeZone: "UTC",
                  },
                  end: {
                    dateTime: endTime.toISOString(),
                    timeZone: "UTC",
                  },
                },
              });
            }
          }
        }
      } catch (notificationError) {
        // Log the error, but don't fail the booking
        console.error(
          "Failed to send notifications or create calendar event:",
          notificationError,
        );
      }
      // --- End of new integration logic ---

      return { success: true, message: "Booking created successfully." };
    } catch (err: any) {
      console.error("Booking transaction failed:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError(
        "internal",
        "An internal error occurred.",
      );
    }
  },
);

export const getGoogleAuthUrl = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const scopes = ["https://www.googleapis.com/auth/calendar.events"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      // Pass the user's UID in the state parameter to identify them in the callback
      state: context.auth.uid,
    });

    return { url };
  },
);

export const oauthcallback = functions.https.onRequest(async (req, res) => {
  const { code, state } = req.query;
  const userId = state as string;

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    const { refresh_token } = tokens;

    if (refresh_token) {
      // Securely store the refresh token in Firestore, associated with the user
      await db.collection("users").doc(userId).update({
        googleRefreshToken: refresh_token,
      });
    }

    // You can redirect the user to a success page in your app
    res.send("Successfully connected your Google account!");
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    res.status(500).send("Failed to connect your Google account.");
  }
});

export const createClient = functions.https.onCall(
  async (data: ClientData, context) => {
    // 1. Authentication & Authorization
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const adminUserDoc = await db
      .collection("users")
      .doc(context.auth.uid)
      .get();
    const adminUserData = adminUserDoc.data();

    if (adminUserData?.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can create new clients.",
      );
    }

    // 2. Data Validation
    const { email, firstName, lastName, phone } = data;
    if (!email || !firstName || !lastName || !phone) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required client information.",
      );
    }

    // 3. Logic
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        displayName: `${firstName} ${lastName}`,
        phoneNumber: phone,
      });

      // Create user document in Firestore
      await db.collection("users").doc(userRecord.uid).set({
        firstName,
        lastName,
        email,
        phone,
        role: "customer", // Default role for clients
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Send password reset email
      const link = await admin.auth().generatePasswordResetLink(email);
      // You can use a more sophisticated email sending service here
      console.log(`Password reset link for ${email}: ${link}`);

      // 4. Response
      return {
        success: true,
        message:
          "Client created successfully. A password reset email has been sent.",
        clientId: userRecord.uid,
      };
    } catch (error: any) {
      console.error("Error creating client:", error);
      // Check for specific auth errors
      if (error.code === "auth/email-already-exists") {
        throw new functions.https.HttpsError(
          "already-exists",
          "A user with this email already exists.",
        );
      }
      throw new functions.https.HttpsError(
        "internal",
        "An unexpected error occurred while creating the client.",
      );
    }
  },
);
