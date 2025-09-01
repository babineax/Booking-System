import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      {/* The following routes are hidden from the tab bar */}
      <Tabs.Screen name="[serviceId]" options={{ href: null }} />
      <Tabs.Screen name="(admin)" options={{ href: null }} />
      <Tabs.Screen name="(business)" options={{ href: null }} />
      <Tabs.Screen name="(staff)" options={{ href: null }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="firebase-test" options={{ href: null }} />
      <Tabs.Screen name="seed" options={{ href: null }} />
    </Tabs>
  );
}
