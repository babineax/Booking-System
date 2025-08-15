import {
  addDoc,
  collection,
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
import { db } from "../config/firebase_config";

export interface Booking {
  id?: string;
  customerId: string;
  serviceId: string;
  staffMemberId: string;
  appointmentDate: Date | Timestamp;
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  status:
    | "pending"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";
  notes?: string;
  customerNotes?: string;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "refunded";
  reminderSent: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface CreateBookingData {
  customerId: string;
  serviceId: string;
  staffMemberId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  totalPrice: number;
  customerNotes?: string;
  notes?: string;
}

export interface BookingFilters {
  customerId?: string;
  staffMemberId?: string;
  serviceId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

class BookingService {
  private bookingsCollection = "bookings";

  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      // Check for time conflicts
      const hasConflict = await this.checkTimeConflict(
        bookingData.staffMemberId,
        bookingData.appointmentDate,
        bookingData.startTime,
        bookingData.endTime
      );

      if (hasConflict) {
        throw new Error("Time slot is already booked");
      }

      const bookingDoc: Omit<Booking, "id"> = {
        customerId: bookingData.customerId,
        serviceId: bookingData.serviceId,
        staffMemberId: bookingData.staffMemberId,
        appointmentDate: Timestamp.fromDate(bookingData.appointmentDate),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        status: "pending",
        notes: bookingData.notes || "",
        customerNotes: bookingData.customerNotes || "",
        totalPrice: bookingData.totalPrice,
        paymentStatus: "pending",
        reminderSent: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, this.bookingsCollection),
        bookingDoc
      );

      const createdBooking = await this.getBookingById(docRef.id);
      if (!createdBooking) {
        throw new Error("Failed to retrieve created booking");
      }

      return createdBooking;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create booking");
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const bookingDoc = await getDoc(doc(db, this.bookingsCollection, id));

      if (bookingDoc.exists()) {
        const data = bookingDoc.data();
        return {
          id: bookingDoc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        } as Booking;
      }

      return null;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get booking");
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, this.bookingsCollection),
        orderBy("appointmentDate", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        };
      }) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get bookings");
    }
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, this.bookingsCollection),
        where("customerId", "==", customerId),
        orderBy("appointmentDate", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        };
      }) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get customer bookings");
    }
  }

  async getBookingsByStaffMember(staffMemberId: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, this.bookingsCollection),
        where("staffMemberId", "==", staffMemberId),
        orderBy("appointmentDate", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        };
      }) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get staff member bookings");
    }
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookingsQuery = query(
        collection(db, this.bookingsCollection),
        where("appointmentDate", ">=", Timestamp.fromDate(startOfDay)),
        where("appointmentDate", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("appointmentDate")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        };
      }) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get bookings by date");
    }
  }

  async getBookingsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, this.bookingsCollection),
        where("appointmentDate", ">=", Timestamp.fromDate(startDate)),
        where("appointmentDate", "<=", Timestamp.fromDate(endDate)),
        orderBy("appointmentDate")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate:
            data.appointmentDate?.toDate() || data.appointmentDate,
        };
      }) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get bookings by date range");
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    try {
      const bookingRef = doc(db, this.bookingsCollection, id);
      const updateData = { ...updates };

      if (
        updateData.appointmentDate &&
        updateData.appointmentDate instanceof Date
      ) {
        updateData.appointmentDate = Timestamp.fromDate(
          updateData.appointmentDate
        );
      }

      await updateDoc(bookingRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      const updatedBooking = await this.getBookingById(id);
      if (!updatedBooking) {
        throw new Error("Failed to retrieve updated booking");
      }

      return updatedBooking;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update booking");
    }
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    try {
      const updates: Partial<Booking> = {
        status: "cancelled",
      };

      if (reason) {
        updates.notes = reason;
      }

      return this.updateBooking(id, updates);
    } catch (error: any) {
      throw new Error(error.message || "Failed to cancel booking");
    }
  }

  async confirmBooking(id: string): Promise<Booking> {
    try {
      return this.updateBooking(id, { status: "confirmed" });
    } catch (error: any) {
      throw new Error(error.message || "Failed to confirm booking");
    }
  }

  async completeBooking(id: string): Promise<Booking> {
    try {
      return this.updateBooking(id, {
        status: "completed",
        paymentStatus: "paid",
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to complete booking");
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.bookingsCollection, id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete booking");
    }
  }

  async checkTimeConflict(
    staffMemberId: string,
    appointmentDate: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    try {
      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);

      let bookingsQuery = query(
        collection(db, this.bookingsCollection),
        where("staffMemberId", "==", staffMemberId),
        where("appointmentDate", ">=", Timestamp.fromDate(startOfDay)),
        where("appointmentDate", "<=", Timestamp.fromDate(endOfDay)),
        where("status", "in", ["pending", "confirmed", "in-progress"])
      );

      const querySnapshot = await getDocs(bookingsQuery);

      const existingBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      const relevantBookings = excludeBookingId
        ? existingBookings.filter((booking) => booking.id !== excludeBookingId)
        : existingBookings;

      return relevantBookings.some((booking) => {
        return this.timesOverlap(
          startTime,
          endTime,
          booking.startTime,
          booking.endTime
        );
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to check time conflict");
    }
  }

  async getAvailableTimeSlots(
    staffMemberId: string,
    serviceId: string,
    date: Date
  ): Promise<string[]> {
    try {
      const allSlots = this.generateTimeSlots("09:00", "17:00", 30); // 30-minute slots

      const existingBookings = await this.getBookingsByDate(date);
      const staffBookings = existingBookings.filter(
        (booking) =>
          booking.staffMemberId === staffMemberId &&
          ["pending", "confirmed", "in-progress"].includes(booking.status)
      );

      return allSlots.filter((slot) => {
        const [hours, minutes] = slot.split(":").map(Number);
        const slotEndTime = this.addMinutesToTime(slot, 30);

        return !staffBookings.some((booking) =>
          this.timesOverlap(
            slot,
            slotEndTime,
            booking.startTime,
            booking.endTime
          )
        );
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to get available time slots");
    }
  }

  private timesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    intervalMinutes: number
  ): string[] {
    const slots: string[] = [];
    let current = startTime;

    while (current < endTime) {
      slots.push(current);
      current = this.addMinutesToTime(current, intervalMinutes);
    }

    return slots;
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);

    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export const bookingService = new BookingService();
export default bookingService;
