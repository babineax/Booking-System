import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../config/firebase_config";

// ... (Booking, CreateBookingData, BookingFilters interfaces remain the same)

class BookingService {
  private bookingsCollection = "bookings";
  private functions = getFunctions();

  async createBooking(bookingData: any): Promise<any> {
    try {
      const createBookingCallable = httpsCallable(this.functions, 'createBooking');
      const result = await createBookingCallable(bookingData);
      return result.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingById(id: string): Promise<any | null> {
    // ... (original getBookingById logic)
    return Promise.resolve(null);
  }

  // ... (all other original methods like getAllBookings, etc.)

  async getAvailableTimeSlots(
    staffMemberId: string,
    serviceId: string,
    date: Date
  ): Promise<string[]> {
    try {
      const getAvailableSlotsCallable = httpsCallable(this.functions, 'getAvailableSlots');
      const result = await getAvailableSlotsCallable({
        staffId: staffMemberId,
        serviceId: serviceId,
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      });
      return (result.data as any).slots;
    } catch (error: any) {
      console.error("Error calling getAvailableSlots function:", error);
      throw new Error(error.message || "Failed to get available time slots");
    }
  }
}

export const bookingService = new BookingService();
export default bookingService;