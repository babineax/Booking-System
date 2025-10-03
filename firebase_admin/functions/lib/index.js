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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const googleapis_1 = require("googleapis");
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
const db = admin.firestore();
// --- Config & Secrets ---
const config = functions.config();
const GOOGLE_CLIENT_ID = (_a = config.google) === null || _a === void 0 ? void 0 : _a.client_id;
const GOOGLE_CLIENT_SECRET = (_b = config.google) === null || _b === void 0 ? void 0 : _b.client_secret;
const REDIRECT_URI = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/oauthcallback`;
const META_WA_TOKEN = (_c = config.meta) === null || _c === void 0 ? void 0 : _c.wa_token;
const META_WA_PHONE_NUMBER_ID = (_d = config.meta) === null || _d === void 0 ? void 0 : _d.wa_phone_number_id;
// --- API Clients ---
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
// --- Helper Function for Meta API ---
const sendWhatsAppTemplate = async (to, templateName, templateParams) => {
    var _a;
    if (!META_WA_TOKEN || !META_WA_PHONE_NUMBER_ID) {
        functions.logger.error("Meta WhatsApp credentials are not configured.");
        return;
    }
    const messagePayload = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
            name: templateName,
            language: { code: "en_US" },
            components: [
                {
                    type: "body",
                    parameters: templateParams.map((param) => ({
                        type: "text",
                        text: param,
                    })),
                },
            ],
        },
    };
    try {
        await axios_1.default.post(`https://graph.facebook.com/v19.0/${META_WA_PHONE_NUMBER_ID}/messages`, messagePayload, { headers: { Authorization: `Bearer ${META_WA_TOKEN}` } });
        functions.logger.info(`Sent ${templateName} to ${to}`);
    }
    catch (error) {
        functions.logger.error(`Failed to send WhatsApp message to ${to}:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
};
// --- Callable: Create Booking ---
exports.createBooking = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { serviceId, staffMemberId, customerId, startTime, endTime, clientName, clientEmail, clientPhone, } = data;
    // Basic validation
    if (!serviceId || !staffMemberId || !customerId || !startTime || !endTime) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required booking fields.");
    }
    try {
        const newBookingRef = await db.collection("bookings").add({
            serviceId,
            staffMemberId,
            customerId,
            startTime,
            endTime,
            clientName: clientName || null,
            clientEmail: clientEmail || null,
            clientPhone: clientPhone || null,
            status: "confirmed",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            reminderSent: false,
        });
        return { id: newBookingRef.id, success: true };
    }
    catch (error) {
        functions.logger.error("Error creating booking:", error);
        throw new functions.https.HttpsError("internal", "Failed to create booking.");
    }
});
// --- Callable: Availability ---
exports.getAvailableSlots = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { staffId, serviceId, date } = data;
    if (!staffId || !serviceId || !date) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
    }
    try {
        const [serviceDoc, staffDoc] = await Promise.all([
            db.collection("services").doc(serviceId).get(),
            db.collection("users").doc(staffId).get(),
        ]);
        if (!serviceDoc.exists || !staffDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Service or staff not found.");
        }
        const service = serviceDoc.data();
        const staff = staffDoc.data();
        const serviceDuration = service.duration;
        const dayOfWeek = new Date(date)
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
        const workingHours = (_a = staff.workingHours) === null || _a === void 0 ? void 0 : _a[dayOfWeek];
        if (!workingHours || !workingHours.isWorking) {
            return { slots: [] };
        }
        const dayStart = new Date(`${date}T00:00:00Z`);
        const dayEnd = new Date(`${date}T23:59:59Z`);
        const bookingsSnapshot = await db
            .collection("bookings")
            .where("staffMemberId", "==", staffId)
            .where("startTime", ">=", dayStart.toISOString())
            .where("startTime", "<=", dayEnd.toISOString())
            .get();
        const existingBookings = bookingsSnapshot.docs.map((doc) => doc.data());
        const availableSlots = [];
        const slotInterval = 15;
        const openTime = new Date(`${date}T${workingHours.startTime}:00`);
        const closeTime = new Date(`${date}T${workingHours.endTime}:00`);
        let currentSlotTime = openTime;
        while (currentSlotTime < closeTime) {
            const potentialSlotEnd = new Date(currentSlotTime.getTime() + serviceDuration * 60000);
            if (potentialSlotEnd > closeTime)
                break;
            const isConflict = existingBookings.some((booking) => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                return ((currentSlotTime >= bookingStart && currentSlotTime < bookingEnd) ||
                    (potentialSlotEnd > bookingStart && potentialSlotEnd <= bookingEnd));
            });
            if (!isConflict) {
                availableSlots.push(currentSlotTime.toTimeString().substring(0, 5));
            }
            currentSlotTime = new Date(currentSlotTime.getTime() + slotInterval * 60000);
        }
        return { slots: availableSlots };
    }
    catch (error) {
        functions.logger.error("Error in getAvailableSlots:", error);
        throw new functions.https.HttpsError("internal", "Failed to get availability.");
    }
});
// --- Callable: Create Client ---
exports.createClient = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { firstName, lastName, email, phone } = data;
    if (!firstName || !lastName || !email || !phone) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required client fields.");
    }
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            displayName: `${firstName} ${lastName}`,
            phoneNumber: phone,
        });
        await db.collection("users").doc(userRecord.uid).set({
            firstName,
            lastName,
            email,
            phone,
            role: "client",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { id: userRecord.uid, success: true };
    }
    catch (error) {
        if (error.code === "auth/email-already-exists") {
            throw new functions.https.HttpsError("already-exists", "A user with this email address already exists.");
        }
        functions.logger.error("Error creating client:", error);
        throw new functions.https.HttpsError("internal", "Failed to create client.");
    }
});
// --- Callable: Create Staff ---
exports.createStaff = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { firstName, lastName, email, phone, bio } = data;
    if (!firstName || !lastName || !email) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required staff fields.");
    }
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            displayName: `${firstName} ${lastName}`,
            phoneNumber: phone,
        });
        await db
            .collection("users")
            .doc(userRecord.uid)
            .set({
            firstName,
            lastName,
            email,
            phone,
            bio: bio || "",
            role: "staff",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { id: userRecord.uid, success: true };
    }
    catch (error) {
        if (error.code === "auth/email-already-exists") {
            throw new functions.https.HttpsError("already-exists", "A user with this email address already exists.");
        }
        functions.logger.error("Error creating staff:", error);
        throw new functions.https.HttpsError("internal", "Failed to create staff member.");
    }
});
// --- Callable: Google Auth ---
exports.handleGoogleAuthCallback = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
    }
    const { code, staffId } = data;
    if (!code || !staffId) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
    }
    try {
        const adminUserDoc = await db
            .collection("users")
            .doc(context.auth.uid)
            .get();
        if (!adminUserDoc.exists || ((_a = adminUserDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            throw new functions.https.HttpsError("permission-denied", "Only admins can perform this action.");
        }
        const { tokens } = await oauth2Client.getToken(code);
        await db
            .collection("users")
            .doc(staffId)
            .update({ googleAuth: { refreshToken: tokens.refresh_token } });
        return { success: true };
    }
    catch (error) {
        functions.logger.error("Error in handleGoogleAuthCallback:", error);
        throw new functions.https.HttpsError("internal", "Failed to connect Google Calendar.");
    }
});
// --- Firestore Trigger: On Booking Created ---
exports.onBookingCreated = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap, context) => {
    var _a, _b, _c;
    try {
        const booking = snap.data();
        if (!booking) {
            functions.logger.error("No data for booking creation event.");
            return;
        }
        const staffDoc = await db
            .collection("users")
            .doc(booking.staffMemberId)
            .get();
        const customerDoc = await db
            .collection("users")
            .doc(booking.customerId)
            .get();
        const serviceDoc = await db
            .collection("services")
            .doc(booking.serviceId)
            .get();
        // Google Calendar Sync
        if (staffDoc.exists && ((_b = (_a = staffDoc.data()) === null || _a === void 0 ? void 0 : _a.googleAuth) === null || _b === void 0 ? void 0 : _b.refreshToken)) {
            const staff = staffDoc.data();
            oauth2Client.setCredentials({
                refresh_token: staff.googleAuth.refreshToken,
            });
            const calendar = googleapis_1.google.calendar({
                version: "v3",
                auth: oauth2Client,
            });
            const event = {
                summary: serviceDoc.exists
                    ? `${serviceDoc.data().name} with ${customerDoc.exists ? customerDoc.data().firstName : "a customer"}`
                    : "Booking",
                start: { dateTime: new Date(booking.startTime).toISOString() },
                end: { dateTime: new Date(booking.endTime).toISOString() },
            };
            await calendar.events.insert({
                calendarId: "primary",
                requestBody: event,
            });
        }
        // WhatsApp Confirmation via Meta API
        if (customerDoc.exists && ((_c = customerDoc.data()) === null || _c === void 0 ? void 0 : _c.phone)) {
            const customer = customerDoc.data();
            const serviceName = serviceDoc.exists
                ? serviceDoc.data().name
                : "your service";
            const bookingDate = new Date(booking.startTime).toLocaleDateString();
            const bookingTime = new Date(booking.startTime).toLocaleTimeString();
            await sendWhatsAppTemplate(customer.phone, "booking_confirmation", [
                customer.firstName,
                serviceName,
                bookingDate,
                bookingTime,
            ]);
        }
    }
    catch (error) {
        functions.logger.error("Error in onBookingCreated trigger:", error);
    }
});
// --- Scheduled Trigger: Booking Reminders ---
exports.sendBookingReminders = functions.pubsub
    .schedule("every 60 minutes")
    .onRun(async (context) => {
    try {
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const bookingsSnapshot = await db
            .collection("bookings")
            .where("status", "==", "confirmed")
            .where("reminderSent", "==", false)
            .where("startTime", ">=", now.toISOString())
            .where("startTime", "<=", twentyFourHoursFromNow.toISOString())
            .get();
        if (bookingsSnapshot.empty) {
            return;
        }
        const reminderPromises = bookingsSnapshot.docs.map(async (doc) => {
            var _a;
            const booking = doc.data();
            const customerDoc = await db
                .collection("users")
                .doc(booking.customerId)
                .get();
            if (customerDoc.exists && ((_a = customerDoc.data()) === null || _a === void 0 ? void 0 : _a.phone)) {
                const customer = customerDoc.data();
                const bookingTime = new Date(booking.startTime).toLocaleTimeString();
                // Assumes you have a template named 'booking_reminder' with one variable for the time
                await sendWhatsAppTemplate(customer.phone, "booking_reminder", [
                    bookingTime,
                ]);
                return doc.ref.update({ reminderSent: true });
            }
            return Promise.resolve();
        });
        await Promise.all(reminderPromises);
    }
    catch (error) {
        functions.logger.error("Error in sendBookingReminders:", error);
    }
});
//# sourceMappingURL=index.js.map