"use client";

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin" && password === "1234") {
      router.replace("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-4 bg-white gap-4">
      <Text className="text-3xl font-bold text-blue-700">Login</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-md p-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-md p-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 px-6 py-3 rounded-md mt-2"
      >
        <Text className="text-white font-semibold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
