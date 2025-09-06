// File: frontend/app/(staff)/index.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../../src/redux/features/auth/authSlice";
import BookingsList from "./components/BookingsList";
import StaffServicesList from "./components/StaffServicesList";

// Define a type for the Redux state
type RootState = {
  auth: {
    userInfo: {
      name: string;
      email: string;
      role: string;
      firstName: string;
      username: string;
    };
  };
};

const StaffDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Header with Logout and Settings Buttons */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff Dashboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/(app)/(staff)/settings")}
          >
            <MaterialCommunityIcons
              name="cog"
              size={20}
              color="#fff"
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color="#fff"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Bookings List Component */}
        <BookingsList />

        {/* Services List Component for staff */}
        <StaffServicesList />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#337ab7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  settingsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  settingsIcon: {
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  logoutIcon: {
    marginRight: 5,
  },
  mainContent: {
    padding: 20,
  },
});

export default StaffDashboard;
