import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { bookingService } from "../../../firebase/services";

export const firebaseBookingsApiSlice = createApi({
  reducerPath: "firebaseBookingsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      queryFn: async (bookingData) => {
        try {
          const result = await bookingService.createBooking(bookingData);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      queryFn: async (id) => {
        try {
          const result = await bookingService.getBookingById(id);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    getAllBookings: builder.query({
      queryFn: async () => {
        try {
          const result = await bookingService.getAllBookings();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Booking", id })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    getBookingsByCustomer: builder.query({
      queryFn: async (customerId) => {
        try {
          const result = await bookingService.getBookingsByCustomer(customerId);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, customerId) => [{ type: "Booking", id: `CUSTOMER_${customerId}` }],
    }),

    getBookingsByStaffMember: builder.query({
      queryFn: async (staffMemberId) => {
        try {
          const result = await bookingService.getBookingsByStaffMember(staffMemberId);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, staffMemberId) => [{ type: "Booking", id: `STAFF_${staffMemberId}` }],
    }),

    getBookingsByDate: builder.query({
      queryFn: async (date) => {
        try {
          const result = await bookingService.getBookingsByDate(new Date(date));
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, date) => [{ type: "Booking", id: `DATE_${date}` }],
    }),

    getBookingsByDateRange: builder.query({
      queryFn: async ({ startDate, endDate }) => {
        try {
          const result = await bookingService.getBookingsByDateRange(
            new Date(startDate), 
            new Date(endDate)
          );
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, { startDate, endDate }) => [
        { type: "Booking", id: `RANGE_${startDate}_${endDate}` }
      ],
    }),

    updateBooking: builder.mutation({
      queryFn: async ({ id, ...updates }) => {
        try {
          const result = await bookingService.updateBooking(id, updates);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }],
    }),

    cancelBooking: builder.mutation({
      queryFn: async ({ id, reason }) => {
        try {
          const result = await bookingService.cancelBooking(id, reason);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }],
    }),

    confirmBooking: builder.mutation({
      queryFn: async (id) => {
        try {
          const result = await bookingService.confirmBooking(id);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    completeBooking: builder.mutation({
      queryFn: async (id) => {
        try {
          const result = await bookingService.completeBooking(id);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    deleteBooking: builder.mutation({
      queryFn: async (id) => {
        try {
          await bookingService.deleteBooking(id);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    checkTimeConflict: builder.query({
      queryFn: async ({ staffMemberId, appointmentDate, startTime, endTime, excludeBookingId }) => {
        try {
          const result = await bookingService.checkTimeConflict(
            staffMemberId, 
            new Date(appointmentDate), 
            startTime, 
            endTime, 
            excludeBookingId
          );
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

    getAvailableTimeSlots: builder.query({
      queryFn: async ({ staffMemberId, serviceId, date }) => {
        try {
          const result = await bookingService.getAvailableTimeSlots(
            staffMemberId, 
            serviceId, 
            new Date(date)
          );
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, { staffMemberId, date }) => [
        { type: "Booking", id: `SLOTS_${staffMemberId}_${date}` }
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetAllBookingsQuery,
  useGetBookingsByCustomerQuery,
  useGetBookingsByStaffMemberQuery,
  useGetBookingsByDateQuery,
  useGetBookingsByDateRangeQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useCompleteBookingMutation,
  useDeleteBookingMutation,
  useCheckTimeConflictQuery,
  useGetAvailableTimeSlotsQuery,
} = firebaseBookingsApiSlice;
