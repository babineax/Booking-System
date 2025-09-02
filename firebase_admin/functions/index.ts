// Use CommonJS imports
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/** Types for request & response */
interface BookingRequest {
  serviceId: string;
  startTime: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
}

exports.createBooking = functions.https.onCall<BookingRequest, BookingResponse>(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { serviceId, startTime } = data;
    const userId = context.auth.uid;

    if (!serviceId || !startTime) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'Must provide "serviceId" and "startTime".'
      );
    }

    const parsed = new Date(startTime);
    if (isNaN(parsed.getTime())) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        '"startTime" must be a valid date.'
      );
    }

    const slotId = `${encodeURIComponent(serviceId)}_${encodeURIComponent(
      parsed.toISOString()
    )}`;
    const docRef = db.collection("bookings").doc(slotId);

    try {
      await db.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
        const snap = await tx.get(docRef);
        if (snap.exists) {
          throw new functions.https.HttpsError(
            "already-exists",
            "This time slot is no longer available."
          );
        }
        tx.set(docRef, {
          serviceId,
          startTime: admin.firestore.Timestamp.fromDate(parsed),
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "confirmed",
        });
      });

      return { success: true, message: "Booking created successfully." };
    } catch (err: any) {
      console.error("Booking transaction failed:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError(
        "internal",
        "An internal error occurred."
      );
    }
  }
);
