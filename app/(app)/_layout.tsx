import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Dashboard',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="create-staff" 
        options={{ 
          title: 'Create Staff Account',
          headerShown: true
        }} 
      />
    </Stack>
  );
}
