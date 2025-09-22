import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { User } from '../../../../firebase/services/userService';

interface ClientSelectorProps {
  clients: User[];
  isLoading: boolean;
  onSelectClient: (clientId: string, clientName: string) => void;
  onAddNewClient: () => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ clients, isLoading, onSelectClient, onAddNewClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#3182ce" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Client</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a client..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.clientItem} onPress={() => onSelectClient(item.id!, `${item.firstName} ${item.lastName}`)}>
            <Text style={styles.clientName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.clientEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No clients found.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={onAddNewClient}>
        <Text style={styles.addButtonText}>+ Add New Client</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#f7fafc',
  },
  clientItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clientEmail: {
    fontSize: 14,
    color: '#718096',
  },
  addButton: {
    backgroundColor: '#3182ce',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#718096',
  },
});

export default ClientSelector;
