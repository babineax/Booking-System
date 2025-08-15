// File: frontend/app/(admin)/components/ServicesList.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGetServicesQuery } from '../../../src/redux/apis/firebaseServicesApiSlice';

// Define a type for a service object
type Service = {
  id?: string;
  name: string;
};

const ServicesList = () => {
  const router = useRouter();
  const { data: services = [], isLoading, error } = useGetServicesQuery({} as any);

  // Type the serviceId parameter as a string
  const handlePressService = (serviceId: string) => {
    console.log('Pressed service with ID:', serviceId);
    // router.push(`/manage-services/${serviceId}`);
  };

  // Type the 'item' parameter as the Service type
  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      style={styles.serviceItem} 
      onPress={() => handlePressService(item.id || '')}
    >
      <Text style={styles.serviceText}>{item.name}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#555" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading services</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => {/* navigate to add screen */}}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id || item.name}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  serviceText: {
    fontSize: 16,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default ServicesList;
