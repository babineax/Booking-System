import { BUSINESS_HOURS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const businessHoursApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessHours: builder.query({
      query: (staffId) => `${BUSINESS_HOURS_URL}/${staffId}`,
      providesTags: ["BusinessHour"],
    }),

    getAllBusinessHours: builder.query({
      query: () => BUSINESS_HOURS_URL,
      providesTags: ["BusinessHour"],
    }),

    setBusinessHours: builder.mutation({
      query: (data) => ({
        url: BUSINESS_HOURS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BusinessHour"],
    }),
  }),
});

export const {
  useGetBusinessHoursQuery,
  useGetAllBusinessHoursQuery,
  useSetBusinessHoursMutation,
} = businessHoursApiSlice;
