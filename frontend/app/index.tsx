"use client";

import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
    // router.replace("/booking"); // redirect to login screen
    //router.replace("/services");
    //router.replace("/login");
    router.replace("/signup");
    
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-4xl font-bold text-white">MyApp 🚀</Text>
    </View>
  );
}
