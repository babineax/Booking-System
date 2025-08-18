import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = {
        ...action.payload.user,
        role: action.payload.user?.role || "user", // ✅ pull role from Firestore or fallback
      };
      state.firebaseUser = action.payload.firebaseUser;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const {
  setCredentials,
  setFirebaseUser,
  setUserInfo,
  setLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
