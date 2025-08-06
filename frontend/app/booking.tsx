"use client";

import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for redirection
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import ServiceSelector from "@/components/ServiceSelector";
import BookingConfirmation from "@/components/BookingConfirmation";

// --- DUMMY DATA ---
// We need this to simulate the full service object for the confirmation page.
const DUMMY_SERVICES = [
  { _id: '1', name: 'Haircut', description: 'Classic haircut and style', duration: 30, price: 3000 },
  { _id: '2', name: 'Beard Trim', description: 'Professional beard trimming and shaping', duration: 15, price: 1500 },
  { _id: '3', name: 'Manicure & Pedicure', description: 'Full manicure and pedicure service', duration: 60, price: 5000 },
  { _id: '4', name: 'Hair Styling', description: 'Advanced hair styling for events', duration: 45, price: 4000 },
];

export default function BookingPage() {
  const router = useRouter(); // Initialize the router
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(""); // Renamed for clarity

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // --- NEW: Dummy Booking Confirmation Logic ---
  const handleConfirmBooking = () => {
    // This is where you would normally make an API call to create the booking
    // For now, we'll just show a success alert and redirect.
    Alert.alert(
      "Booking Confirmed!",
      "Your appointment has been successfully scheduled. We will send you a confirmation email shortly.",
      [
        {
          text: "OK",
          onPress: () => router.replace('/'), // Redirect to home screen
        },
      ]
    );
  };
  
  // Find the full service object based on the selected ID
  const selectedService = DUMMY_SERVICES.find(s => s._id === selectedServiceId);

  return (
    <View className="flex-1 p-4 bg-white">
      <BookingStepper currentStep={step} />

      {/* STEP 0: Select a Service */}
      {step === 0 && (
        <ServiceSelector
          service={selectedServiceId}
          setService={setSelectedServiceId}
          onNext={handleNext}
        />
      )}

      {/* STEP 1: Pick a Date */}
      {step === 1 && (
        <DatePicker
          date={selectedDate}
          setDate={setSelectedDate}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* STEP 2: Choose a Time Slot */}
      {step === 2 && (
        <TimeSlotSelector
          date={selectedDate}
          time={selectedTime}
          setTime={setSelectedTime}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* STEP 3: Booking Confirmation */}
      {step === 3 && (
        <BookingConfirmation
          date={selectedDate}
          time={selectedTime}
          service={selectedService} // Pass the full service object
          onConfirm={handleConfirmBooking} // Pass the new function
          onEdit={handleBack} // This function already exists
        />
      )}
    </View>
  );
}