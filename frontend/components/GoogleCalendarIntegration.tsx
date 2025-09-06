import { getFunctions, httpsCallable } from 'firebase/functions';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Button, View, Text } from 'react-native';
import { useState } from 'react';

const functions = getFunctions();
const getGoogleAuthUrlCallable = httpsCallable(functions, 'getGoogleAuthUrl');

type GoogleCalendarIntegrationProps = {
  isConected: boolean;
};

const GoogleCalendarIntegration = ({ isConected }: GoogleCalendarIntegrationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { data } = await getGoogleAuthUrlCallable();
      const { url } = data as { url: string };
      
      if (url) {
        await WebBrowser.openAuthSessionAsync(url);
        // After the browser flow is complete, you might want to refetch the user's
        // connection status to update the UI.
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to start the connection process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      {isConected ? (
        <Text>Google Calendar is connected.</Text>
      ) : (
        <Button
          title={isLoading ? 'Connecting...' : 'Connect to Google Calendar'}
          onPress={handleConnect}
          disabled={isLoading}
        />
      )}
    </View>
  );
};

export default GoogleCalendarIntegration;