import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { clientService } from "../../../firebase/services/clientService";
import { staffService } from "../../../firebase/services/staffService";

export const firebasePeopleApiSlice = createApi({
  reducerPath: "firebasePeopleApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Staff", "Client"],
  endpoints: (builder) => ({
    getStaff: builder.query({
      queryFn: async () => {
        try {
          const staff = await staffService.getStaffMembers();
          return { data: staff };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Staff"],
    }),
    getClients: builder.query({
      queryFn: async () => {
        try {
          const clients = await clientService.getAllClients();
          return { data: clients };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Client"],
    }),
  }),
});

export const { useGetStaffQuery, useGetClientsQuery } = firebasePeopleApiSlice;
