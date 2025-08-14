import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { userService } from "../../../firebase/services";

export const firebaseUsersApiSlice = createApi({
  reducerPath: "firebaseUsersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async (credentials) => {
        try {
          const result = await userService.login(credentials);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

    logout: builder.mutation({
      queryFn: async () => {
        try {
          await userService.logout();
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

    register: builder.mutation({
      queryFn: async (userData) => {
        try {
          const result = await userService.register(userData);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ["User"],
    }),

    profile: builder.mutation({
      queryFn: async ({ id, data }) => {
        try {
          const result = await userService.updateProfile(id, data);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    getUsers: builder.query({
      queryFn: async () => {
        try {
          const result = await userService.getAllUsers();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getStaffMembers: builder.query({
      queryFn: async () => {
        try {
          const result = await userService.getStaffMembers();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "STAFF_LIST" },
            ]
          : [{ type: "User", id: "STAFF_LIST" }],
    }),

    deleteUser: builder.mutation({
      queryFn: async (userId) => {
        try {
          await userService.deleteUser(userId);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),

    getUserDetails: builder.query({
      queryFn: async (id) => {
        try {
          const result = await userService.getUserById(id);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation({
      queryFn: async ({ userId, data }) => {
        try {
          const result = await userService.updateUser(userId, data);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { userId }) => [{ type: "User", id: userId }],
    }),

    getCurrentUser: builder.query({
      queryFn: async () => {
        try {
          const result = await userService.getCurrentUserData();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: (result) => result ? [{ type: "User", id: result.id }] : [],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetStaffMembersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useGetCurrentUserQuery,
} = firebaseUsersApiSlice;
