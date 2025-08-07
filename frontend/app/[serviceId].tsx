"use client";
import { useGetServiceByIdQuery } from "@/src/redux/apis/servicesApiSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useGetServiceByIdQuery(serviceId as string, {
    skip: !serviceId, // Don't run query if ID is undefined
  });

  if (isLoading) {
    return <Text className="mt-20 text-center">Loading...</Text>;
  }

  if (isError) {
    console.error("Failed to fetch service:", error);
    return (
      <Text className="mt-20 text-center text-red-500">
        Failed to load service.
      </Text>
    );
  }

  if (!service) {
    return <Text className="mt-20 text-center">No service found.</Text>;
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold">{service.name}</Text>
      <Text className="text-gray-700 mt-2">{service.description}</Text>
      <Text className="mt-4 text-lg">{service.duration} minutes</Text>
      <Text className="text-xl font-bold text-blue-700">${service.price}</Text>

      <Button
        title="Book Now"
        onPress={() => router.push(`/book/${service.id}`)}
      />
    </View>
  );
}
