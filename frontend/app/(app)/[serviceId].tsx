"use client";
import BookingStepper from "@/components/BookingStepper";
import DatePicker from "@/components/DatePicker";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import { useCreateBookingMutation } from "@/src/redux/apis/firebaseBookingsApiSlice";
import { useGetServiceByIdQuery } from "@/src/redux/apis/firebaseServicesApiSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

// ✅ Reusable button with consistent styles

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary";
};
const CustomButton = ({ title, onPress, type = "primary" }: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: type === "primary" ? "#2563eb" : "#e5e7eb",
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 12,
    }}
  >
    <Text
      style={{
        color: type === "primary" ? "#fff" : "#374151",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

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
    skip: !serviceId,
  });

  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "#6b7280", fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    console.error("Failed to fetch service:", error);
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "red", fontSize: 16 }}>
          Failed to load service.
        </Text>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "#374151", fontSize: 16 }}>
          No service found.
        </Text>
      </SafeAreaView>
    );
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

      await createBooking({
        customerId: currentUserId,
        serviceId: serviceId as string,
        staffMemberId,
        appointmentDate: new Date(selectedDate).toISOString(),
        startTime: selectedTime,
        endTime: "", // This should be calculated based on start time and duration
        totalPrice: service.price,
        customerNotes: "",
      }).unwrap();

      Alert.alert("Success", "Your booking has been created!");
      router.replace("/(app)");

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

  // ✅ Render steps with UI polish
  const renderStep = () => {
    switch (step) {
      case 0: // Service Overview
        return (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {service.name}
            </Text>
            <Text style={{ marginTop: 8, color: "#4b5563", fontSize: 15 }}>
              {service.description}
            </Text>
            <Text
              style={{ marginTop: 16, fontSize: 16, color: "#374151" }}
            >{`⏱ ${service.duration} minutes`}</Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 20,
                fontWeight: "700",
                color: "#2563eb",
              }}
            >
              ${service.price}
            </Text>
            <CustomButton title="Book Now" onPress={() => setStep(1)} />
          </View>
        );

      case 1: // Date Picker
        return (
          <View style={{ marginTop: 16 }}>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              onNext={() => setStep(2)}
            />
          </View>
        );

      case 2: // Time Slot Selector
        return (
          <View style={{ marginTop: 16 }}>
            <TimeSlotSelector
              date={selectedDate}
              time={selectedTime}
              setTime={setSelectedTime}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              serviceId={serviceId as string}
            />
          </View>
        );

      case 3: // Confirm Booking
        return (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
              Confirm Booking
            </Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: "#374151", fontSize: 16 }}>
                Service: {service.name}
              </Text>
              <Text style={{ color: "#374151", fontSize: 16 }}>
                Date: {selectedDate}
              </Text>
              <Text style={{ color: "#374151", fontSize: 16 }}>
                Time: {selectedTime}
              </Text>
              <Text
                style={{
                  color: "#111827",
                  fontWeight: "600",
                  fontSize: 16,
                  marginTop: 8,
                }}
              >
                Total: ${service.price}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <CustomButton
                  title="Back"
                  type="secondary"
                  onPress={() => setStep(2)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <CustomButton
                  title="Confirm Booking"
                  type="primary"
                  onPress={handleConfirmBooking}
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BookingStepper currentStep={step} />
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}
