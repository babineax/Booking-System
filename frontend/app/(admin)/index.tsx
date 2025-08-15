// File: frontend/app/(admin)/index.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../src/redux/apis/firebaseUsersApiSlice';
import { logout as logoutAction } from '../../src/redux/features/auth/authSlice';
import ServicesList from './components/ServicesList';

// Define a type for the Redux state
type RootState = {
  auth: {
    userInfo: {
      name: string;
      email: string;
      role: string;
      firstName: string;
      username: string;
    };
  };
};

// Define a type for a booking object
type Booking = {
  id: string;
  date: string;
  customer: string;
  status: 'Confirmed' | 'Pending';
};

// Placeholder data for the upcoming bookings list
const upcomingBookings: Booking[] = [
  { id: '1', date: '9:00 AM', customer: 'Carol Smith', status: 'Confirmed' },
  { id: '2', date: '11:00 AM', customer: 'Michael Brown', status: 'Confirmed' },
  { id: '3', date: '2:00 PM', customer: 'John Doe', status: 'Pending' },
];

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
      dispatch(logoutAction());
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Type the 'item' parameter as the Booking type
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingRow}>
      <Text style={styles.bookingText}>{item.date}</Text>
      <Text style={styles.bookingText}>{item.customer}</Text>
      <Text style={[styles.bookingText, item.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main content, now a scrollable area for mobile */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Upcoming Bookings Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <View style={styles.bookingHeader}>
            <Text style={[styles.bookingText, styles.bookingHeaderText]}>Date</Text>
            <Text style={[styles.bookingText, styles.bookingHeaderText]}>Customer</Text>
            <Text style={[styles.bookingText, styles.bookingHeaderText]}>Status</Text>
          </View>
          <FlatList
            data={upcomingBookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false} // Disable FlatList scrolling inside ScrollView
          />
        </View>

        {/* Services List */}
        <ServicesList />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Added padding to account for the status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    padding: 20,
  },
  contentSection: {
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
    marginBottom: 15,
    color: '#333',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookingHeaderText: {
    fontWeight: 'bold',
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookingText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  statusConfirmed: {
    color: 'green',
  },
  statusPending: {
    color: 'orange',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logoutIcon: {
    marginRight: 5,
  },
});

export default AdminDashboard;
