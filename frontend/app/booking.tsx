"use client";

import BookingConfirmation from "@/components/BookingConfirmation";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useCreateBookingMutation } from "../src/redux/apis/firebaseBookingsApiSlice";
import { useGetActiveServicesQuery } from "../src/redux/apis/firebaseServicesApiSlice";

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
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const { userInfo, firebaseUser } = useSelector((state: any) => state.auth);
  const currentUserId = userInfo?.id || firebaseUser?.uid || "guest-user";

  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetActiveServicesQuery({} as any);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleEdit = () => setStep(0);

  const handleConfirmBooking = async () => {
    try {
      const selectedService = services.find(
        (s: Service) => s.id === selectedServiceId
      );

      if (!selectedService) {
        Alert.alert("Error", "Please select a service first.");
        return;
      }

      if (
        !selectedService.staffMembers ||
        selectedService.staffMembers.length === 0
      ) {
        Alert.alert("Error", "No staff members available for this service.");
        return;
      }

      const staffMemberId = selectedService.staffMembers[0];
      const timeIn24Hour = convertTo24Hour(selectedTime);
      const endTime = addMinutesToTime(timeIn24Hour, selectedService.duration);

      const bookingData = {
        customerId: currentUserId,
        serviceId: selectedServiceId,
        staffMemberId,
        appointmentDate: new Date(selectedDate),
        startTime: timeIn24Hour,
        endTime: endTime,
        totalPrice: selectedService.price,
        customerNotes: "",
      };

      await createBooking(bookingData).unwrap();

      Toast.show({
        type: "success",
        text1: "Booking Confirmed!",
        text2: "You’ll get a confirmation email shortly.",
      });

      setTimeout(() => {
        router.replace("/(app)");
      }, 2000);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: "Please try again later.",
      });
    }
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

  const addMinutesToTime = (time: string, minutes: number) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
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
