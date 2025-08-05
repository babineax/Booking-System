// screens/ServiceDetailScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const ServiceDetailScreen = ({ route, navigation }) => {
  const { service } = route.params;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{service.name}</Text>
      <Text>{service.description}</Text>
      <Text>Duration: {service.duration} minutes</Text>
      <Text>Price: ${service.price}</Text>
      <Button
        title="Book this service"
        onPress={() => navigation.navigate('Booking', { service })}
      />
    </View>
  );
};

export default ServiceDetailScreen;
