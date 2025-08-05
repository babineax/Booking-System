"use client";

import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-green-700">Dashboard</Text>
      <Text className="text-gray-500">You are logged in 🚀</Text>
    </View>
  );
}
