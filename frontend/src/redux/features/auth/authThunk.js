import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/config/firebase_config";
import { authService } from "../../../../firebase/services/authService";
import { logout, setCredentials, setLoading } from "./authSlice";

export const initAuth = () => async (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const storedUserJSON = await AsyncStorage.getItem("userInfo");
        const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
        const freshUser = await authService.getUserById(firebaseUser.uid);
        dispatch(
          setCredentials({
            user: freshUser || storedUser,
            firebaseUser,
          })
        );
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Error restoring auth state", error);
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  });

  return unsubscribe; // useful for cleanup
};

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Step 1: Firebase login + fetch user profile
    const { user, firebaseUser } = await authService.login({ email, password });

    // Step 2: Store in AsyncStorage
    const idToken = await firebaseUser.getIdToken();
    await AsyncStorage.multiSet([
      ["userInfo", JSON.stringify(user)],
      ["firebaseToken", idToken],
      ["expirationTime", (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()],
    ]);

    // Step 3: Update Redux state
    dispatch(setCredentials({ user, firebaseUser }));
  } catch (error) {
    // Show the error to the user (if in React Native, use Alert)
    if (typeof window === "undefined" && global && global.Alert) {
      global.Alert.alert("Login Failed", error.message || "An error occurred");
    } else if (typeof window !== "undefined" && window.alert) {
      window.alert("Login Failed: " + (error.message || "An error occurred"));
    } else {
      // fallback: log to console
      console.error("Login error", error);
    }
    // Optionally, you can dispatch an error state here if you want to show it in the UI
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authService.logout();
    await AsyncStorage.clear();
    dispatch(logout());
  } catch (error) {
    console.error("Logout error", error);
  }
};
