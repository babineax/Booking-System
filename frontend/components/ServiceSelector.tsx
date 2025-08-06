import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

type Service = {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
};

const DUMMY_SERVICES: Service[] = [
  { _id: '1', name: 'Haircut', description: 'Classic haircut and style', duration: 30, price: 3000 },
  { _id: '2', name: 'Beard Trim', description: 'Professional beard trimming and shaping', duration: 15, price: 1500 },
  { _id: '3', name: 'Manicure & Pedicure', description: 'Full manicure and pedicure service', duration: 60, price: 5000 },
  { _id: '4', name: 'Hair Styling', description: 'Advanced hair styling for events', duration: 45, price: 4000 },
];

type Props = {
  service: string;
  setService: (id: string) => void;
  onNext: () => void;
  onBack?: () => void;
};

const ServiceSelector = ({ service, setService, onNext, onBack }: Props) => {
  const [services, setServices] = useState<Service[]>(DUMMY_SERVICES);

  const renderItem = ({ item }: { item: Service }) => {
    const isSelected = service === item._id;

    return (
      <TouchableOpacity
        onPress={() => setService(item._id)}
        style={[
          styles.serviceCard,
          isSelected ? styles.serviceCardSelected : styles.serviceCardDefault,
        ]}
      >
        <Text
          style={[
            styles.serviceName,
            isSelected ? styles.serviceNameSelected : styles.serviceNameDefault,
          ]}
        >
          {item.name}
        </Text>
        {item.price && (
          <Text
            style={[
              styles.servicePrice,
              isSelected ? styles.servicePriceSelected : styles.servicePriceDefault,
            ]}
          >
            KES {item.price}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Service</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.button, styles.backButton]}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          disabled={!service}
          onPress={onNext}
          style={[styles.button, styles.nextButton, !service && styles.nextButtonDisabled]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  list: {
    flex: 1,
  },
  serviceCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  serviceCardDefault: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  serviceCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  serviceNameDefault: {
    color: '#000',
  },
  serviceNameSelected: {
    color: '#fff',
  },
  servicePrice: {
    fontSize: 14,
  },
  servicePriceDefault: {
    color: '#4B5563',
  },
  servicePriceSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    backgroundColor: '#D1D5DB',
  },
  backButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  nextButton: {
    marginLeft: 8,
    backgroundColor: '#2563EB',
  },
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ServiceSelector;