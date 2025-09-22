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

export default function AdminClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            onPress={() => router.push("/(app)/(admin)/staff" as any)}
            style={{ marginRight: 16 }}
          >
            <MaterialCommunityIcons name="account-group" size={24} color="#1F2937" />
          </TouchableOpacity>
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
        onPress={() => router.push("/(app)/(admin)/create-booking" as any)}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>Create New Booking</Text>
      </TouchableOpacity>
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
