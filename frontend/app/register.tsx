import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useRegisterMutation } from "../app/redux/apis/usersApiSlice";

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

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async () => {
    try {
      const res = await register(form).unwrap();
      console.log("User registered:", res);
      alert("Registered successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Registration failed");
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
      <Button title="Register" onPress={handleSubmit} disabled={isLoading} />
      {error && (
        <Text style={{ color: "red" }}>Error: {JSON.stringify(error)}</Text>
      )}
    </View>
  );
};

export default RegisterScreen;
