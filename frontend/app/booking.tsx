"use client";

import BookingConfirmation from "@/components/BookingConfirmation";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { useCreateBookingMutation } from "../src/redux/apis/bookingsApiSlice";
import { useGetServicesQuery } from "../src/redux/apis/servicesApiSlice";

type Service = {
  _id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category?: string;
};

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  // Redux queries for real data
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useGetServicesQuery({});
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleEdit = () => setStep(0);

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
      };

      await createBooking(bookingData).unwrap();
      
      Alert.alert(
        "Booking Confirmed!",
        "Your appointment has been successfully scheduled. We will send you a confirmation email shortly.",
        [
          {
            text: "OK",
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "There was an error scheduling your appointment. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  const selectedService = services.find((s: Service) => s._id === selectedServiceId) || null;

  // Show loading spinner while fetching services
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});