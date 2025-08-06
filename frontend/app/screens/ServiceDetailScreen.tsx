import { View, Text, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    fetch(`https://your-api.com/services/${serviceId}`)
      .then(res => res.json())
      .then(data => setService(data));
  }, []);

  if (!service) return <Text className="mt-20 text-center">Loading...</Text>;

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold">{service.name}</Text>
      <Text className="text-gray-700 mt-2">{service.description}</Text>
      <Text className="mt-4 text-lg">{service.duration} minutes</Text>
      <Text className="text-xl font-bold text-blue-700">${service.price}</Text>
      <Button title="Book Now" onPress={() => { /* navigate to booking screen */ }} />
    </View>
  );
}
