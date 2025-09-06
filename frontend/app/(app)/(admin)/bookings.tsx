import { collection, onSnapshot, query, getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../../firebase/config";

interface Booking {
  id: string;
  client: string;
  date: string;
  status: "Confirmed" | "Pending" | string;
}

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookingsQuery = query(collection(db, "bookings"));

    const unsubscribeBookings = onSnapshot(
      bookingsQuery,
      async (snapshot) => {
        const fetchedBookings: Booking[] = await Promise.all(
          snapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data();
            let clientName = "Unknown Client";

            if (bookingData.userId) {
              const userRef = doc(db, "users", bookingData.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                clientName = `${userData.firstName} ${userData.lastName}`;
              }
            }

            return {
              id: bookingDoc.id,
              client: clientName,
              date: new Date(
                bookingData.startTime.seconds * 1000,
              ).toLocaleString(),
              status: bookingData.status || "Pending",
            };
          }),
        );
        setBookings(
          fetchedBookings.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribeBookings();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>All Bookings</Text>
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
                item.status === "Confirmed" ? styles.confirmed : styles.pending,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found.</Text>
        }
      />
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
  bookingCard: {
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
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
});
