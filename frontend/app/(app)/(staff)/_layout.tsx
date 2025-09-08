import { Stack } from "expo-router";

export default function StaffLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Staff Dashboard" }} />
      <Stack.Screen name="add-service" options={{ title: "Add Service" }} />
      <Stack.Screen name="edit-service" options={{ title: "Edit Service" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
