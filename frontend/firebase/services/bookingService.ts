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
        appointmentDate: Timestamp.fromDate(
          bookingData.appointmentDate instanceof Date
            ? bookingData.appointmentDate
            : new Date(bookingData.appointmentDate)
        ),
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
      } catch (indexError: any) {
        if (indexError.message?.includes("index")) {
          console.warn("Index not ready, fetching without ordering");
          const bookingsQuery = query(collection(db, this.bookingsCollection));
          const querySnapshot = await getDocs(bookingsQuery);
          const bookings = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              appointmentDate:
                data.appointmentDate?.toDate() || data.appointmentDate,
            };
          }) as Booking[];

          return bookings.sort((a, b) => {
            const dateA =
              a.appointmentDate instanceof Timestamp
                ? a.appointmentDate.toDate()
                : new Date(a.appointmentDate);
            const dateB =
              b.appointmentDate instanceof Timestamp
                ? b.appointmentDate.toDate()
                : new Date(b.appointmentDate);
            return dateB.getTime() - dateA.getTime();
          });
        }
        throw indexError;
      }
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

      try {
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
      } catch (indexError: any) {
        if (indexError.message?.includes("index")) {
          console.warn("Index not ready, filtering bookings client-side");
          const bookingsQuery = query(collection(db, this.bookingsCollection));
          const querySnapshot = await getDocs(bookingsQuery);

          const bookings = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              appointmentDate:
                data.appointmentDate instanceof Timestamp
                  ? data.appointmentDate.toDate()
                  : new Date(data.appointmentDate),
            };
          }) as Booking[];

          return bookings
            .filter((booking) => {
              const bookingDate = booking.appointmentDate;
              return bookingDate >= startOfDay && bookingDate <= endOfDay;
            })
            .sort((a, b) => {
              const dateA =
                a.appointmentDate instanceof Date
                  ? a.appointmentDate
                  : (a.appointmentDate as Timestamp).toDate();
              const dateB =
                b.appointmentDate instanceof Date
                  ? b.appointmentDate
                  : (b.appointmentDate as Timestamp).toDate();
              return dateA.getTime() - dateB.getTime();
            });
        }
        throw indexError;
      }
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

import { getFunctions, httpsCallable } from "firebase/functions";

// ... (keep existing imports)

class BookingService {
  private bookingsCollection = "bookings";
  private functions = getFunctions();

  // ... (keep other methods like createBooking, getBookingById, etc.)

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
}

export const bookingService = new BookingService();
export default bookingService;
