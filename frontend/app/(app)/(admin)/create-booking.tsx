import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetServices } from "../../../features/services/hooks/useGetServices";
import { useCreateBooking } from "../../../features/booking/hooks/useCreateBooking";
import ServiceSelector from "../../../components/ServiceSelector";
import StaffSelector from "../../../components/StaffSelector";
import DatePicker from "../../../components/DatePicker";
import TimeSlotSelector from "../../../components/TimeSlotSelector";
import BookingConfirmation from "../../../components/BookingConfirmation";
import Toast from "react-native-toast-message";

export default function AdminCreateBookingScreen() {
  const router = useRouter();
  const { clientId, clientName } = useLocalSearchParams();

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const { data: services = [], isLoading: servicesLoading } = useGetServices();
  const { mutate: createBooking, isPending: bookingLoading } =
    useCreateBooking();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleConfirmBooking = () => {
    if (
      !selectedServiceId ||
      !selectedStaffId ||
      !selectedDate ||
      !selectedTime
    ) {
      Alert.alert(
        "Error",
        "Please select a service, provider, date, and time.",
      );
      return;
    }

    const startTimeISO = new Date(
      `${selectedDate}T${selectedTime}`,
    ).toISOString();

    createBooking(
      {
        serviceId: selectedServiceId,
        startTime: startTimeISO,
        clientId: clientId as string,
        serviceProviderId: selectedStaffId,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Booking Created!",
            text2: `Appointment for ${clientName} has been scheduled.`,
          });
          router.replace("/(app)/(admin)");
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Booking Failed",
            text2: error.message || "An unexpected error occurred.",
          });
        },
      },
    );
  };

  const selectedService =
    services.find((s) => s.id === selectedServiceId) || null;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ServiceSelector
            services={services}
            service={selectedServiceId}
            setService={setSelectedServiceId}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StaffSelector
            staff={selectedStaffId}
            setStaff={setSelectedStaffId}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <TimeSlotSelector
            date={selectedDate}
            time={selectedTime}
            setTime={setSelectedTime}
            serviceId={selectedServiceId}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <BookingConfirmation
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirmBooking}
            onEdit={() => setStep(0)}
            isLoading={bookingLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Booking for {clientName}</Text>
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
