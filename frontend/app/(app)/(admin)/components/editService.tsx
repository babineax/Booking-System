'use client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetServiceByIdQuery, useUpdateServiceMutation, useDeleteServiceMutation } from '@/src/redux/apis/firebaseServicesApiSlice';

export default function EditServiceScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();

  const { data: service, isLoading } = useGetServiceByIdQuery(serviceId);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price?.toString() || '',
        duration: service.duration?.toString() || '',
      });
    }
  }, [service]);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#00BCD4" />;
  }

  const handleUpdate = async () => {
    try {
      await updateService({
        id: serviceId,
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
      }).unwrap();
      Alert.alert('Success', 'Service updated successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to update service');
    }
  };

  const handleDelete = () => {
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
              await deleteService(serviceId).unwrap();
              Alert.alert('Deleted', 'Service removed successfully');
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Service</Text>

      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price (KES)"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (min)"
        keyboardType="numeric"
        value={formData.duration}
        onChangeText={(text) => setFormData({ ...formData, duration: text })}
      />

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdate}
        disabled={isUpdating}
      >
        <Text style={styles.buttonText}>{isUpdating ? 'Updating...' : 'Update Service'}</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        <Text style={styles.buttonText}>{isDeleting ? 'Deleting...' : 'Delete Service'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  updateButton: { backgroundColor: '#00BCD4', padding: 15, borderRadius: 8, marginTop: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
