import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetClients } from "../../../features/clients/hooks/useGetClients";
import { User } from "../../../firebase/types";

export default function AdminClientsScreen() {
  const { data: clients = [], isLoading, refetch } = useGetClients();
  const router = useRouter();

  const handleBookForClient = useCallback(
    (client: User) => {
      router.push({
        pathname: "/(app)/booking",
        params: { clientId: client.id },
      });
    },
    [router],
  );

  const renderClientItem = useCallback(
    ({ item }: { item: User }) => (
      <View style={styles.clientCard}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.clientContact}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBookForClient(item)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleBookForClient],
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
        <Text style={styles.headerTitle}>Clients ({clients.length})</Text>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id!}
        renderItem={renderClientItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No clients found.</Text>}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(app)/(admin)/create-client")}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add New Client</Text>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
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
  },
  bookButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
    fontSize: 16,
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
});
