import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { clientService } from "../firebase/services/clientService";

export const AuthDebugComponent = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testCredentials = [
    { email: "admin@bookingsystem.com", password: "admin123", label: "Admin" },
    {
      email: "sarah@bookingsystem.com",
      password: "stylist123",
      label: "Stylist",
    },
    {
      email: "customer@example.com",
      password: "customer123",
      label: "Customer",
    },
  ];

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await clientService.getAllUsers();
      setUsers(allUsers);
      console.log("All users:", allUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async (credentials: {
    email: string;
    password: string;
    label: string;
  }) => {
    try {
      console.log(
        `Testing login for ${credentials.label} (${credentials.email})`
      );
      const result = await clientService.login({
        email: credentials.email,
        password: credentials.password,
      });

      console.log(`Login successful for ${credentials.label}:`, result.user);
      Alert.alert("Success", `Login successful for ${credentials.label}`);

      // Logout immediately
      await clientService.logout();
    } catch (error: any) {
      console.error(`Login failed for ${credentials.label}:`, error);
      Alert.alert("Login Failed", `${credentials.label}: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Auth Debug Component</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={fetchUsers}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Fetch All Users"}
        </Text>
      </TouchableOpacity>

      {users.length > 0 && (
        <View style={styles.usersContainer}>
          <Text style={styles.subtitle}>
            Users in Database ({users.length}):
          </Text>
          {users.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userText}>
                {user.firstName} {user.lastName} ({user.email}) - {user.role}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.testContainer}>
        <Text style={styles.subtitle}>Test Login:</Text>
        {testCredentials.map((cred) => (
          <TouchableOpacity
            key={cred.email}
            style={styles.testButton}
            onPress={() => testLogin(cred)}
          >
            <Text style={styles.buttonText}>Test {cred.label} Login</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#00BCD4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  usersContainer: {
    marginVertical: 20,
  },
  userItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    fontSize: 14,
  },
  testContainer: {
    marginTop: 20,
  },
});

export default AuthDebugComponent;
