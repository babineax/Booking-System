'use client';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGetServicesQuery } from '../src/redux/apis/servicesApiSlice';


type Service = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
};

export default function ServiceListScreen() {
  const router = useRouter();
  const { data: services = [], isLoading, error } = useGetServicesQuery({});

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading services</Text>
      </View>
    );
  }

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => router.push({
        pathname: '/[serviceId]',
        params: { serviceId: item._id },
      })}
    >
      <Text style={styles.serviceName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.serviceDescription}>{item.description}</Text>
      )}
      <View style={styles.serviceDetails}>
        {item.duration && (
          <Text style={styles.serviceDuration}>{item.duration} min</Text>
        )}
        {item.price && (
          <Text style={styles.servicePrice}>KES {item.price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={renderServiceCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
