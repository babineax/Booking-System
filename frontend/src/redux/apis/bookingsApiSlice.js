import { BOOKINGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: BOOKINGS_URL,
        method: "POST",
        body: data,
      }),
    }),

    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/my-bookings`,
      }),
      providesTags: ["Booking"],
    }),

    getAllBookings: builder.query({
      query: (params) => ({
        url: BOOKINGS_URL,
        params,
      }),
      providesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BOOKINGS_URL}/${id}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }],
    }),

    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    getAvailableSlots: builder.query({
      query: (params) => ({
        url: `${BOOKINGS_URL}/available-slots`,
        params,
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useGetAvailableSlotsQuery,
} = bookingsApiSlice;
