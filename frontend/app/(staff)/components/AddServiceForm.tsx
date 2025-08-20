// File: frontend/app/(staff)/components/AddServiceForm.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddServiceForm = () => {
  const router = useRouter();

  // State to hold the form input values
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    // Basic validation
    if (!name || !duration || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Prepare the service data to be sent to the backend
    const newServiceData = {
      name,
      duration,
      price: parseFloat(price), // Convert price to a number
    };

    console.log('New Service Data to be sent:', newServiceData);

    // TODO: This is where you would make the API call to your backend
    // to create a new service.
    // For example:
    // try {
    //   const response = await fetch('YOUR_BACKEND_API_URL/services', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newServiceData),
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     console.log('Service added successfully:', result);
    //     // After successful creation, navigate back to the services list
    //     router.back();
    //   } else {
    //     console.error('Failed to add service:', result);
    //     Alert.alert('Error', 'Failed to add service. Please try again.');
    //   }
    // } catch (error) {
    //   console.error('API call failed:', error);
    //   Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    // }
    
    // Simulate successful save and navigate back
    console.log('Simulating save and navigating back...');
    router.back();
  };

  const handleCancel = () => {
    // Navigate back to the previous screen without saving
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Service</Text>

      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (e.g., 30 min, 1.5 hr)"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Price (e.g., 25.00)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Save Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <MaterialCommunityIcons name="cancel" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
});

export default AddServiceForm;
