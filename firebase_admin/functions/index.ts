import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

export const createBooking = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { serviceId, startTime } = data;
  const userId = context.auth.uid;

  // Validate input.
  if (!serviceId || !startTime) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with two arguments, "serviceId" and "startTime".'
    );
  }

  const bookingRef = db.collection('bookings');

  try {
    await db.runTransaction(async (transaction) => {
      const query = bookingRef
        .where('serviceId', '==', serviceId)
        .where('startTime', '==', startTime);

      const snapshot = await transaction.get(query);

      if (!snapshot.empty) {
        throw new functions.https.HttpsError(
          'already-exists',
          'This time slot is no longer available.'
        );
      }

      transaction.set(bookingRef.doc(), {
        serviceId,
        startTime,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'confirmed',
      });
    });

    return { success: true, message: 'Booking created successfully.' };
  } catch (error) {
    console.error('Booking transaction failed: ', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      'An internal error occurred.'
    );
  }
});
