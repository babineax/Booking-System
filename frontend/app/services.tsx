'use client';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ServiceCard from '@/components/ ServiceCard';
import { useRouter } from 'expo-router';

// ✅ Define the shape of each service
type Service = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
};

export default function ServiceListScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('https://your-api.com/services') // Replace with your actual backend API
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator className="mt-20" size="large" />;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Available Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={(service: Service) =>
              router.push({
                pathname: '/services',
                params: { serviceId: service.id },
              })
            }
          />
        )}
      />
    </View>
  );
}
