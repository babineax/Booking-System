import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // You can uncomment and choose which route to redirect to
      // router.replace("/booking");
      // router.replace("/services");
      // router.replace("/login");
      router.replace("/signup");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking System</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF", 
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1D4ED8", 
  },
});
