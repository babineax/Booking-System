import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
import Toast from "react-native-toast-message";
import { db } from "../../../firebase/config";

interface Booking {
  id: string;
  client: string;
  date: string;
  status: "Confirmed" | "Pending" | string;
  service?: string;
  notes?: string;
}

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formStatus, setFormStatus] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const bookingsQuery = query(collection(db, "bookings"));
    const unsubscribe = onSnapshot(
      bookingsQuery,
      async (snapshot) => {
        const fetchedBookings: Booking[] = await Promise.all(
          snapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data();
            let clientName = "Unknown Client";

            if (bookingData.clientId) {
              const clientRef = doc(db, "clients", bookingData.clientId);
              const clientSnap = await getDoc(clientRef);
              if (clientSnap.exists()) {
                const clientData = clientSnap.data();
                clientName = `${clientData.firstName ?? ""} ${
                  clientData.lastName ?? ""
                }`.trim();
              }
            }

            let bookingDate = "Invalid Date";
            if (bookingData.startTime) {
              try {
                if (bookingData.startTime.seconds) {
                  bookingDate = new Date(
                    bookingData.startTime.seconds * 1000
                  ).toLocaleString();
                } else {
                  bookingDate = new Date(
                    bookingData.startTime
                  ).toLocaleString();
                }
              } catch {
                bookingDate = "Invalid Date";
              }
            }

            return {
              id: bookingDoc.id,
              client: clientName,
              date: bookingDate,
              status: bookingData.status || "Pending",
              service: bookingData.serviceName || "N/A",
              notes: bookingData.notes || "",
            };
          })
        );

        setBookings(
          fetchedBookings.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        Toast.show({ type: "error", text1: "Failed to load bookings" });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // --- View Details Modal ---
  const openViewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditing(false);
    setModalVisible(true);
  };

  // --- Open Edit Modal ---
  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormStatus(booking.status);
    setFormNotes(booking.notes || "");
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedBooking) return;

    setSaving(true);
    try {
      const bookingRef = doc(db, "bookings", selectedBooking.id);
      await updateDoc(bookingRef, {
        status: formStatus,
        notes: formNotes,
      });

      Toast.show({
        type: "success",
        text1: "Booking updated successfully!",
      });

      setModalVisible(false);
      setIsEditing(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Update failed:", error);
      Toast.show({ type: "error", text1: "Failed to update booking" });
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBooking(null);
    setIsEditing(false);
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <Animated.View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.client}</Text>
        <View
          style={[
            styles.statusPill,
            item.status === "Confirmed"
              ? styles.statusConfirmed
              : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View>
          <Text style={styles.dateLabel}>📅 {item.date}</Text>
          <Text style={styles.serviceText}>💇 {item.service}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#EFF6FF" }]}
            onPress={() => openViewModal(item)}
          >
            <Text style={[styles.actionText, { color: "#1D4ED8" }]}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FFF7ED" }]}
            onPress={() => openEditModal(item)}
          >
            <Text style={[styles.actionText, { color: "#92400E" }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📘 Bookings Dashboard</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      {/* Modal (View / Edit) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedBooking ? (
              <>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit Booking" : "Booking Details"}
                </Text>

                <Text style={styles.label}>Client</Text>
                <Text style={styles.value}>{selectedBooking.client}</Text>

                <Text style={styles.label}>Service</Text>
                <Text style={styles.value}>{selectedBooking.service}</Text>

                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{selectedBooking.date}</Text>

                {isEditing ? (
                  <>
                    <Text style={styles.label}>Status</Text>
                    <TextInput
                      style={styles.input}
                      value={formStatus}
                      onChangeText={setFormStatus}
                      placeholder="Confirmed / Pending"
                    />

                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      value={formNotes}
                      onChangeText={setFormNotes}
                      multiline
                      placeholder="Add notes..."
                    />

                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleSaveChanges}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{selectedBooking.status}</Text>

                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.value}>
                      {selectedBooking.notes || "No notes added."}
                    </Text>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={closeModal}
                  disabled={saving}
                >
                  <Text style={styles.closeBtnText}>
                    {isEditing ? "Cancel" : "Close"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color="#2563EB" />
            )}
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4F7", paddingHorizontal: 16 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 50,
    marginBottom: 16,
    color: "#1D2939",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#555" },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientName: { fontSize: 17, fontWeight: "600", color: "#101828" },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateLabel: { fontSize: 14, color: "#475467" },
  serviceText: { fontSize: 13, color: "#667085", marginTop: 4 },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { fontWeight: "600", fontSize: 13 },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
  statusPill: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  statusConfirmed: { backgroundColor: "#12B76A" },
  statusPending: { backgroundColor: "#F79009" },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1D2939",
  },
  label: { marginTop: 10, fontWeight: "600", color: "#475467" },
  value: { fontSize: 15, color: "#101828", marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: "#E4E7EC",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  closeBtnText: {
    color: "#101828",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
