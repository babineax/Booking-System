"use client";

import { useState } from "react";
import { View, Text } from "react-native";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import ServiceSelector from "@/components/ServiceSelector";
import BookingConfirmation from "@/components/BookingConfirmation";

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <View className="flex-1 p-4 bg-white">
      <BookingStepper currentStep={step} />

      {/* STEP 0: Select a Service */}
      {step === 0 && (
        <ServiceSelector
          service={selectedService}
          setService={setSelectedService}
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
      {/* This component will still use dummy data for now, but its position is correct. */}
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
          service={selectedService}
          onBack={handleBack}
        />
      )}
    </View>
  );
}