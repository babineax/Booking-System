import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type Service = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
};

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

export default function ServiceCard({ service, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(service)}
    >
      <Text style={styles.title}>{service.name}</Text>
      {service.description ? (
        <Text style={styles.description}>{service.description}</Text>
      ) : null}
      <View style={styles.detailsContainer}>
        {service.duration ? (
          <Text style={styles.detailText}>⏱ {service.duration}</Text>
        ) : null}
        {service.price ? (
          <Text style={styles.detailText}>💰 {service.price}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    marginTop: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
});