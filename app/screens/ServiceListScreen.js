// screens/ServiceListScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import ServiceCard from '../components/ServiceCard';

const sampleServices = [
  { id: '1', name: 'Haircut', description: 'Basic haircut.', duration: 30, price: 25 },
  { id: '2', name: 'Consultation', description: 'Personal consultation.', duration: 60, price: 50 },
  { id: '3', name: 'Styling', description: 'Hair styling.', duration: 45, price: 35 },
];

const ServiceListScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [services, setServices] = useState(sampleServices);

  const filtered = services.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Search services..."
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 16, padding: 10, borderColor: '#ccc', borderWidth: 1 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
          />
        )}
      />
    </View>
  );
};

export default ServiceListScreen;
