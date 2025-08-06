import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

type Service = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
};

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

export default function ServiceCard({ service, onPress }: Props) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 shadow"
      onPress={() => onPress(service)}
    >
      <Text className="text-xl font-semibold">{service.name}</Text>
      {service.description ? (
        <Text className="text-gray-600 mt-1">{service.description}</Text>
      ) : null}
      <View className="flex-row justify-between mt-2">
        {service.duration ? (
          <Text className="text-sm text-gray-500">⏱ {service.duration}</Text>
        ) : null}
        {service.price ? (
          <Text className="text-sm text-gray-500">💰 {service.price}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
