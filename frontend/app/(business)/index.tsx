// File: frontend/app/(business)/index.tsx
// This is a redesigned, visually improved, and more functional business dashboard screen.
// This version includes corrected TypeScript type definitions to resolve the reported errors.

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import ClientsList from './components/ClientsList';

// Define the type for a client object to ensure type safety throughout the app.
// This resolves the 'implicit any' errors.
type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

// Define the props for the AddClientModal component.
// This resolves the 'Binding element implicitly has an 'any' type' errors.
type AddClientModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newClient: Client) => void;
};

// A new component for the "Add Client" modal.
const AddClientModal = ({ isVisible, onClose, onSave }: AddClientModalProps) => {
  // State to hold the form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Function to handle saving the client data
  const handleSave = () => {
    const newClient: Client = {
      // For now, we'll use a simple timestamp as a mock ID.
      // In a real app, the backend would generate a unique ID.
      id: Date.now().toString(),
      firstName,
      lastName,
      phone,
      email,
    };
    onSave(newClient); // Pass the new client data to the parent component
    onClose(); // Close the modal
    // Clear the form fields after saving.
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Add New Client</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={modalStyles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#e74c3c" />
            <Button title="Save Client" onPress={handleSave} color="#2ecc71" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the AddClientModal component
const modalStyles = StyleSheet.create({
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
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

// A component for displaying key statistics on the dashboard.
const DashboardStats = () => {
  return (
    <View style={statsStyles.statsContainer}>
      <View style={statsStyles.statBox}>
        <Text style={statsStyles.statNumber}>12</Text>
        <Text style={statsStyles.statLabel}>Total Clients</Text>
      </View>
      <View style={statsStyles.statBox}>
        <Text style={statsStyles.statNumber}>3</Text>
        <Text style={statsStyles.statLabel}>Upcoming</Text>
      </View>
      <View style={statsStyles.statBox}>
        <Text style={statsStyles.statNumber}>$750</Text>
        <Text style={statsStyles.statLabel}>This Week</Text>
      </View>
    </View>
  );
};

// Styles for the DashboardStats component
const statsStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});

const BusinessDashboard = () => {
  // State to manage the visibility of the AddClientModal
  const [isModalVisible, setModalVisible] = useState(false);
  // State to hold the list of clients. This is where we will add the new client.
  const [clients, setClients] = useState<Client[]>([
    { id: '1', firstName: 'Alice', lastName: 'Johnson', phone: '123-456-7890', email: 'alice.j@example.com' },
    { id: '2', firstName: 'Bob', lastName: 'Smith', phone: '987-654-3210', email: 'bob.s@example.com' },
    { id: '3', firstName: 'Charlie', lastName: 'Brown', phone: '555-123-4567', email: 'charlie.b@example.com' },
    { id: '4', firstName: 'Diana', lastName: 'Prince', phone: '111-222-3333', email: 'diana.p@example.com' },
    { id: '5', firstName: 'Eva', lastName: 'Green', phone: '444-555-6666', email: 'eva.g@example.com' },
  ]);

  // Function to handle saving a new client.
  // The 'newClient' parameter is now explicitly typed as 'Client'.
  const handleSaveClient = (newClient: Client) => {
    // In a real app, you would send this to your backend here.
    // For now, we'll just log it to the console and add it to our local state.
    console.log('New client to be saved:', newClient);
    setClients(prevClients => [...prevClients, newClient]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Main header for the screen with a button to add a new client */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Dashboard</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Section title for key stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <DashboardStats />
        
        {/* Section title for the client list */}
        <Text style={styles.sectionTitle}>My Clients</Text>
        {/* Pass the updated clients state to the component */}
        <ClientsList clients={clients} />
      </ScrollView>

      {/* The modal component for adding a new client */}
      <AddClientModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveClient}
      />
    </SafeAreaView>
  );
};

// Styles for the main dashboard view
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7', // A light, clean background color
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700', // Bolder font weight for emphasis
    color: '#2c3e50', // Darker text for readability
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default BusinessDashboard;
