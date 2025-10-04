import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function AdminTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
