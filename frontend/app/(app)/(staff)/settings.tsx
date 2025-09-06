import { View, Text, StyleSheet } from 'react-native';
import GoogleCalendarIntegration from '../../../components/GoogleCalendarIntegration';
import { useAuth } from '../../../firebase/providers/AuthProvider'; // Assuming you have a way to get the current user

const StaffSettingsScreen = () => {
  const { user } = useAuth(); // Or your method to get user data

  // Check if the user has connected their Google account
  const isGoogleCalendarConnected = !!user?.googleRefreshToken;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.integrationSection}>
        <Text style={styles.sectionTitle}>Integrations</Text>
        <GoogleCalendarIntegration isConected={isGoogleCalendarConnected} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  integrationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default StaffSettingsScreen;
