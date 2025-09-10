import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { adminService } from "../../../firebase/services/adminService";

// Define types for our data
interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: Date;
  bookingCount?: number;
}

interface NewClientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const INITIAL_CLIENT_FORM: NewClientForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export default function AdminClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] =
    useState<NewClientForm>(INITIAL_CLIENT_FORM);

  const router = useRouter();

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.email?.toLowerCase().includes(query),
    );
  }, [clients, searchQuery]);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic validation)
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!newClient.firstName.trim()) return "First name is required";
    if (!newClient.lastName.trim()) return "Last name is required";
    if (!newClient.email.trim()) return "Email is required";
    if (!isValidEmail(newClient.email)) return "Please enter a valid email";
    if (!newClient.phone.trim()) return "Phone number is required";
    if (!isValidPhone(newClient.phone))
      return "Please enter a valid phone number";
    return null;
  };

  // Fetch clients from Firestore in real-time
  useEffect(() => {
    const clientsQuery = query(
      collection(db, "users"),
      where("role", "==", "customer"),
    );

    const unsubscribeClients = onSnapshot(
      clientsQuery,
      (snapshot) => {
        const fetchedClients: Client[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: `${data.firstName} ${data.lastName}`,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              createdAt: data.createdAt?.toDate(),
              bookingCount: data.bookingCount || 0,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        setClients(fetchedClients);
        setIsLoading(false);
        setIsRefreshing(false);
      },
      (error) => {
        console.error("Error fetching clients:", error);
        Alert.alert("Error", "Failed to load clients. Please try again.");
        setIsLoading(false);
        setIsRefreshing(false);
      },
    );

    return () => unsubscribeClients();
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // The onSnapshot listener will automatically update the data
  }, []);

  const resetForm = useCallback(() => {
    setNewClient(INITIAL_CLIENT_FORM);
  }, []);

  const handleAddClient = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Validation Error", validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await adminService.createClient(newClient);
      if (result.success) {
        Alert.alert(
          "Client Created Successfully",
          `An email has been sent to ${newClient.email} with instructions to set up their password.`,
          [
            {
              text: "OK",
              onPress: () => {
                resetForm();
                setModalVisible(false);
              },
            },
          ],
        );
      } else {
        Alert.alert("Error", result.message || "Failed to create client");
      }
    } catch (error: any) {
      console.error("Error creating client:", error);
      Alert.alert(
        "Creation Failed",
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookClient = useCallback(
    (client: Client) => {
      router.push({
        pathname: "/(app)/(admin)/create-booking" as any,
        params: {
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
        },
      });
    },
    [router],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    resetForm();
  }, [resetForm]);

  const renderClientItem = useCallback(
    ({ item }: { item: Client }) => (
      <View style={styles.clientCard}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientContact}>{item.email}</Text>
          <Text style={styles.clientContact}>{item.phone}</Text>
          {item.bookingCount !== undefined && (
            <Text style={styles.bookingCount}>
              {item.bookingCount} booking{item.bookingCount !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <View style={styles.clientActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleBookClient(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleBookClient],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? "No clients match your search." : "No clients found."}
        </Text>
        {searchQuery && (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchQuery],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Clients ({clients.length})</Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/(admin)/dev-tools" as any)}
          >
            <MaterialCommunityIcons name="wrench" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients by name, phone, or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderClientItem}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#4A90E2"]}
            tintColor="#4A90E2"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add Client</Text>
      </TouchableOpacity>

      {/* Add Client Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Client</Text>

            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={newClient.firstName}
              onChangeText={(text) =>
                setNewClient((prev) => ({ ...prev, firstName: text.trim() }))
              }
              autoCapitalize="words"
              returnKeyType="next"
            />

            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={newClient.lastName}
              onChangeText={(text) =>
                setNewClient((prev) => ({ ...prev, lastName: text.trim() }))
              }
              autoCapitalize="words"
              returnKeyType="next"
            />

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={newClient.email}
              onChangeText={(text) =>
                setNewClient((prev) => ({
                  ...prev,
                  email: text.trim().toLowerCase(),
                }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <TextInput
              placeholder="Phone (+1234567890)"
              style={styles.input}
              value={newClient.phone}
              onChangeText={(text) =>
                setNewClient((prev) => ({ ...prev, phone: text.trim() }))
              }
              keyboardType="phone-pad"
              returnKeyType="done"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={closeModal}
                disabled={isSubmitting}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, isSubmitting && styles.disabledBtn]}
                onPress={handleAddClient}
                disabled={isSubmitting}
              >
                <Text style={styles.modalBtnText}>
                  {isSubmitting ? "Creating..." : "Create Client"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 16,
    paddingTop: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for floating add button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 16,
  },
  clientCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  clientContact: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  bookingCount: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "500",
    marginTop: 4,
  },
  clientActions: {
    flexDirection: "row",
  },
  actionBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 12,
  },
  clearSearchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 16,
    left: 16,
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#6B7280",
  },
  disabledBtn: {
    backgroundColor: "#9CA3AF",
  },
  modalBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
