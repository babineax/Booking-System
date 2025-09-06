import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../../firebase/providers/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Placeholder for a bookings list component
const UserBookingsList = () => (
  <View style={styles.placeholder}>
    <Text>Your bookings will appear here.</Text>
  </View>
);

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // After logout, the root layout should redirect to the login screen.
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#d9534f" />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfoSection}>
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Role-specific Dashboards */}
      {(isAdmin || isStaff) && (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>My Dashboard</Text>
          {isAdmin && (
            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={() => router.push("/(app)/(admin)")}
            >
              <MaterialCommunityIcons
                name="shield-crown"
                size={24}
                color="white"
              />
              <Text style={styles.dashboardButtonText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
          {isStaff && (
            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={() => router.push("/(app)/(staff)")}
            >
              <MaterialCommunityIcons
                name="briefcase-account"
                size={24}
                color="white"
              />
              <Text style={styles.dashboardButtonText}>Staff Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* User Bookings */}
      <View style={styles.bookingsSection}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        <UserBookingsList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
  },
  logoutButton: {
    padding: 8,
  },
  userInfoSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  dashboardSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  dashboardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dashboardButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  bookingsSection: {
    paddingHorizontal: 20,
  },
  placeholder: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
});

export default ProfileScreen;
