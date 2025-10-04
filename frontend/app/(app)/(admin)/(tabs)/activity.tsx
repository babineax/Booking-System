import { View, Text, StyleSheet } from "react-native";

export default function AdminActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <Text style={styles.placeholder}>
        Recent booking and client activities will be displayed here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  placeholder: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
