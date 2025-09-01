import { Calendar, CheckCircle2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../firebase/providers/AuthProvider";
import { googleCalendarService } from "../firebase/services";

type Props = {
  date: string;
  time: string;
  service: {
    id?: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
    category?: string;
  } | null;
  onConfirm: () => void;
  onEdit: () => void;
  isLoading: boolean;
};

const BookingConfirmation = ({ 
  date,
  time,
  service,
  onConfirm,
  onEdit,
  isLoading,
}: Props) => {
  const { firebaseUser } = useAuth();
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  
  const handleAddToCalendar = async () => {
    if (!firebaseUser) {
      Toast.show({
        type: "error",
        text1: "Sign in required",
        text2: "Please sign in to add to Google Calendar",
      });
      return;
    }

    try {
      setIsAddingToCalendar(true);
      
      
      const credentials = await googleCalendarService.getStoredCredentials(firebaseUser.uid);
      
     
      if (!credentials) {
        await googleCalendarService.authorize();
      }
      
      
      const eventDateTime = new Date(date + " " + time);
      const endDateTime = new Date(eventDateTime.getTime() + (service?.duration || 0) * 60000);
      
      await googleCalendarService.createCalendarEvent(firebaseUser.uid, {
        summary: `Appointment: ${service?.name}`,
        description: `Booking for ${service?.name}\nDuration: ${service?.duration} minutes\nPrice: KES ${service?.price}`,
        start: {
          dateTime: eventDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
      
      Toast.show({
        type: "success",
        text1: "Added to Calendar",
        text2: "Your booking has been added to Google Calendar",
      });
    } catch (error: any) {
      console.error("Error adding to calendar:", error);
      Toast.show({
        type: "error",
        text1: "Calendar Error",
        text2: error.message || "Failed to add to Google Calendar",
      });
    } finally {
      setIsAddingToCalendar(false);
    }
  };
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
          disabled={isLoading}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          style={[styles.button, styles.confirmButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        onPress={handleAddToCalendar}
        disabled={isAddingToCalendar}
        style={[
          styles.calendarButton,
          isAddingToCalendar && styles.calendarButtonDisabled
        ]}
      >
        <Calendar size={20} color="#ffffff" style={styles.calendarIcon} />
        <Text style={styles.calendarButtonText}>
          {isAddingToCalendar ? "Adding to Calendar..." : "Add to Google Calendar"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  calendarButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  calendarButtonDisabled: {
    opacity: 0.7,
  },
  calendarIcon: {
    marginRight: 8,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
  disabledButton: {
    backgroundColor: '#9ca3af',
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
