import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/config/firebase_config";
import { userService } from "../../../../firebase/services/userService";
import { logout, setCredentials, setLoading } from "./authSlice";

export const initAuth = () => async (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const storedUserJSON = await AsyncStorage.getItem("userInfo");
        const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
        const freshUser = await userService.getUserById(firebaseUser.uid);
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
    const { user, firebaseUser } = await userService.login({ email, password });

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
    console.error("Login error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await userService.logout();
    await AsyncStorage.clear();
    dispatch(logout());
  } catch (error) {
    console.error("Logout error", error);
  }
};
