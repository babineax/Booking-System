// File: frontend/app/(staff)/components/StaffServicesList.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define the type for a service object
type Service = {
  id: string;
  name: string;
  duration: string;
  price: number;
};

// Placeholder data for the staff's services
const servicesData: Service[] = [
  { id: 's1', name: 'Haircut', duration: '30 min', price: 25 },
  { id: 's2', name: 'Beard Trim', duration: '15 min', price: 15 },
  { id: 's3', name: 'Coloring', duration: '1.5 hr', price: 80 },
];

const StaffServicesList = () => {
  const router = useRouter();

  const handleAddService = () => {
    console.log("Navigating to Add Service screen...");
    router.push('/(staff)/add-service');
  };

  // Now, we'll pass the service ID as a URL parameter
  const handleEditService = (serviceId: string) => {
    console.log(`Navigating to Edit Service screen for ID: ${serviceId}`);
    // This pushes a new screen to the stack and passes the ID as a parameter
    router.push({
      pathname: '/(staff)/edit-service',
      params: { serviceId: serviceId }
    });
  };

  const handleDeleteService = (serviceId: string) => {
    console.log(`Deleting service with ID: ${serviceId}`);
    // TODO: Display a confirmation modal, then make an API call to delete the service from the backend
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDetails}>
          {item.duration} | ${item.price}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditService(item.id)}>
          <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteService(item.id)}>
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>My Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={servicesData}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDetails: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default StaffServicesList;
