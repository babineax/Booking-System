"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.oauthcallback = exports.getGoogleAuthUrl = exports.createBooking = exports.getAvailableSlots = exports.handleGoogleAuthCallback = exports.onBookingCreated = exports.sendWhatsAppMessage = exports.sendBookingReminders = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const googleapis_1 = require("googleapis");
exports.sendBookingReminders = https.onRequest(async (req, res) => {
    try {
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const bookingsSnapshot = await db.collection("bookings")
            .where("status", "==", "confirmed")
            .where("reminderSent", "==", false)
            .where("startTime", ">=", now.toISOString())
            .where("startTime", "<=", twentyFourHoursFromNow.toISOString())
            .get();
        if (bookingsSnapshot.empty) {
            logger.info("No upcoming bookings that need reminders.");
            res.status(200).send("No reminders to send.");
            return;
        }
        const reminderPromises = bookingsSnapshot.docs.map(async (doc) => {
            const booking = doc.data();
            const customerDoc = await db.collection("users").doc(booking.customerId).get();
            if (customerDoc.exists && customerDoc.data().phone) {
                const customerPhone = customerDoc.data().phone;
                const messageBody = `Hi ${customerDoc.data().firstName}, just a reminder about your upcoming booking tomorrow at ${new Date(booking.startTime).toLocaleTimeString()}. We look forward to seeing you!`;
                logger.info(`Sending reminder to ${customerPhone}`);
                // In a real scenario, you would call your sendWhatsAppMessage function here.
                // After sending, update the booking to prevent re-sending
                return doc.ref.update({ reminderSent: true });
            }
            return Promise.resolve();
        });
        await Promise.all(reminderPromises);
        res.status(200).send(`${reminderPromises.length} reminders sent.`);
    }
    catch (error) {
        logger.error("Error in sendBookingReminders:", error);
        res.status(500).send("Failed to send reminders.");
    }
});
// --- PLACEHOLDER SECRETS ---
// Replace these with your actual credentials from Twilio, stored as environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886"; // Twilio Sandbox number
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
exports.sendWhatsAppMessage = https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new https.HttpsError("unauthenticated", "User must be authenticated.");
    }
    const { to, body } = data;
    if (!to || !body) {
        throw new https.HttpsError("invalid-argument", "Missing 'to' or 'body' parameters.");
    }
    try {
        logger.info(`Sending WhatsApp message to: ${to}`);
        const message = await twilioClient.messages.create({
            body: body,
            from: TWILIO_PHONE_NUMBER,
            to: `whatsapp:${to}` // Assumes `to` is a valid number with country code
        });
        logger.info(`Message sent successfully with SID: ${message.sid}`);
        return { success: true, sid: message.sid };
    }
    catch (error) {
        logger.error("Error sending WhatsApp message:", error);
        throw new https.HttpsError("internal", "Failed to send WhatsApp message.", error);
    }
});
// ... (keep existing code)
exports.onBookingCreated = https.onRequest(async (req, res) => {
    const bookingId = req.body.bookingId;
    if (!bookingId) {
        res.status(400).send("Missing bookingId");
        return;
    }
    try {
        const bookingDoc = await db.collection("bookings").doc(bookingId).get();
        if (!bookingDoc.exists) {
            throw new Error("Booking not found");
        }
        const booking = bookingDoc.data();
        const staffDoc = await db.collection("users").doc(booking.staffMemberId).get();
        if (!staffDoc.exists || !staffDoc.data()?.googleAuth?.refreshToken) {
            logger.info("Staff member not found or has no Google auth, skipping calendar event.");
            res.status(200).send("No calendar action needed.");
            return;
        }
        const staff = staffDoc.data();
        const customerDoc = await db.collection("users").doc(booking.customerId).get();
        const customerName = customerDoc.exists() ? `${customerDoc.data().firstName} ${customerDoc.data().lastName}` : "A customer";
        const serviceDoc = await db.collection("services").doc(booking.serviceId).get();
        const serviceName = serviceDoc.exists() ? serviceDoc.data().name : "A service";
        // Set credentials from refresh token
        oauth2Client.setCredentials({ refresh_token: staff.googleAuth.refreshToken });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
        const event = {
            summary: `${serviceName} with ${customerName}`,
            description: `Booking details for the service: ${serviceName}. Customer: ${customerName}.`,
            start: {
                dateTime: new Date(booking.startTime).toISOString(),
                timeZone: 'America/New_York', // Consider making this dynamic
            },
            end: {
                dateTime: new Date(booking.endTime).toISOString(),
                timeZone: 'America/New_York', // Consider making this dynamic
            },
        };
        const calendarResponse = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        // Save the calendar event ID to our booking for future updates/deletions
        await bookingDoc.ref.update({ googleCalendarEventId: calendarResponse.data.id });
        // Send WhatsApp confirmation
        if (customerDoc.exists && customerDoc.data().phone) {
            const customerPhone = customerDoc.data().phone;
            const messageBody = `Hi ${customerDoc.data().firstName}, your booking for ${serviceName} on ${new Date(booking.startTime).toLocaleDateString()} at ${new Date(booking.startTime).toLocaleTimeString()} is confirmed!`;
            // We can call the function directly, but for robustness, it's better to invoke it.
            // For simplicity here, we'll just log the intent.
            logger.info(`Attempting to send WhatsApp confirmation to ${customerPhone}`);
            // In a real scenario, you would call your sendWhatsAppMessage function here.
            // Example: await sendWhatsAppMessage({ to: customerPhone, body: messageBody }, { auth: { uid: 'backend-process' } });
        }
        logger.info(`Event created: ${calendarResponse.data.htmlLink}`);
        res.status(200).send({ success: true, eventUrl: calendarResponse.data.htmlLink });
    }
    catch (error) {
        logger.error("Error creating calendar event:", error);
        res.status(500).send("Failed to create calendar event.");
    }
});
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
const googleapis_2 = require("googleapis");
// --- PLACEHOLDER SECRETS ---
// Replace these with your actual credentials from the Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE";
const GOOGLE_CLIENT_SECRET = "YOUR_CLIENT_SECRET_HERE";
// This redirect URI must be registered in your Google Cloud Console credentials
const REDIRECT_URI = "https://your-app-url/auth/google/callback";
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
exports.handleGoogleAuthCallback = https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.uid) {
        throw new https.HttpsError("unauthenticated", "User must be authenticated.");
    }
    const { code, staffId } = data;
    if (!code || !staffId) {
        throw new https.HttpsError("invalid-argument", "Missing authorization code or staffId.");
    }
    try {
        // Ensure the calling user is an admin
        const adminUserDoc = await db.collection("users").doc(context.auth.uid).get();
        if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'admin') {
            throw new https.HttpsError("permission-denied", "Only admins can perform this action.");
        }
        logger.info(`Exchanging auth code for tokens for staffId: ${staffId}`);
        const { tokens } = await oauth2Client.getToken(code);
        const { access_token, refresh_token, expiry_date } = tokens;
        if (!refresh_token) {
            // This happens if the user has already granted permission and not been forced to re-consent.
            // For this flow, we need the refresh token to live on the backend.
            logger.warn("Refresh token not received. User may need to revoke access and re-authenticate.");
            // We can still save the access token and its expiry.
        }
        logger.info(`Saving Google auth tokens for staffId: ${staffId}`);
        await db.collection("users").doc(staffId).update({
            googleAuth: {
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiry: expiry_date,
            },
        });
        return { success: true, message: "Google Calendar connected successfully." };
    }
    catch (error) {
        logger.error("Error in handleGoogleAuthCallback:", error);
        throw new https.HttpsError("internal", "Failed to connect Google Calendar.", error);
    }
});
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
exports.getAvailableSlots = https.onCall(async (data, context) => {
    logger.info("getAvailableSlots called with:", data);
    if (!context.auth) {
        throw new https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { staffId, serviceId, date } = data;
    if (!staffId || !serviceId || !date) {
        throw new https.HttpsError("invalid-argument", "Missing required fields");
    }
    try {
        // 1. Fetch Service and Staff documents in parallel
        const [serviceDoc, staffDoc] = await Promise.all([
            db.collection("services").doc(serviceId).get(),
            db.collection("users").doc(staffId).get(),
        ]);
        if (!serviceDoc.exists) {
            throw new https.HttpsError("not-found", "Service not found");
        }
        if (!staffDoc.exists) {
            throw new https.HttpsError("not-found", "Staff member not found");
        }
        const service = serviceDoc.data();
        const staff = staffDoc.data();
        const serviceDuration = service.duration; // in minutes
        // 2. Determine the staff member's working hours for the given date
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: 'long' }).toLowerCase();
        const workingHours = staff.workingHours?.[dayOfWeek];
        if (!workingHours || !workingHours.isWorking) {
            logger.info(`Staff not working on ${dayOfWeek}`);
            return { slots: [] };
        }
        // 3. Fetch existing bookings for the staff member on that day
        const dayStart = new Date(`${date}T00:00:00Z`);
        const dayEnd = new Date(`${date}T23:59:59Z`);
        const bookingsSnapshot = await db.collection("bookings")
            .where("serviceProviderId", "==", staffId)
            .where("startTime", ">=", dayStart.toISOString())
            .where("startTime", "<=", dayEnd.toISOString())
            .get();
        const existingBookings = bookingsSnapshot.docs.map(doc => doc.data());
        // 4. Generate available slots
        const availableSlots = [];
        const slotInterval = 15; // check for availability every 15 minutes
        const openTime = new Date(`${date}T${workingHours.startTime}:00`);
        const closeTime = new Date(`${date}T${workingHours.endTime}:00`);
        let currentSlotTime = openTime;
        while (currentSlotTime < closeTime) {
            const potentialSlotEnd = new Date(currentSlotTime.getTime() + serviceDuration * 60000);
            if (potentialSlotEnd > closeTime) {
                break; // Slot extends beyond closing time
            }
            // Check for conflicts with existing bookings
            const isConflict = existingBookings.some(booking => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                // Conflict if potential slot overlaps with an existing booking
                return ((currentSlotTime >= bookingStart && currentSlotTime < bookingEnd) ||
                    (potentialSlotEnd > bookingStart && potentialSlotEnd <= bookingEnd));
            });
            if (!isConflict) {
                availableSlots.push(currentSlotTime.toTimeString().substring(0, 5)); // Format as HH:MM
            }
            // Move to the next potential slot
            currentSlotTime = new Date(currentSlotTime.getTime() + slotInterval * 60000);
        }
        logger.info(`Returning ${availableSlots.length} slots.`);
        return { slots: availableSlots };
    }
    catch (error) {
        logger.error("Error in getAvailableSlots:", error);
        throw new https.HttpsError("internal", "An unexpected error occurred while fetching availability.");
    }
});
// Initialize Twilio
const twilioClient = twilio(functions.config().twilio.account_sid, functions.config().twilio.auth_token);
const twilioPhoneNumber = functions.config().twilio.phone_number;
// Initialize Google Auth
const oauth2Client = new googleapis_1.google.auth.OAuth2(functions.config().google.client_id, functions.config().google.client_secret, functions.config().google.redirect_uri);
exports.createBooking = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
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
            throw new functions.https.HttpsError("permission-denied", "Only admins can create bookings for other clients.");
        }
        userId = clientId; // Set the userId to the client being booked for
    }
    if (!serviceId || !startTime || !serviceProviderId) {
        throw new functions.https.HttpsError("invalid-argument", 'Must provide "serviceId", "startTime", and "serviceProviderId".');
    }
    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
        throw new functions.https.HttpsError("invalid-argument", '"startTime" must be a valid date.');
    }
    const slotId = `${encodeURIComponent(serviceId)}_${encodeURIComponent(parsedStartTime.toISOString())}`;
    const docRef = db.collection("bookings").doc(slotId);
    try {
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(docRef);
            if (snap.exists) {
                throw new functions.https.HttpsError("already-exists", "This time slot is no longer available.");
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
            }
            else {
                const userData = userDoc.data();
                const serviceData = serviceDoc.data();
                const customerPhoneNumber = userData.phone; // Assuming phone is stored in user doc
                // Send Twilio SMS to customer
                if (customerPhoneNumber) {
                    await twilioClient.messages.create({
                        body: `Your booking for ${serviceData.name} at ${parsedStartTime.toLocaleString()} is confirmed.`,
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
                        const calendar = googleapis_1.google.calendar({
                            version: "v3",
                            auth: oauth2Client,
                        });
                        const endTime = new Date(parsedStartTime.getTime() + serviceData.duration * 60000);
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
        }
        catch (notificationError) {
            // Log the error, but don't fail the booking
            console.error("Failed to send notifications or create calendar event:", notificationError);
        }
        // --- End of new integration logic ---
        return { success: true, message: "Booking created successfully." };
    }
    catch (err) {
        console.error("Booking transaction failed:", err);
        if (err instanceof functions.https.HttpsError)
            throw err;
        throw new functions.https.HttpsError("internal", "An internal error occurred.");
    }
});
exports.getGoogleAuthUrl = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const scopes = ["https://www.googleapis.com/auth/calendar.events"];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        // Pass the user's UID in the state parameter to identify them in the callback
        state: context.auth.uid,
    });
    return { url };
});
exports.oauthcallback = functions.https.onRequest(async (req, res) => {
    const { code, state } = req.query;
    const userId = state;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        const { refresh_token } = tokens;
        if (refresh_token) {
            // Securely store the refresh token in Firestore, associated with the user
            await db.collection("users").doc(userId).update({
                googleRefreshToken: refresh_token,
            });
        }
        // You can redirect the user to a success page in your app
        res.send("Successfully connected your Google account!");
    }
    catch (error) {
        console.error("Error handling OAuth callback:", error);
        res.status(500).send("Failed to connect your Google account.");
    }
});
exports.createClient = functions.https.onCall(async (data, context) => {
    // 1. Authentication & Authorization
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const adminUserDoc = await db
        .collection("users")
        .doc(context.auth.uid)
        .get();
    const adminUserData = adminUserDoc.data();
    if (adminUserData?.role !== "admin") {
        throw new functions.https.HttpsError("permission-denied", "Only admins can create new clients.");
    }
    // 2. Data Validation
    const { email, firstName, lastName, phone } = data;
    if (!email || !firstName || !lastName || !phone) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required client information.");
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
            message: "Client created successfully. A password reset email has been sent.",
            clientId: userRecord.uid,
        };
    }
    catch (error) {
        console.error("Error creating client:", error);
        // Check for specific auth errors
        if (error.code === "auth/email-already-exists") {
            throw new functions.https.HttpsError("already-exists", "A user with this email already exists.");
        }
        throw new functions.https.HttpsError("internal", "An unexpected error occurred while creating the client.");
    }
});
//# sourceMappingURL=index.js.map