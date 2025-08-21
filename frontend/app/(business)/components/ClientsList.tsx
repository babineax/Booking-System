// File: frontend/app/(business)/components/ClientsList.tsx
// This component has been updated to use `View` and `map` to fix the `FlatList` error.

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define the type for a client object
type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

// Define the props for the ClientsList component
type ClientsListProps = {
  clients: Client[];
};

const ClientsList: React.FC<ClientsListProps> = ({ clients }) => {
  const router = useRouter();

  const handleAddClient = () => {
    // This will now navigate to the correct 'add-client' route
    router.push('/(business)/add-client');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Clients</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* We are now using a simple View and map instead of FlatList */}
      {clients.length === 0 ? (
        <Text style={styles.emptyText}>No clients found.</Text>
      ) : (
        clients.map(item => (
          <View key={item.id} style={styles.clientItem}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.clientDetails}>
                {item.phone} | {item.email}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => console.log(`Editing client ${item.id}`)}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="#00BCD4" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00BCD4',
    padding: 8,
    borderRadius: 50,
  },
  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientDetails: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    borderRadius: 50,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
});

export default ClientsList;
