import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../src/redux/apis/usersApiSlice';
import { logout as logoutAction } from '../../src/redux/features/auth/authSlice';

// Define the type for the user object
type User = {
  name: string;
  email: string;
  role: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Use an inline selector to access the user object directly from the store
  const user = useSelector((state: any) => state.auth.user) as User | null;

  // This hook call is correct without arguments
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Pass an empty object to the mutation function to satisfy the type checker
      await logoutApi({}).unwrap();
      dispatch(logoutAction());
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {user?.name || 'Admin'}!</Text>
      <Text style={styles.subtitle}>Welcome to the Admin Dashboard.</Text>
      <View style={styles.content}>
        <Text style={styles.info}>Email: {user?.email}</Text>
        <Text style={styles.info}>Role: {user?.role}</Text>
      </View>
      <Link href="/(app)" asChild>
        <Button title="Go to User Dashboard" />
      </Link>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#006699',
    marginBottom: 20,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AdminDashboard;
