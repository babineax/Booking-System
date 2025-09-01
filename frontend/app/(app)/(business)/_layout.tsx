// File: frontend/app/(business)/_layout.tsx
// This is the correct layout file for the business group.

import { Stack } from 'expo-router';

export default function BusinessLayout() {
  return (
    <Stack>
      {/* This screen is for the main dashboard. The `name="index"` is implicit,
        but it's good practice to define the first screen.
      */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, // We'll use a custom header in the index.tsx file
          title: 'Business Dashboard',
        }} 
      />
      {/* This screen is for the "Add Client" page. 
        Expo Router automatically finds and creates a route for "add-client.tsx".
      */}
      <Stack.Screen
        name="add-client"
        options={{
          headerShown: true,
          title: 'Add Client',
        }}
      />
    </Stack>
  );
}
