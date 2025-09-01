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

    // Add a small delay to show splash screen
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, [userInfo, router]);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return null;
}
