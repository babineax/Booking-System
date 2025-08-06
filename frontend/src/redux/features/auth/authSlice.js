import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

// Initial state — will be overridden after hydration
const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      const storeData = async () => {
        try {
          await AsyncStorage.setItem(
            "userInfo",
            JSON.stringify(action.payload)
          );
          
          // Also store the token separately for API requests
          if (action.payload.token) {
            await AsyncStorage.setItem("token", action.payload.token);
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

    logout: (state) => {
      state.userInfo = null;

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

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
