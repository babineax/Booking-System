import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../firebase/providers/AuthProvider';
import { googleCalendarService } from '../firebase/services';

export const GoogleCalendarIntegration = () => {
  const { firebaseUser } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkCalendarConnection();
  }, [firebaseUser]);

  const checkCalendarConnection = async () => {
    if (!firebaseUser) return;

    try {
      const credentials = await googleCalendarService.getStoredCredentials(firebaseUser.uid);
      setIsConnected(!!credentials);
    } catch (err) {
      console.error('Error checking calendar connection:', err);
      setError('Failed to check calendar connection');
    }
  };

  const handleConnectCalendar = async () => {
    try {
      setError(null);
      await googleCalendarService.authorize();
      setIsConnected(true);
    } catch (err: any) {
      console.error('Error connecting to Google Calendar:', err);
      
      
      if (err.message === 'Google OAuth Client ID is not configured') {
        setError('Google Calendar integration is not properly configured');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups for Google Calendar authentication');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Authentication was cancelled');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Authentication window was closed');
      } else {
        setError('Failed to connect to Google Calendar. Please try again.');
      }
    }
  };

  if (!firebaseUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Calendar Integration</Text>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button
        title={isConnected ? "Connected to Google Calendar" : "Connect Google Calendar"}
        onPress={handleConnectCalendar}
        disabled={isConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
