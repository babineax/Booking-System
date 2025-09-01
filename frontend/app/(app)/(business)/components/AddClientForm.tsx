// File: frontend/app/(business)/components/AddClientForm.tsx
// This file is updated to include a TypeScript interface for props.

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

// Define the interface for the client data to ensure type safety.
interface ClientData {
  name: string;
  phone: string;
  email: string;
}

// Define the props for the AddClientForm component.
// The onSave prop is a function that takes a ClientData object and returns void.
interface AddClientFormProps {
  onSave: (clientData: ClientData) => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Only save if all fields are filled
    if (name && phone && email) {
      onSave({ name, phone, email });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Client Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Client</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f7fafc',
    fontSize: 16,
    color: '#1a202c',
  },
  button: {
    backgroundColor: '#3182ce',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddClientForm;
