// components/ServiceCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ServiceCard = ({ service, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{service.name}</Text>
    <Text>{service.description}</Text>
    <Text>{service.duration} min | ${service.price}</Text>
  </TouchableOpacity>
);

export default ServiceCard;

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
});
