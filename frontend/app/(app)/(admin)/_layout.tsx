import { Tabs } from "expo-router";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import React from "react";

// Helper components for tab bar icons
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

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Core admin dashboard tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ color }) => <MaterialTabBarIcon name="account-group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => <MaterialTabBarIcon name="calendar-month" color={color} />,
        }}
      />
      
      {/* Merged tabs from the old (app) layout */}
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

      {/* Hidden screens, accessible via navigation actions only */}
      <Tabs.Screen name="[serviceId]" options={{ href: null }} />
      <Tabs.Screen name="create-booking" options={{ href: null }} />
    </Tabs>
  );
}