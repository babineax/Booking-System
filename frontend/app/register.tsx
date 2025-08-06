import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../src/redux/apis/usersApiSlice";
import { setCredentials } from "../src/redux/features/auth/authSlice";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
};
type FormField = keyof RegisterForm;

const RegisterScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
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

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async () => {
    // Basic validation
    if (!form.username || !form.email || !form.password || !form.firstName || !form.lastName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const userData = await register(form).unwrap();
      dispatch(setCredentials(userData));
      
      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => router.replace("/dashboard"),
        }
      ]);
    } catch (error: any) {
      Alert.alert("Registration Failed", error?.data?.message || "Registration failed. Please try again.");
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
      
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#00BCD4',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RegisterScreen;
