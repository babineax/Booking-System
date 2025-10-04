import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { clientService } from "../../../firebase/services/clientService";
import { User } from "../../../firebase/types";

const useClient = (clientId?: string) => {
  return useQuery<User | null, Error>({
    queryKey: ["client", clientId],
    queryFn: () => (clientId ? clientService.getClientById(clientId) : null),
    enabled: !!clientId,
  });
};

export default function EditClientScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clientId } = useLocalSearchParams<{ clientId?: string }>();

  const { data: client, isLoading } = useClient(clientId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isEditMode = !!clientId;

  useEffect(() => {
    if (client) {
      setFirstName(client.firstName || "");
      setLastName(client.lastName || "");
      setEmail(client.email || "");
      setPhone(client.phone || "");
    }
  }, [client]);

  const { mutate: updateClient, isPending: isUpdating } = useMutation<
    User,
    Error,
    { id: string; updates: Partial<User> }
  >({
    mutationFn: ({ id, updates }) => clientService.updateClient(id, updates),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Client Updated" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message,
      });
    },
  });

  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "First name, last name, and email are required.");
      return;
    }

    const clientData = {
      firstName,
      lastName,
      email,
      phone,
    };

    if (isEditMode && clientId) {
      updateClient({ id: clientId, updates: clientData });
    }
  };

  if (isLoading && isEditMode) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading client...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>
          {isEditMode ? "Edit Client" : "Add New Client"}
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[styles.input, isEditMode && styles.disabledInput]}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isEditMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={isEditMode ? "Save Changes" : "Create Client"}
          onPress={handleSave}
          disabled={isUpdating}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  formSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: "#E5E7EB",
    color: "#9CA3AF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 16,
  },
});
