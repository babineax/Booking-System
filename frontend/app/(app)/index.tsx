// "use client";

import ApiDebugComponent from "@/components/ApiDebugComponent";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
// NOTE: If you are still seeing the "Cannot find module" error,
// please double-check this file path to ensure it's correct for your project structure.
import { logout } from "@/src/redux/features/auth/authSlice";

// We'll define a type for the Redux state to fix the "unknown" error.
// This assumes your Redux store has an 'auth' slice with a 'userInfo' object.
type RootState = {
  auth: {
    userInfo: {
      firstName: string;
      username: string;
      // You can add other user info properties here
    };
    // Other properties of the auth slice go here
  };
  // Other slices in your Redux store go here
};

export default function DashboardScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // We now provide the RootState type to the useSelector hook.
  // This tells TypeScript the structure of the state,
  // resolving the 'state is of type unknown' error.
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Dashboard</Text>
      {userInfo && (
        <Text style={styles.subtitle}>
          Hello, {userInfo.firstName || userInfo.username}!
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/services")}
        >
          <Text style={styles.buttonText}>View Services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/booking")}
        >
          <Text style={styles.buttonText}>Make a Booking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* <ApiDebugComponent /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#00BCD4',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
