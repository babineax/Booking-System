"use client";

import BookingConfirmation from "@/components/BookingConfirmation";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGetServices } from "../../features/services/hooks/useGetServices";
import { useCreateBooking } from "../../features/booking/hooks/useCreateBooking";

type Service = {
  id?: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category?: string;
  staffMembers?: string[];
};

export default function BookingPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const clientId = params.clientId as string | undefined;

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const { data: services = [], isLoading: servicesLoading } = useGetServices();

  const { mutate: createBooking, isPending: bookingLoading } =
    useCreateBooking();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleEdit = () => setStep(0);

  const handleConfirmBooking = () => {
    if (!selectedServiceId || !selectedDate || !selectedTime) {
      Alert.alert(
        "Error",
        "Please make sure you have selected a service, date, and time.",
      );
      return;
    }

    const startTimeISO = new Date(
      `${selectedDate}T${convertTo24Hour(selectedTime)}`,
    ).toISOString();

    createBooking(
      {
        serviceId: selectedServiceId,
        startTime: startTimeISO,
        clientId: clientId, // Pass clientId if it exists
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Booking Confirmed!",
            text2: "The appointment has been scheduled.",
          });
          setTimeout(() => {
            // Redirect admin back to dashboard, customer to home
            router.replace(clientId ? "/(app)/(admin)" : "/(app)");
          }, 2000);
        },
        onError: (error) => {
          console.error(error);
          Toast.show({
            type: "error",
            text1: "Booking Failed",
            text2: error.message || "Please try again later.",
          });
        },
      },
    );
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const selectedService =
    services.find((s: Service) => s.id === selectedServiceId) || null;

  if (servicesLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ServiceSelector
            service={selectedServiceId}
            setService={setSelectedServiceId}
            services={services}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TimeSlotSelector
            date={selectedDate}
            time={selectedTime}
            setTime={setSelectedTime}
            onNext={handleNext}
            onBack={handleBack}
            serviceId={selectedServiceId}
          />
        );
      case 3:
        return (
          <BookingConfirmation
            date={selectedDate}
            time={selectedTime}
            service={selectedService}
            onConfirm={handleConfirmBooking}
            onEdit={handleEdit}
            isLoading={bookingLoading}
          />
        );
      default:
        return <Text>Something went wrong!</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <BookingStepper currentStep={step} />
      {renderStep()}
      <Toast position="top" visibilityTime={3000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
