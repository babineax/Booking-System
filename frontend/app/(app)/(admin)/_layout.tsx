import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="clients" options={{ title: "Clients" }} />
      <Stack.Screen name="staff" options={{ title: "Staff" }} />
      <Stack.Screen name="bookings" options={{ title: "Bookings" }} />
      <Stack.Screen
        name="create-booking"
        options={{ title: "Create Booking" }}
      />
      <Stack.Screen name="dev-tools" options={{ title: "Developer Tools" }} />
    </Stack>
  );
}
