import { SERVICES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const servicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: `${SERVICES_URL}`,
      }),
      providesTags: ["Service"],
    }),

    getServiceById: builder.query({
      query: (id) => ({
        url: `${SERVICES_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    getServicesByCategory: builder.query({
      query: (category) => ({
        url: `${SERVICES_URL}/category/${category}`,
      }),
    }),

    createService: builder.mutation({
      query: (data) => ({
        url: `${SERVICES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${SERVICES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `${SERVICES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useGetServicesByCategoryQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApiSlice;
