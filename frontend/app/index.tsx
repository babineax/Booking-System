"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        
        const userData = await AsyncStorage.getItem("userInfo");
        
        if (userData && userInfo) {
          
          router.replace("/dashboard");
        } else {
          
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

   
    setTimeout(() => {
      checkAuthStatus();
    }, 2000);
  }, [userInfo]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-4xl font-bold text-white">Booking App 🚀</Text>
      {isLoading && (
        <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}
