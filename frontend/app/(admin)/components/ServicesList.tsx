'use client';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetActiveServicesQuery,useDeleteServiceMutation } from '@/src/redux/apis/firebaseServicesApiSlice';

type Service = {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
};

export default function AdminServiceListScreen() {
  const router = useRouter();
  const { data: services = [], isLoading, error, refetch } = useGetActiveServicesQuery({} as any);
  const [deleteService] = useDeleteServiceMutation();

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

  const handleDelete = (id?: string) => {
    if (!id) return;
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteService(id).unwrap();
              refetch();
            } catch (err) {
              console.error('Delete error:', err);
            }
          } 
        }
      ]
    );
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <View style={styles.serviceCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        {item.description && <Text style={styles.serviceDescription}>{item.description}</Text>}
        <View style={styles.serviceDetails}>
          {item.duration && <Text style={styles.serviceDuration}>{item.duration} min</Text>}
          {item.price && <Text style={styles.servicePrice}>KES {item.price}</Text>}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push({ pathname: '/(admin)/components/editService', params: { serviceId: item.id } })}
        >
          <Ionicons name="create-outline" size={22} color="#1976D2" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id || item.name}
        renderItem={renderServiceCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/admin/add-service')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#f44336' },
  serviceCard: {
    flexDirection: 'row',
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
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  serviceDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  serviceDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceDuration: { fontSize: 14, color: '#00BCD4', fontWeight: '500' },
  servicePrice: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 10 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#00BCD4',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
