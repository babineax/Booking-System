"use client";

import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import BookingConfirmation from "@/components/BookingConfirmation"; // Added import

// Mocking 'next/navigation' for a functional example
const useRouter = () => ({
  replace: (path: string) => {
    console.log(`Navigating to ${path}`);
    Alert.alert("Redirect", `Pretending to navigate to ${path}`);
  },
});

// --- DUMMY DATA ---
const DUMMY_SERVICES = [
  { _id: '1', name: 'Haircut', description: 'Classic haircut and style', duration: 30, price: 3000 },
  { _id: '2', name: 'Beard Trim', description: 'Professional beard trimming and shaping', duration: 15, price: 1500 },
  { _id: '3', name: 'Manicure & Pedicure', description: 'Full manicure and pedicure service', duration: 60, price: 5000 },
  { _id: '4', name: 'Hair Styling', description: 'Advanced hair styling for events', duration: 45, price: 4000 },
];

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleEdit = () => setStep(0);

  const handleConfirmBooking = () => {
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
  };
  
  const selectedService = DUMMY_SERVICES.find(s => s._id === selectedServiceId);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ServiceSelector
            service={selectedServiceId}
            setService={setSelectedServiceId}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            onNext={handleNext}
            onBack={handleBack}
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
            service={selectedService || null}
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
});