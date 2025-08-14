import { StyleSheet, View } from 'react-native';
import AuthDebugComponent from '../components/AuthDebugComponent';

export default function AuthDebugScreen() {
  return (
    <View style={styles.container}>
      <AuthDebugComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
