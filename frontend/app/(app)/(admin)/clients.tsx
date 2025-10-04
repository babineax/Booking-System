import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDeleteClient } from "../../../features/clients/hooks/useDeleteClient";
import { useGetClients } from "../../../features/clients/hooks/useGetClients";
import { User } from "../../../firebase/types";

export default function AdminClientsScreen() {
  const { data: clients = [], isLoading, refetch } = useGetClients();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleBookForClient = useCallback(
    (client: User) => {
      router.push({
        pathname: "/(app)/booking",
        params: { clientId: client.id },
      });
    },
    [router]
  );

  const handleEditClient = useCallback(
    (client: User) => {
      router.push({
        pathname: "/(app)/(admin)/edit-client",
        params: { clientId: client.id },
      });
    },
    [router]
  );

  const handleDeleteClient = useCallback(
    (client: User) => {
      Alert.alert(
        "Delete Client",
        `Are you sure you want to delete ${client.firstName} ${client.lastName}? This action cannot be undone.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteClient(client.id!, {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Client Deleted",
                    text2: `${client.firstName} ${client.lastName} has been deleted.`,
                  });
                },
                onError: (error) => {
                  Toast.show({
                    type: "error",
                    text1: "Delete Failed",
                    text2: error.message,
                  });
                },
              });
            },
          },
        ]
      );
    },
    [deleteClient]
  );

  const renderClientItem = useCallback(
    ({ item }: { item: User }) => (
      <View style={styles.clientCard}>
        <View style={styles.clientInfo}>
          <Text
            style={styles.clientName}
          >{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.clientContact}>{item.email}</Text>
          {item.phone && <Text style={styles.clientPhone}>{item.phone}</Text>}
        </View>
        <View style={styles.clientActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditClient(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBookForClient(item)}
          >
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteClient(item)}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleBookForClient, handleEditClient, handleDeleteClient, isDeleting]
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
        <Text style={styles.headerTitle}>Clients ({filteredClients.length})</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id!}
        renderItem={renderClientItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No clients found.</Text>
        }
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
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  clientInfo: {
    marginBottom: 12,
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
  clientPhone: {
    fontSize: 13,
    color: "#6B7280",
  },
  clientActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
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
