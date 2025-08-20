// File: frontend/app/(staff)/components/BookingsList.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define the type for a booking object to remove 'any' type errors
type Booking = {
  id: string;
  date: string;
  time: string;
  customer: string;
  service: string;
  status: 'Pending' | 'Accepted';
};

// Placeholder data for the upcoming bookings list, now using the Booking type
const bookingsData: Booking[] = [
  { id: '1', date: 'Oct 26', time: '10:00 AM', customer: 'John Doe', service: 'Haircut', status: 'Pending' },
  { id: '2', date: 'Oct 26', time: '11:30 AM', customer: 'Jane Smith', service: 'Coloring', status: 'Pending' },
  { id: '3', date: 'Oct 27', time: '9:00 AM', customer: 'Michael Brown', service: 'Beard Trim', status: 'Accepted' },
];

const BookingsList = () => {
  // Now explicitly typing the bookingId parameter as a string
  const handleAccept = (bookingId: string) => {
    console.log(`Accepted booking with ID: ${bookingId}`);
    // Here you would add the API call to update the booking status to 'accepted'
  };

  // Now explicitly typing the bookingId parameter as a string
  const handleReject = (bookingId: string) => {
    console.log(`Rejected booking with ID: ${bookingId}`);
    // Here you would add the API call to update the booking status to 'rejected'
  };

  // Explicitly typing the 'item' parameter with our new Booking type
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDate}>{item.date} | {item.time}</Text>
        <Text style={styles.bookingCustomer}>{item.customer}</Text>
        <Text style={styles.bookingService}>{item.service}</Text>
      </View>
      <View style={styles.actionContainer}>
        {item.status === 'Pending' ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]} 
              onPress={() => handleAccept(item.id)}
            >
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]} 
              onPress={() => handleReject(item.id)}
            >
              <MaterialCommunityIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.statusText}>{item.status}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
      <FlatList
        data={bookingsData}
        renderItem={renderBookingItem}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 14,
    color: '#555',
  },
  bookingCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  bookingService: {
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
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default BookingsList;
