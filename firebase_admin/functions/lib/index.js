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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const googleapis_1 = require("googleapis");
const twilio_1 = __importDefault(require("twilio"));
admin.initializeApp();
const db = admin.firestore();
// --- Config & Secrets ---
const config = functions.config();
const GOOGLE_CLIENT_ID = (_a = config.google) === null || _a === void 0 ? void 0 : _a.client_id;
const GOOGLE_CLIENT_SECRET = (_b = config.google) === null || _b === void 0 ? void 0 : _b.client_secret;
const REDIRECT_URI = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/oauthcallback`;
const TWILIO_ACCOUNT_SID = (_c = config.twilio) === null || _c === void 0 ? void 0 : _c.account_sid;
const TWILIO_AUTH_TOKEN = (_d = config.twilio) === null || _d === void 0 ? void 0 : _d.auth_token;
const TWILIO_PHONE_NUMBER = (_e = config.twilio) === null || _e === void 0 ? void 0 : _e.phone_number;
// --- API Clients ---
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
const twilioClient = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
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
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const workingHours = (_a = staff.workingHours) === null || _a === void 0 ? void 0 : _a[dayOfWeek];
        if (!workingHours || !workingHours.isWorking) {
            return { slots: [] };
        }
        const dayStart = new Date(`${date}T00:00:00Z`);
        const dayEnd = new Date(`${date}T23:59:59Z`);
        const bookingsSnapshot = await db.collection("bookings")
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
                return (currentSlotTime >= bookingStart && currentSlotTime < bookingEnd) || (potentialSlotEnd > bookingStart && potentialSlotEnd <= bookingEnd);
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
        const adminUserDoc = await db.collection("users").doc(context.auth.uid).get();
        if (!adminUserDoc.exists || ((_a = adminUserDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            throw new functions.https.HttpsError("permission-denied", "Only admins can perform this action.");
        }
        const { tokens } = await oauth2Client.getToken(code);
        await db.collection("users").doc(staffId).update({ googleAuth: { refreshToken: tokens.refresh_token } });
        return { success: true };
    }
    catch (error) {
        functions.logger.error("Error in handleGoogleAuthCallback:", error);
        throw new functions.https.HttpsError("internal", "Failed to connect Google Calendar.");
    }
});
// --- Firestore Trigger: On Booking Created ---
exports.onBookingCreated = functions.firestore.document("bookings/{bookingId}").onCreate(async (snap, context) => {
    var _a, _b, _c;
    try {
        const booking = snap.data();
        if (!booking) {
            functions.logger.error("No data for booking creation event.");
            return;
        }
        const staffDoc = await db.collection("users").doc(booking.staffMemberId).get();
        const customerDoc = await db.collection("users").doc(booking.customerId).get();
        const serviceDoc = await db.collection("services").doc(booking.serviceId).get();
        // Google Calendar Sync
        if (staffDoc.exists && ((_b = (_a = staffDoc.data()) === null || _a === void 0 ? void 0 : _a.googleAuth) === null || _b === void 0 ? void 0 : _b.refreshToken)) {
            const staff = staffDoc.data();
            oauth2Client.setCredentials({ refresh_token: staff.googleAuth.refreshToken });
            const calendar = googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
            const event = {
                summary: serviceDoc.exists ? `${serviceDoc.data().name} with ${customerDoc.exists ? customerDoc.data().firstName : "a customer"}` : "Booking",
                start: { dateTime: new Date(booking.startTime).toISOString() },
                end: { dateTime: new Date(booking.endTime).toISOString() },
            };
            await calendar.events.insert({ calendarId: "primary", requestBody: event });
        }
        // WhatsApp Confirmation
        if (customerDoc.exists && ((_c = customerDoc.data()) === null || _c === void 0 ? void 0 : _c.phone)) {
            const customer = customerDoc.data();
            const serviceName = serviceDoc.exists ? serviceDoc.data().name : "a service";
            const messageBody = `Hi ${customer.firstName}, your booking for ${serviceName} is confirmed!`;
            await twilioClient.messages.create({
                body: messageBody,
                from: TWILIO_PHONE_NUMBER,
                to: `whatsapp:${customer.phone}`,
            });
        }
    }
    catch (error) {
        functions.logger.error("Error in onBookingCreated trigger:", error);
    }
});
// --- Scheduled Trigger: Booking Reminders ---
exports.sendBookingReminders = functions.pubsub.schedule("every 60 minutes").onRun(async (context) => {
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
            return;
        }
        const reminderPromises = bookingsSnapshot.docs.map(async (doc) => {
            var _a;
            const booking = doc.data();
            const customerDoc = await db.collection("users").doc(booking.customerId).get();
            if (customerDoc.exists && ((_a = customerDoc.data()) === null || _a === void 0 ? void 0 : _a.phone)) {
                const customer = customerDoc.data();
                const messageBody = `Reminder: Your booking is tomorrow at ${new Date(booking.startTime).toLocaleTimeString()}.`;
                await twilioClient.messages.create({
                    body: messageBody,
                    from: TWILIO_PHONE_NUMBER,
                    to: `whatsapp:${customer.phone}`,
                });
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