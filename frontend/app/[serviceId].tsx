'use client';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    fetch(`https://your-api.com/services/${serviceId}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(err => {
        console.error("Failed to fetch service:", err);
      });
  }, [serviceId]);

  if (!service) return <Text className="mt-20 text-center">Loading...</Text>;

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold">{service.name}</Text>
      <Text className="text-gray-700 mt-2">{service.description}</Text>
      <Text className="mt-4 text-lg">{service.duration} minutes</Text>
      <Text className="text-xl font-bold text-blue-700">${service.price}</Text>

      <Button title="Book Now" onPress={() => router.push(`/book/${service.id}`)} />
    </View>
  );
}
