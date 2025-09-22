import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button } from 'react-native';
import Toast from 'react-native-toast-message';

// Define the props for the AddClientModal component.
export type AddClientModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newClient: { firstName: string; lastName: string; email: string; phone: string; }) => void;
  isSaving: boolean;
};

const AddClientModal = ({ isVisible, onClose, onSave, isSaving }: AddClientModalProps) => {
  // State to hold the form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Function to handle saving the client data
  const handleSave = () => {
    if (!firstName || !lastName || !email || !phone) {
        Toast.show({ type: 'error', text1: 'All fields are required' });
        return;
    }
    onSave({ firstName, lastName, phone, email });
  };

  // Clear form when modal becomes visible or invisible
  useEffect(() => {
    if (!isVisible) {
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Client</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
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
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#e74c3c" disabled={isSaving} />
            <Button title={isSaving ? "Saving..." : "Save Client"} onPress={handleSave} color="#2ecc71" disabled={isSaving} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
});

export default AddClientModal;
