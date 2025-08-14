import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { serviceService } from "../../../firebase/services";

export const firebaseServicesApiSlice = createApi({
  reducerPath: "firebaseServicesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query({
      queryFn: async () => {
        try {
          const result = await serviceService.getAllServices();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Service", id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    getActiveServices: builder.query({
      queryFn: async () => {
        try {
          const result = await serviceService.getActiveServices();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Service", id })),
              { type: "Service", id: "ACTIVE_LIST" },
            ]
          : [{ type: "Service", id: "ACTIVE_LIST" }],
    }),

    getServiceById: builder.query({
      queryFn: async (id) => {
        try {
          const result = await serviceService.getServiceById(id);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    getServicesByCategory: builder.query({
      queryFn: async (category) => {
        try {
          const result = await serviceService.getServicesByCategory(category);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, category) => [{ type: "Service", id: `CATEGORY_${category}` }],
    }),

    getServicesByStaff: builder.query({
      queryFn: async (staffMemberId) => {
        try {
          const result = await serviceService.getServicesByStaffMember(staffMemberId);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, staffMemberId) => [{ type: "Service", id: `STAFF_${staffMemberId}` }],
    }),

    createService: builder.mutation({
      queryFn: async (serviceData) => {
        try {
          const result = await serviceService.createService(serviceData);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      queryFn: async ({ id, ...serviceData }) => {
        try {
          const result = await serviceService.updateService(id, serviceData);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }],
    }),

    deleteService: builder.mutation({
      queryFn: async (id) => {
        try {
          await serviceService.deleteService(id);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    addStaffToService: builder.mutation({
      queryFn: async ({ serviceId, staffMemberId }) => {
        try {
          const result = await serviceService.addStaffToService(serviceId, staffMemberId);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { serviceId }) => [{ type: "Service", id: serviceId }],
    }),

    removeStaffFromService: builder.mutation({
      queryFn: async ({ serviceId, staffMemberId }) => {
        try {
          const result = await serviceService.removeStaffFromService(serviceId, staffMemberId);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { serviceId }) => [{ type: "Service", id: serviceId }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetActiveServicesQuery,
  useGetServiceByIdQuery,
  useGetServicesByCategoryQuery,
  useGetServicesByStaffQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useAddStaffToServiceMutation,
  useRemoveStaffFromServiceMutation,
} = firebaseServicesApiSlice;
