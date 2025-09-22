import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { userService, User } from "../../../firebase/services/userService";
import { useQuery } from "@tanstack/react-query";

const useStaffMembers = () => {
    return useQuery<User[], Error>({ 
        queryKey: ['staffMembers'], 
        queryFn: () => userService.getStaffMembers()
    });
}

export default function AdminStaffScreen() {
  const { data: staff = [], isLoading, isRefreshing, refetch } = useStaffMembers();
  const router = useRouter();

  const handleEditStaff = useCallback(
    (staffMember: User) => {
      // Navigate to an edit screen, passing the staff member's ID
      // This screen will be created in a future step.
      router.push({ 
        pathname: '/(app)/(admin)/edit-staff',
        params: { staffId: staffMember.id }
      });
    },
    [router],
  );

  const renderStaffItem = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity style={styles.staffCard} onPress={() => handleEditStaff(item)}>
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.staffContact}>{item.email}</Text>
        </View>
        <View style={styles.staffActions}>
            <Text style={styles.actionText}>Edit</Text>
        </View>
      </TouchableOpacity>
    ),
    [handleEditStaff],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading staff...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Staff ({staff.length})</Text>
      </View>

      <FlatList
        data={staff}
        keyExtractor={(item) => item.id!}
        renderItem={renderStaffItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No staff members found.</Text>}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(app)/(admin)/edit-staff')}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add New Staff</Text>
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
  staffCard: {
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
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  staffContact: {
    fontSize: 13,
    color: "#6B7280",
  },
  staffActions: {
    flexDirection: "row",
  },
  actionText: {
    color: "#4A90E2",
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
