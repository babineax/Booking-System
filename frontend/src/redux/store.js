import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { firebaseBookingsApiSlice } from "./apis/firebaseBookingsApiSlice";
import { firebaseBusinessHoursApiSlice } from "./apis/firebaseBusinessHoursApiSlice";
import { firebasePeopleApiSlice } from "./apis/firebasePeopleApiSlice";
import { firebaseServicesApiSlice } from "./apis/firebaseServicesApiSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [firebasePeopleApiSlice.reducerPath]: firebasePeopleApiSlice.reducer,
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
      firebasePeopleApiSlice.middleware,
      firebaseServicesApiSlice.middleware,
      firebaseBookingsApiSlice.middleware,
      firebaseBusinessHoursApiSlice.middleware
    ),
  devTools: "production",
});

setupListeners(store.dispatch);
