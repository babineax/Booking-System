import { Drawer } from "expo-router/drawer";

export default function AdminLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="clients" options={{ title: "Clients" }} />
      <Drawer.Screen name="staff" options={{ title: "Staff" }} />
      <Drawer.Screen name="bookings" options={{ title: "Bookings" }} />
      <Drawer.Screen name="dev-tools" options={{ title: "Developer Tools" }} />
    </Drawer>
  );
}
