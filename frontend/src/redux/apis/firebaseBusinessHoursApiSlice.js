import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { businessHoursService } from "../../../firebase";

export const firebaseBusinessHoursApiSlice = createApi({
  reducerPath: "firebaseBusinessHoursApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["BusinessHours"],
  endpoints: (builder) => ({
    createBusinessHours: builder.mutation({
      queryFn: async (businessHoursData) => {
        try {
          const result = await businessHoursService.createBusinessHours(
            businessHoursData
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      invalidatesTags: ["BusinessHours"],
    }),

    getBusinessHoursById: builder.query({
      queryFn: async (id) => {
        try {
          const result = await businessHoursService.getBusinessHoursById(id);
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: "BusinessHours", id }],
    }),

    getBusinessHoursByStaffMember: builder.query({
      queryFn: async (staffMemberId) => {
        try {
          const result =
            await businessHoursService.getBusinessHoursByStaffMember(
              staffMemberId
            );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result, error, staffMemberId) => [
        { type: "BusinessHours", id: `STAFF_${staffMemberId}` },
      ],
    }),

    getBusinessHoursByStaffAndDay: builder.query({
      queryFn: async ({ staffMemberId, dayOfWeek }) => {
        try {
          const result =
            await businessHoursService.getBusinessHoursByStaffAndDay(
              staffMemberId,
              dayOfWeek
            );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result, error, { staffMemberId, dayOfWeek }) => [
        { type: "BusinessHours", id: `STAFF_${staffMemberId}_${dayOfWeek}` },
      ],
    }),

    getAllBusinessHours: builder.query({
      queryFn: async () => {
        try {
          const result = await businessHoursService.getAllBusinessHours();
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "BusinessHours", id })),
              { type: "BusinessHours", id: "LIST" },
            ]
          : [{ type: "BusinessHours", id: "LIST" }],
    }),

    updateBusinessHours: builder.mutation({
      queryFn: async ({ id, ...updates }) => {
        try {
          const result = await businessHoursService.updateBusinessHours(
            id,
            updates
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "BusinessHours", id },
      ],
    }),

    deleteBusinessHours: builder.mutation({
      queryFn: async (id) => {
        try {
          await businessHoursService.deleteBusinessHours(id);
          return { data: undefined };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "BusinessHours", id }],
    }),

    setWeeklyBusinessHours: builder.mutation({
      queryFn: async ({ staffMemberId, weeklyHours }) => {
        try {
          const result = await businessHoursService.setWeeklyBusinessHours(
            staffMemberId,
            weeklyHours
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      invalidatesTags: (result, error, { staffMemberId }) => [
        { type: "BusinessHours", id: `STAFF_${staffMemberId}` },
      ],
    }),

    getWorkingDays: builder.query({
      queryFn: async (staffMemberId) => {
        try {
          const result = await businessHoursService.getWorkingDays(
            staffMemberId
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result, error, staffMemberId) => [
        { type: "BusinessHours", id: `WORKING_DAYS_${staffMemberId}` },
      ],
    }),

    isStaffAvailable: builder.query({
      queryFn: async ({ staffMemberId, dayOfWeek, time }) => {
        try {
          const result = await businessHoursService.isStaffAvailable(
            staffMemberId,
            dayOfWeek,
            time
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
    }),

    getAvailableHours: builder.query({
      queryFn: async ({ staffMemberId, dayOfWeek }) => {
        try {
          const result = await businessHoursService.getAvailableHours(
            staffMemberId,
            dayOfWeek
          );
          return { data: result };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      providesTags: (result, error, { staffMemberId, dayOfWeek }) => [
        {
          type: "BusinessHours",
          id: `AVAILABLE_${staffMemberId}_${dayOfWeek}`,
        },
      ],
    }),
  }),
});

export const {
  useCreateBusinessHoursMutation,
  useGetBusinessHoursByIdQuery,
  useGetBusinessHoursByStaffMemberQuery,
  useGetBusinessHoursByStaffAndDayQuery,
  useGetAllBusinessHoursQuery,
  useUpdateBusinessHoursMutation,
  useDeleteBusinessHoursMutation,
  useSetWeeklyBusinessHoursMutation,
  useGetWorkingDaysQuery,
  useIsStaffAvailableQuery,
  useGetAvailableHoursQuery,
} = firebaseBusinessHoursApiSlice;
