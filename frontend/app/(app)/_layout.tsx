import { Tabs } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function MaterialTabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialTabBarIcon name="account-circle" color={color} />
          ),
        }}
      />

      {/* The following routes are hidden from the tab bar as they are part of navigation flows */}
      <Tabs.Screen
        name="[serviceId]"
        options={{ href: null, title: "Service Details" }}
      />
      <Tabs.Screen
        name="booking"
        options={{ href: null, title: "Book Appointment" }}
      />

      {/* Role-specific routes are also hidden and accessed from the Profile screen */}
      <Tabs.Screen name="(admin)" options={{ href: null }} />
      <Tabs.Screen name="(business)" options={{ href: null }} />
      <Tabs.Screen name="(staff)" options={{ href: null }} />

      {/* Utility/dev routes are hidden */}
      <Tabs.Screen name="firebase-test" options={{ href: null }} />
      <Tabs.Screen name="seed" options={{ href: null }} />
    </Tabs>
  );
}
