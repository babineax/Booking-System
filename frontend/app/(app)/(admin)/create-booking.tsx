import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetServices } from "../../../features/services/hooks/useGetServices";
import { useCreateBooking } from "../../../features/booking/hooks/useCreateBooking";
import { useGetClients } from "../../../features/users/hooks/useGetClients";
import { useCreateClient } from "../../../features/users/hooks/useCreateClient";
import ServiceSelector from "../../../components/ServiceSelector";
import StaffSelector from "../../../components/StaffSelector";
import DatePicker from "../../../components/DatePicker";
import TimeSlotSelector from "../../../components/TimeSlotSelector";
import BookingConfirmation from "../../../components/BookingConfirmation";
import ClientSelector from "./components/ClientSelector";
import AddClientModal from "./components/AddClientModal";
import Toast from "react-native-toast-message";

export default function AdminCreateBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // State for the booking flow
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientName, setSelectedClientName] = useState("");

  // State for the Add Client modal
  const [isModalVisible, setModalVisible] = useState(false);

  // Data fetching hooks
  const { data: services = [], isLoading: servicesLoading } = useGetServices();
  const { data: clients = [], isLoading: clientsLoading, refetch: refetchClients } = useGetClients();
  
  // Mutation hooks
  const { mutate: createBooking, isPending: bookingLoading } = useCreateBooking();
  const { mutate: createClient, isPending: isCreatingClient } = useCreateClient();

  // If a client is passed via params, set it and skip to the service selection step
  useEffect(() => {
    if (params.clientId && params.clientName) {
      setSelectedClientId(params.clientId as string);
      setSelectedClientName(params.clientName as string);
      setStep(1); // Skip client selection
    }
  }, [params]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSelectClient = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleNext();
  };

  const handleSaveClient = (clientData: { firstName: string; lastName: string; email: string; phone: string; }) => {
    createClient(clientData, {
      onSuccess: (newlyCreatedClient) => {
        setModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Client Added',
          text2: `${clientData.firstName} ${clientData.lastName} has been added.`,
        });
        refetchClients().then(data => {
            const newClient = data?.data?.find(c => c.id === newlyCreatedClient.id)
            if (newClient) {
                handleSelectClient(newClient.id!, `${newClient.firstName} ${newClient.lastName}`);
            }
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Creation Failed',
          text2: error.message || 'An unexpected error occurred.',
        });
      },
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedServiceId || !selectedStaffId || !selectedDate || !selectedTime || !selectedClientId) {
      Alert.alert("Error", "Please complete all previous steps.");
      return;
    }

    const startTimeISO = new Date(`${selectedDate}T${selectedTime}`).toISOString();

    createBooking(
      {
        serviceId: selectedServiceId,
        startTime: startTimeISO,
        clientId: selectedClientId,
        serviceProviderId: selectedStaffId,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Booking Created!",
            text2: `Appointment for ${selectedClientName} has been scheduled.`,
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

  const selectedService = services.find((s) => s.id === selectedServiceId) || null;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ClientSelector
            clients={clients}
            isLoading={clientsLoading}
            onSelectClient={handleSelectClient}
            onAddNewClient={() => setModalVisible(true)}
          />
        );
      case 1:
        return (
          <ServiceSelector
            services={services}
            service={selectedServiceId}
            setService={(serviceId) => {
              setSelectedServiceId(serviceId);
              setSelectedStaffId(""); // Reset staff selection when service changes
            }}
            onNext={handleNext}
            onBack={() => setStep(0)} // Go back to client selection
          />
        );
      case 2:
        return (
          <StaffSelector
            serviceId={selectedServiceId}
            staff={selectedStaffId}
            setStaff={setSelectedStaffId}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <TimeSlotSelector
            date={selectedDate}
            time={selectedTime}
            setTime={setSelectedTime}
            serviceId={selectedServiceId}
            staffId={selectedStaffId}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirmBooking}
            onEdit={() => setStep(0)} // Go back to the start
            isLoading={bookingLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Booking for {selectedClientName || "..."}</Text>
      {renderStep()}
      <AddClientModal 
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveClient}
        isSaving={isCreatingClient}
      />
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
