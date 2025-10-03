import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCreateClient } from "../../../features/clients/hooks/useCreateClient";
import Toast from "react-native-toast-message";

export default function CreateClientScreen() {
  const router = useRouter();
  const { mutate: createClient, isPending } = useCreateClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "First name, last name, and email are required.");
      return;
    }

    createClient(
      {
        firstName,
        lastName,
        email,
        phone,
        username: email, // Default username to email
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Client Created",
            text2: "The client has been added successfully.",
          });
          router.back();
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Creation Failed",
            text2: error.message,
          });
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Add New Client</Text>
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
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Button
          title={isPending ? "Creating..." : "Create Client"}
          onPress={handleSave}
          disabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
  },
  form: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    marginBottom: 12,
  },
});
