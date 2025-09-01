import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [clients, setClients] = useState([
    { id: "1", name: "Alice Johnson", phone: "123-456-7890" },
    { id: "2", name: "Bob Smith", phone: "987-654-3210" },
  ]);

  const [bookings, setBookings] = useState([
    {
      id: "1",
      client: "Alice Johnson",
      date: "2025-08-25",
      status: "Confirmed",
    },
    { id: "2", client: "Bob Smith", date: "2025-08-26", status: "Pending" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "" });

  const router = useRouter();

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) return;
    setClients([...clients, { id: Date.now().toString(), ...newClient }]);
    setNewClient({ name: "", phone: "" });
    setModalVisible(false);
  };

  const StatCard = ({ icon, title, value, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      {icon}
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon={<Ionicons name="people" size={20} color="white" />}
            title="Clients"
            value={clients.length}
            color="#4A90E2"
          />
          <StatCard
            icon={<MaterialIcons name="event" size={20} color="white" />}
            title="Bookings"
            value={bookings.length}
            color="#7B61FF"
          />
          <StatCard
            icon={<FontAwesome5 name="dollar-sign" size={20} color="white" />}
            title="Revenue"
            value="$2.3k"
            color="#34C759"
          />
          <StatCard
            icon={<MaterialIcons name="build" size={20} color="white" />}
            title="Services"
            value="12"
            color="#FF9500"
          />
        </View>

        {/* Clients Section */}
        <Text style={styles.sectionTitle}>Clients</Text>
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
                  onPress={() => router.push("/booking}")}
                >
                  <Text style={styles.actionText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Client</Text>
        </TouchableOpacity>

        {/* Bookings Section */}
        <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <View>
                <Text style={styles.bookingClient}>{item.client}</Text>
                <Text style={styles.bookingDate}>{item.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "Confirmed"
                    ? styles.confirmed
                    : styles.pending,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>

      {/* Add Client Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Client</Text>
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={newClient.name}
              onChangeText={(text) =>
                setNewClient((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={newClient.phone}
              onChangeText={(text) =>
                setNewClient((prev) => ({ ...prev, phone: text }))
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleAddClient}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%", // ✅ two cards per row (instead of squeezing all 4)
    marginBottom: 12, // ✅ spacing between rows
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 6,
  },
  statTitle: { fontSize: 12, color: "white" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 24,
    color: "#111",
  },

  clientCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#f0f0f0", // subtle border to anchor
  },
  clientName: { fontSize: 16, fontWeight: "600" },
  clientPhone: { fontSize: 13, color: "#555" },
  clientActions: { flexDirection: "row" },
  actionBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 8,
  },
  editBtn: {
    backgroundColor: "#FF9500",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
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
    letterSpacing: 0.4,
  },

  bookingCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  bookingClient: { fontSize: 16, fontWeight: "600" },
  bookingDate: { fontSize: 13, color: "#555" },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  confirmed: { backgroundColor: "#34C759" },
  pending: { backgroundColor: "#FF9500" },
  statusText: { color: "white", fontWeight: "600", fontSize: 12 },

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
