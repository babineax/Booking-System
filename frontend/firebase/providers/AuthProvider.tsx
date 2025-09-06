import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setCredentials,
  setFirebaseUser,
  setLoading,
} from "../../src/redux/features/auth/authSlice";
import { RootState } from "../../src/redux/types";
import { auth } from "../config/firebase_config";
import { userService } from "../services/userService";
import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: false,
  currentUser: null,
  logout: () => {},
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const { userInfo, firebaseUser, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          dispatch(setFirebaseUser(firebaseUser));

          const userData = await userService.getUserById(firebaseUser.uid);
          if (userData) {
            dispatch(setCredentials({ user: userData, firebaseUser }));
          } else {
            console.error("User data not found in Firestore");
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const contextValue = {
    userInfo,
    firebaseUser,
    isAuthenticated,
    isLoading,
    currentUser: firebaseUser,
    user: userInfo,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
