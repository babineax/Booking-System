// screens/AdminServiceForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const AdminServiceForm = ({ navigation }) => {
  const [service, setService] = useState({ name: '', description: '', duration: '', price: '' });

  const handleSave = () => {
    // Save to backend or context state
    Alert.alert('Service saved');
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Name" value={service.name} onChangeText={(v) => setService({ ...service, name: v })} />
      <TextInput placeholder="Description" value={service.description} onChangeText={(v) => setService({ ...service, description: v })} />
      <TextInput placeholder="Duration (minutes)" keyboardType="numeric" value={service.duration} onChangeText={(v) => setService({ ...service, duration: v })} />
      <TextInput placeholder="Price ($)" keyboardType="numeric" value={service.price} onChangeText={(v) => setService({ ...service, price: v })} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default AdminServiceForm;
