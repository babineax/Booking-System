import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../firebase/providers/AuthProvider";

import AdminDashboard from "./(admin)/components/AdminDashboard";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const role = (user as any)?.role || "";
  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loaderText}>Loading your profile...</Text>
      </View>
    );
  }

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
      {isAdmin && <AdminDashboard />}
      {isStaff && (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>My Dashboard</Text>
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
        </View>
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
