import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetServices } from '../../../../features/services/hooks/useGetServices';

interface ServiceSelectorProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
}

const StaffServiceSelector: React.FC<ServiceSelectorProps> = ({ selectedServiceIds, onToggleService }) => {
  const { data: services = [], isLoading } = useGetServices();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linked Services</Text>
      {isLoading ? (
        <Text>Loading services...</Text>
      ) : (
        services.map(service => {
          const isSelected = selectedServiceIds.includes(service.id);
          return (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceItem}
              onPress={() => onToggleService(service.id)}
            >
              <MaterialCommunityIcons 
                name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'} 
                size={24} 
                color={isSelected ? '#34C759' : '#9CA3AF'} 
              />
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceName: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default StaffServiceSelector;
