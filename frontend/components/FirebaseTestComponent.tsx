import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';
import { serviceService, userService, type Service } from '../firebase/services';

const FirebaseTestComponent = () => {
  const [firebaseStatus, setFirebaseStatus] = useState('Testing...');
  const [services, setServices] = useState<Service[]>([]);
  const [details, setDetails] = useState<string[]>([]);

  const addDetail = (detail: string) => {
    setDetails(prev => [...prev, `${new Date().toLocaleTimeString()}: ${detail}`]);
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setDetails([]);
      addDetail('Starting Firebase connection test...');
      
      // Test Firebase config
      addDetail(`✓ Firebase config loaded`);
      addDetail(`Project ID: ${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}`);
      addDetail(`Auth Domain: ${process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
      
      // Test Auth
      addDetail(`Auth current user: ${auth.currentUser ? auth.currentUser.email : 'None'}`);
      
      // Test direct Firestore connection
      addDetail('Testing direct Firestore connection...');
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        addDetail(`✓ Direct Firestore query successful. Users: ${usersSnapshot.size}`);
      } catch (directError: any) {
        addDetail(`❌ Direct Firestore error: ${directError.message}`);
        addDetail(`Error code: ${directError.code}`);
      }
      
      // Test service layer
      addDetail('Testing service layer...');
      const servicesList = await serviceService.getAllServices();
      setServices(servicesList);
      addDetail(`✓ Service layer working. Services: ${servicesList.length}`);
      
      setFirebaseStatus('✅ Firebase connected successfully!');
      
      console.log('Firebase Auth:', auth);
      console.log('Firebase DB:', db);
      console.log('Services from Firebase:', servicesList);
    } catch (error: any) {
      console.error('Firebase connection error:', error);
      addDetail(`❌ General error: ${error.message}`);
      setFirebaseStatus(`❌ Firebase Error: ${error.message}`);
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
    <ScrollView style={{ padding: 20, backgroundColor: 'white', margin: 10, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Firebase Test Component
      </Text>
      
      <Text style={{ 
        marginBottom: 10, 
        color: firebaseStatus.includes('❌') ? 'red' : firebaseStatus.includes('✅') ? 'green' : 'orange',
        fontSize: 16,
        fontWeight: 'bold'
      }}>
        {firebaseStatus}
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
          marginBottom: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Test User Registration</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: '#f8f9fa', padding: 10, borderRadius: 5 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Debug Details:
        </Text>
        {details.map((detail, index) => (
          <Text key={index} style={{ 
            fontSize: 12, 
            marginVertical: 1, 
            fontFamily: 'monospace',
            color: detail.includes('❌') ? 'red' : detail.includes('✓') ? 'green' : 'black'
          }}>
            {detail}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default FirebaseTestComponent;
