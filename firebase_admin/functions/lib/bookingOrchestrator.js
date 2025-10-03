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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBookingCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// TODO: Add Google Calendar and WhatsApp integration logic
exports.onBookingCreated = functions.firestore
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
    console.log(`Creating Google Calendar event for staff: ${staffData === null || staffData === void 0 ? void 0 : staffData.email}`);
    // 3. Send WhatsApp notifications (placeholder)
    console.log(`Sending WhatsApp notification to client: ${clientData === null || clientData === void 0 ? void 0 : clientData.phone}`);
    console.log(`Sending WhatsApp notification to staff: ${staffData === null || staffData === void 0 ? void 0 : staffData.phone}`);
});
//# sourceMappingURL=bookingOrchestrator.js.map