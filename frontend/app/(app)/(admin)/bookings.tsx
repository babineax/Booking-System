import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const bookingsQuery = query(collection(db, "bookings"));

    const unsubscribe = onSnapshot(
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
              date: bookingData.startTime
                ? new Date(
                    bookingData.startTime.seconds * 1000
                  ).toLocaleString()
                : "No Date",
              status: bookingData.status || "Pending",
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
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  const renderBooking = ({ item }: { item: Booking }) => {
    return (
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
          <Text style={styles.dateLabel}>📅 {item.date}</Text>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 50,
    marginBottom: 16,
    color: "#1D2939",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
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
    marginBottom: 8,
  },
  clientName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#101828",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: "#475467",
  },
  statusPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusConfirmed: {
    backgroundColor: "#12B76A",
  },
  statusPending: {
    backgroundColor: "#F79009",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  viewBtn: {
    backgroundColor: "#EEF4FF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  viewBtnText: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
});
