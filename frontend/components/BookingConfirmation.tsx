import { CheckCircle2 } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  date: string;
  time: string;
  service: {
    _id: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
    category?: string;
  } | null;
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
      <View style={styles.header}>
        <CheckCircle2 size={60} color="#2563EB" />
        <Text style={styles.title}>
          Confirm Your Booking
        </Text>
        <Text style={styles.subtitle}>
          Review your booking details before proceeding.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service</Text>
        <Text style={styles.sectionText}>{service?.name}</Text>
        <Text style={styles.sectionDetail}>
          Duration: {service?.duration} mins
        </Text>
        <Text style={styles.sectionDetail}>
          Price: KES {service?.price.toLocaleString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <Text style={styles.sectionText}>{date}</Text>
        <Text style={styles.sectionText}>{time}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          style={[styles.button, styles.confirmButton]}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e40af',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1e40af',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  sectionDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default BookingConfirmation;
