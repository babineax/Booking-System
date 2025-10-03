import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// TODO: Add Google Calendar and WhatsApp integration logic

export const onBookingCreated = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const bookingData = snap.data();
    const bookingId = context.params.bookingId;

    console.log(`New booking created with ID: ${bookingId}`);
    console.log("Booking data:", bookingData);

    // 1. Get client and staff data
    const clientId = bookingData.clientId;
    const staffId = bookingData.staffId;

    const clientDoc = await admin.firestore().collection("clients").doc(clientId).get();
    const staffDoc = await admin.firestore().collection("staff").doc(staffId).get();

    if (!clientDoc.exists || !staffDoc.exists) {
      console.error("Client or staff not found");
      return;
    }

    const clientData = clientDoc.data();
    const staffData = staffDoc.data();

    // 2. Create Google Calendar event (placeholder)
    console.log(`Creating Google Calendar event for staff: ${staffData?.email}`);

    // 3. Send WhatsApp notifications (placeholder)
    console.log(`Sending WhatsApp notification to client: ${clientData?.phone}`);
    console.log(`Sending WhatsApp notification to staff: ${staffData?.phone}`);
  });
