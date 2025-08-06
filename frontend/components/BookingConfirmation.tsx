import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { CheckCircle2 } from "lucide-react-native";

// --- FIX: Change 'id' to '_id' in the Service type definition ---
type Service = {
  _id: string; // Updated from 'id'
  name: string;
  duration: number;
  price: number;
};

type Props = {
  date: string;
  time: string;
  service: Service | null;
  onConfirm: () => void;
  onEdit: () => void;
};

const BookingConfirmation = ({
  date,
  time,
  service,
  onConfirm,
  onEdit,
}: Props) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <CheckCircle2 size={60} color="#1E3A8A" />
        <Text style={styles.headerTitle}>Confirm Your Booking</Text>
        <Text style={styles.headerSubtitle}>
          Review your booking details before proceeding.
        </Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Service</Text>
        {/* No change needed here, as optional chaining handles the null case */}
        <Text style={styles.detailsText}>{service?.name}</Text>
        <Text style={styles.detailsSubtitle}>
          Duration: {service?.duration} mins
        </Text>
        <Text style={styles.detailsSubtitle}>
          Price: KES {service?.price.toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Date & Time</Text>
        <Text style={styles.detailsText}>{date}</Text>
        <Text style={styles.detailsText}>{time}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onEdit} style={[styles.button, styles.editButton]}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E40AF",
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  detailsBox: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 16,
    color: "#374151",
  },
  detailsSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#D1D5DB",
  },
  confirmButton: {
    backgroundColor: "#1D4ED8",
  },
  editText: {
    color: "#374151",
    fontWeight: "600",
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default BookingConfirmation;