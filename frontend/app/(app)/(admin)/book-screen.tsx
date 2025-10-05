import DatePicker from "@/components/DatePicker"; // <- custom DatePicker
import { Picker } from "@react-native-picker/picker";
import { useGlobalSearchParams } from "expo-router";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { db } from "../../../firebase/config";

const Stepper = ({ step }: { step: number }) => {
  const steps = ["Service", "Date", "Staff & Time", "Confirm"];
  return (
    <View style={styles.stepperContainer}>
      {steps.map((label, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              { backgroundColor: step >= index ? "#0066cc" : "#ccc" },
            ]}
          >
            <Text style={styles.stepNumber}>{index + 1}</Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              { color: step >= index ? "#0066cc" : "#999" },
            ]}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const BookingScreen = () => {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { clientId } = useGlobalSearchParams();

  // Fetch services, staff, and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceSnapshot, staffSnapshot, clientSnapshot] =
          await Promise.all([
            getDocs(collection(db, "services")),
            getDocs(collection(db, "staff")),
            getDocs(collection(db, "clients")),
          ]);

        setServices(
          serviceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setStaff(
          staffSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setClients(
          clientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedDate) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please complete all steps before confirming.",
      });
      return;
    }
    setLoading(true);
    try {
      // 🔍 Check if this client already has a booking for this service and date
      const bookingRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingRef);

      const existingBooking = snapshot.docs.find((doc) => {
        const data = doc.data();
        const sameClient = data.clientId === clientId;
        const sameService = data.serviceId === selectedService;
        const sameDate =
          new Date(data.startTime).toDateString() ===
          selectedDate.toDateString();
        return sameClient && sameService && sameDate;
      });

      if (existingBooking) {
        Toast.show({
          type: "error",
          text1: "Duplicate Booking ❌",
          text2:
            "This client already has a booking for the same date and service.",
        });
        setLoading(false);
        return;
      }

      // ✅ If no duplicate, proceed to add booking
      await addDoc(collection(db, "bookings"), {
        serviceId: selectedService,
        staffMemberId: selectedStaff,
        startTime: selectedDate.toISOString(),
        clientId: clientId || null,
        status: "pending",
        paymentStatus: "pending",
        totalPrice: 25,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        reminderSent: false,
      });
      Toast.show({
        type: "success",
        text1: "Booking Confirmed 🎉",
        text2: "Your appointment has been scheduled.",
      });
      // Reset state
      setStep(0);
      setSelectedService("");
      setSelectedStaff("");
      setSelectedDate(null);
    } catch (error) {
      console.error("Error adding booking:", error);
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: "Please try again later.",
      });
    }
    setLoading(false);
  };

  const renderStep = () => {
    const client = clients.find((c) => c.id === clientId);

    switch (step) {
      case 0: // Select Service
        return (
          <View style={styles.card}>
            <Text style={styles.heading}>Select a Service</Text>
            <Picker
              selectedValue={selectedService}
              onValueChange={(val) => setSelectedService(val)}
            >
              <Picker.Item label="-- Choose a Service --" value="" />
              {services.map((service) => (
                <Picker.Item
                  key={service.id}
                  label={service.name}
                  value={service.id}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={nextStep}
              disabled={!selectedService}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 1: // Select Date
        return (
          <View style={styles.card}>
            <Text style={styles.heading}>Choose Date</Text>
            <DatePicker
              date={
                selectedDate ? selectedDate.toISOString().split("T")[0] : ""
              }
              setDate={(dateString: string) =>
                setSelectedDate(new Date(dateString))
              }
              onNext={nextStep}
            />
            <View style={styles.stepActions}>
              <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2: // Select Staff & Time
        return (
          <View style={styles.card}>
            <Text style={styles.heading}>Select Staff</Text>
            <Picker
              selectedValue={selectedStaff}
              onValueChange={(val) => setSelectedStaff(val)}
            >
              <Picker.Item label="-- Choose Staff Member --" value="" />
              {staff
                .filter((member) => member.isActive && !member.isAdmin)
                .map((member) => (
                  <Picker.Item
                    key={member.id}
                    label={`${member.firstName} ${member.lastName}`}
                    value={member.id}
                  />
                ))}
            </Picker>
            <View style={styles.stepActions}>
              <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={nextStep}
                disabled={!selectedStaff}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3: // Confirm
        return (
          <View style={styles.card}>
            <Text style={styles.heading}>Confirm Booking</Text>
            <Text style={styles.summary}>
              Client:{" "}
              {client ? `${client.firstName} ${client.lastName}` : "Self"}
            </Text>
            <Text style={styles.summary}>
              Service:{" "}
              {services.find((s) => s.id === selectedService)?.name || "-"}
            </Text>
            <Text style={styles.summary}>
              Staff:{" "}
              {staff
                .filter((member) => member.isActive && !member.isAdmin)
                .find((s) => s.id === selectedStaff)
                ? `${staff.find((s) => s.id === selectedStaff)?.firstName} ${
                    staff.find((s) => s.id === selectedStaff)?.lastName
                  }`
                : "-"}
            </Text>
            <Text style={styles.summary}>
              Date: {selectedDate?.toLocaleDateString()}
            </Text>
            <View style={styles.stepActions}>
              <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleBooking}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return <Text>Something went wrong</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Stepper step={step} />
      {renderStep()}
      <Toast position="top" visibilityTime={3000} />
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stepContainer: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumber: { color: "#fff", fontWeight: "bold" },
  stepLabel: { fontSize: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  button: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  backButton: {
    backgroundColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  stepActions: { flexDirection: "row", marginTop: 16 },
  summary: { fontSize: 16, marginBottom: 8 },
});
