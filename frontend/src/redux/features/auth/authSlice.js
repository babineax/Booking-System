import AsyncStorage from "@react-native-async-storage/async-storage";
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
      state.userInfo = action.payload.user;
      state.firebaseUser = action.payload.firebaseUser;
      state.isAuthenticated = true;
      state.isLoading = false;

      const storeData = async () => {
        try {
          await AsyncStorage.setItem(
            "userInfo",
            JSON.stringify(action.payload.user)
          );
          
          
          if (action.payload.firebaseUser) {
            const idToken = await action.payload.firebaseUser.getIdToken();
            await AsyncStorage.setItem("firebaseToken", idToken);
          }
          
          const expirationTime = (
            new Date().getTime() +
            30 * 24 * 60 * 60 * 1000
          ).toString();
          await AsyncStorage.setItem("expirationTime", expirationTime);
        } catch (e) {
          console.error("Error storing user data", e);
        }
      };

      storeData();
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

      const clearData = async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error("Error clearing user data", e);
        }
      };

      clearData();
    },
  },
});

export const { 
  setCredentials, 
  setFirebaseUser, 
  setUserInfo, 
  setLoading, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;
