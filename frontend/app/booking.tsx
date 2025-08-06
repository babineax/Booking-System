"use client";

import BookingConfirmation from "@/components/BookingConfirmation";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useState } from "react";
import { View } from "react-native";

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
      {step === 0 && (
        <DatePicker
          date={selectedDate}
          setDate={setSelectedDate}
          onNext={handleNext}
        />
      )}
      {step === 1 && (
        <TimeSlotSelector
          date={selectedDate}
          time={selectedTime}
          setTime={setSelectedTime}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <ServiceSelector
          service={selectedService}
          setService={setSelectedService}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
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
