import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { adminService } from "../../../firebase/services/adminService";

// Define types for our data
interface Client {
  id: string;
  name: string;
  phone: string;
}

export default function AdminClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const router = useRouter();

  // Fetch clients from Firestore in real-time
  useEffect(() => {
    const clientsQuery = query(
      collection(db, "users"),
      where("role", "==", "customer"),
    );

    const unsubscribeClients = onSnapshot(
      clientsQuery,
      (snapshot) => {
        const fetchedClients: Client[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          phone: doc.data().phone,
        }));
        setClients(fetchedClients);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribeClients();
  }, []);

  const handleAddClient = async () => {
    if (
      !newClient.firstName ||
      !newClient.lastName ||
      !newClient.email ||
      !newClient.phone
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await adminService.createClient(newClient);
      if (result.success) {
        Alert.alert(
          "Client Created",
          `An email has been sent to the user with their temporary password: ${result.temporaryPassword}`,
        );
        setNewClient({ firstName: "", lastName: "", email: "", phone: "" });
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Creation Failed",
        error.message || "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Clients</Text>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
            <View>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.clientPhone}>{item.phone}</Text>
            </View>
            <View style={styles.clientActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/(admin)/create-bookings.tsx",
                    params: { clientId: item.id, clientName: item.name },
                  })
                }
              >
                <Text style={styles.actionText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No clients found.</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Client</Text>
      </TouchableOpacity>

      {/* Add Client Modal */}
      <Modal animationType="fade">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Client</Text>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={newClient.firstName}
            onChangeText={(text) =>
              setNewClient((prev) => ({ ...prev, firstName: text }))
            }
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={newClient.lastName}
            onChangeText={(text) =>
              setNewClient((prev) => ({ ...prev, lastName: text }))
            }
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={newClient.email}
            onChangeText={(text) =>
              setNewClient((prev) => ({ ...prev, email: text }))
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={newClient.phone}
            onChangeText={(text) =>
              setNewClient((prev) => ({ ...prev, phone: text }))
            }
            keyboardType="phone-pad"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleAddClient}
              disabled={isSubmitting}
            >
              <Text style={styles.modalBtnText}>
                {isSubmitting ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 30,
  },
  clientCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  clientName: { fontSize: 16, fontWeight: "600" },
  clientPhone: { fontSize: 13, color: "#555" },
  clientActions: { flexDirection: "row" },
  actionBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  addButton: {
    backgroundColor: "#34C759",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelBtn: { backgroundColor: "#999" },
  modalBtnText: { color: "white", fontWeight: "600" },
});
