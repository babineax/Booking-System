import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDeleteStaff } from "../../../features/staff/hooks/useDeleteStaff";
import { useGetStaff } from "../../../features/staff/hooks/useGetStaff";
import { User } from "../../../firebase/types";

const useStaffMembers = useGetStaff;

export default function AdminStaffScreen() {
  const {
    data: staff = [],
    isLoading,
    isRefreshing,
    refetch,
  } = useStaffMembers();
  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff();
  const router = useRouter();

  const handleEditStaff = useCallback(
    (staffMember: User) => {
      // Navigate to an edit screen, passing the staff member's ID
      router.push({
        pathname: "/(app)/(admin)/edit-staff",
        params: { staffId: staffMember.id },
      });
    },
    [router]
  );

  const handleDeleteStaff = useCallback(
    (staffMember: User) => {
      Alert.alert(
        "Delete Staff Member",
        `Are you sure you want to delete ${staffMember.firstName} ${staffMember.lastName}? This action cannot be undone.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteStaff(staffMember.id!, {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Staff Deleted",
                    text2: `${staffMember.firstName} ${staffMember.lastName} has been deleted.`,
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
    [deleteStaff]
  );

  const renderStaffItem = useCallback(
    ({ item }: { item: User }) => (
      <View style={styles.staffCard}>
        <View style={styles.staffInfo}>
          <Text
            style={styles.staffName}
          >{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.staffContact}>{item.email}</Text>
          {item.phone && <Text style={styles.staffPhone}>{item.phone}</Text>}
          {item.bio && (
            <Text style={styles.staffBio} numberOfLines={2}>
              {item.bio}
            </Text>
          )}
        </View>
        <View style={styles.staffActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditStaff(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteStaff(item)}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleEditStaff, handleDeleteStaff, isDeleting]
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No staff members found.</Text>
        }
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(app)/(admin)/edit-staff")}
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
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  staffInfo: {
    marginBottom: 12,
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
    marginBottom: 2,
  },
  staffPhone: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  staffBio: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  staffActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  editButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
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
