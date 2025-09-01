import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { firebaseBookingsApiSlice } from "./apis/firebaseBookingsApiSlice";
import { firebaseBusinessHoursApiSlice } from "./apis/firebaseBusinessHoursApiSlice";
import { firebaseServicesApiSlice } from "./apis/firebaseServicesApiSlice";
import { firebaseUsersApiSlice } from "./apis/firebaseUsersApiSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [firebaseUsersApiSlice.reducerPath]: firebaseUsersApiSlice.reducer,
    [firebaseServicesApiSlice.reducerPath]: firebaseServicesApiSlice.reducer,
    [firebaseBookingsApiSlice.reducerPath]: firebaseBookingsApiSlice.reducer,
    [firebaseBusinessHoursApiSlice.reducerPath]:
      firebaseBusinessHoursApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["firebase", "firestore"],
      },
    }).concat(
      firebaseUsersApiSlice.middleware,
      firebaseServicesApiSlice.middleware,
      firebaseBookingsApiSlice.middleware,
      firebaseBusinessHoursApiSlice.middleware
    ),
  devTools: "production",
});

setupListeners(store.dispatch);
