import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { userService } from "../firebase/services/userService";
import { setCredentials } from "../src/redux/features/auth/authSlice";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "customer" | "staff" | "admin";
};
type FormField = keyof Omit<RegisterForm, "role" | "confirmPassword">;

const RegisterScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "customer",
  });

  const fields: FormField[] = [
    "username",
    "email",
    "password",
    "firstName",
    "lastName",
    "phone",
  ];

  const handleSubmit = async () => {
    // Basic validation
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.firstName ||
      !form.lastName
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const { user, firebaseUser } = await userService.register(form);

      // Set credentials in Redux store
      dispatch(
        setCredentials({
          user: user,
          token: await firebaseUser.getIdToken(),
          isAdmin: user.isAdmin,
        })
      );

      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => {
            if (user.isAdmin) {
              router.replace("/(admin)");
            } else {
              router.replace("/(app)");
            }
          },
        },
      ]);
    } catch (error: any) {
      let message = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "That email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }
      Alert.alert("Registration Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {fields.map((field) => (
        <TextInput
          key={field}
          placeholder={field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())}
          secureTextEntry={field === "password"}
          value={form[field]}
          onChangeText={(val) => setForm((prev) => ({ ...prev, [field]: val }))}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
      ))}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#00BCD4",
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegisterScreen;
