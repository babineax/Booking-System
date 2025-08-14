import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';
import { serviceService, userService, type Service } from '../firebase/services';

const FirebaseTestComponent = () => {
  const [firebaseStatus, setFirebaseStatus] = useState('Testing...');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      
      console.log('Firebase Auth:', auth);
      console.log('Firebase DB:', db);
      
      
      const servicesList = await serviceService.getAllServices();
      setServices(servicesList);
      setFirebaseStatus('Firebase connected successfully!');
      
      console.log('Services from Firebase:', servicesList);
    } catch (error: any) {
      console.error('Firebase connection error:', error);
      setFirebaseStatus(`Firebase Error: ${error.message}`);
    }
  };

  const testUserRegistration = async () => {
    try {
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer' as const
      };

      const result = await userService.register(testUser);
      Alert.alert('Success', 'Test user created successfully!');
      console.log('User created:', result);
    } catch (error: any) {
      Alert.alert('Error', `Failed to create user: ${error.message}`);
      console.error('User creation error:', error);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: 'white', margin: 10, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Firebase Test Component
      </Text>
      
      <Text style={{ marginBottom: 10, color: firebaseStatus.includes('Error') ? 'red' : 'green' }}>
        Status: {firebaseStatus}
      </Text>
      
      <Text style={{ marginBottom: 10 }}>
        Services found: {services.length}
      </Text>
      
      <TouchableOpacity
        onPress={testFirebaseConnection}
        style={{
          backgroundColor: '#007bff',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Test Firebase Connection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={testUserRegistration}
        style={{
          backgroundColor: '#28a745',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Test User Registration</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FirebaseTestComponent;
