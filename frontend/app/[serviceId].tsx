"use client";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useGetServiceByIdQuery } from "@/src/redux/apis/firebaseServicesApiSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { bookingService } from "../firebase/services/bookingService";

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();

  const { userInfo, firebaseUser } = useSelector((state: any) => state.auth);
  const currentUserId = userInfo?.id || firebaseUser?.uid || null;

  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useGetServiceByIdQuery(serviceId as string, {
    skip: !serviceId, // Don't run query if ID is undefined
  });

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (isLoading) {
    return <Text className="mt-20 text-center">Loading...</Text>;
  }

  if (isError) {
    console.error("Failed to fetch service:", error);
    return (
      <Text className="mt-20 text-center text-red-500">
        Failed to load service.
      </Text>
    );
  }

  if (!service) {
    return <Text className="mt-20 text-center">No service found.</Text>;
  }

  const handleConfirmBooking = async () => {
    try {
      if (!currentUserId) {
        Alert.alert("Error", "You must be logged in to book a service.");
        return;
      }

      if (!service.staffMembers || service.staffMembers.length === 0) {
        Alert.alert("Error", "No staff available for this service.");
        return;
      }

      const staffMemberId = service.staffMembers[0];

      await bookingService.createBooking({
        customerId: currentUserId,
        serviceId: serviceId as string,
        staffMemberId,
        appointmentDate: new Date(selectedDate),
        startTime: selectedTime,
        endTime: "",
        totalPrice: service.price,
        customerNotes: "",
      });

      Alert.alert("Success", "Your booking has been created!");
      router.replace("/(app)");
    } catch (err: any) {
      console.error("Booking error", err);
      if (err.message?.includes("Time slot is already booked")) {
        Alert.alert(
          "Slot unavailable",
          "Sorry, this time is already taken. Please choose another."
        );
      } else {
        Alert.alert("Error", err.message || "Failed to create booking.");
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: // service overview
        return (
          <View>
            <Text className="text-2xl font-bold">{service.name}</Text>
            <Text className="text-gray-700 mt-2">{service.description}</Text>
            <Text className="mt-4 text-lg">{service.duration} minutes</Text>
            <Text className="text-xl font-bold text-blue-700">
              ${service.price}
            </Text>
            <Button title="Book Now" onPress={() => setStep(1)} />
          </View>
        );
      case 1:
        return (
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <TimeSlotSelector
            date={selectedDate}
            time={selectedTime}
            setTime={setSelectedTime}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            serviceId={serviceId as string}
          />
        );
      case 3:
        return (
          <View>
            <Text className="text-xl font-bold mb-2">Confirm Booking</Text>
            <Text>Service: {service.name}</Text>
            <Text>Date: {selectedDate}</Text>
            <Text>Time: {selectedTime}</Text>
            <Text>Total: ${service.price}</Text>
            <View style={{ marginTop: 16 }}>
              <Button title="Back" onPress={() => setStep(2)} />
              <Button title="Confirm Booking" onPress={handleConfirmBooking} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <BookingStepper currentStep={step} />
      {renderStep()}
    </View>
  );
}
