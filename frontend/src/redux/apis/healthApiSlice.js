import { BASE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const healthApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    healthCheck: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/health`,
      }),
    }),
  }),
});

export const {
  useHealthCheckQuery,
} = healthApiSlice;
