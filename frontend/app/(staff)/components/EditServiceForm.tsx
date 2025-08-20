// File: frontend/app/(staff)/components/EditServiceForm.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define the type for a service object
type Service = {
  id: string;
  name: string;
  duration: string;
  price: number;
};

// Placeholder data to simulate fetching a service from the backend
const dummyServices: Service[] = [
  { id: 's1', name: 'Haircut', duration: '30 min', price: 25 },
  { id: 's2', name: 'Beard Trim', duration: '15 min', price: 15 },
  { id: 's3', name: 'Coloring', duration: '1.5 hr', price: 80 },
];

const EditServiceForm = () => {
  const router = useRouter();
  // Get the serviceId from the URL parameters
  const { serviceId } = useLocalSearchParams();

  // State to hold the form input values
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  // Use useEffect to fetch the service data when the component loads
  // and the serviceId is available.
  useEffect(() => {
    if (serviceId) {
      // TODO: This is where you would make the API call to your backend
      // to fetch the details of the service with the given ID.
      // For example:
      // fetch(`YOUR_BACKEND_API_URL/services/${serviceId}`)
      //   .then(response => response.json())
      //   .then(data => {
      //     setName(data.name);
      //     setDuration(data.duration);
      //     setPrice(data.price.toString());
      //     setLoading(false);
      //   });

      // Simulating an API call with dummy data
      const serviceToEdit = dummyServices.find(s => s.id === serviceId);
      if (serviceToEdit) {
        setName(serviceToEdit.name);
        setDuration(serviceToEdit.duration);
        setPrice(serviceToEdit.price.toString());
      } else {
        Alert.alert('Error', 'Service not found.');
        router.back();
      }
      setLoading(false);
    }
  }, [serviceId]);

  const handleSave = () => {
    if (!name || !duration || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const updatedServiceData = {
      id: serviceId,
      name,
      duration,
      price: parseFloat(price),
    };

    console.log('Updated Service Data:', updatedServiceData);

    // TODO: This is where you would make the API call to your backend
    // to update the service.
    // For example, using a PUT or PATCH request:
    // fetch(`YOUR_BACKEND_API_URL/services/${serviceId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedServiceData),
    // })
    //   .then(...)
    
    // Simulate successful save and navigate back
    console.log('Simulating update and navigating back...');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading service details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Service</Text>

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
          <Text style={styles.buttonText}>Save Changes</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EditServiceForm;
