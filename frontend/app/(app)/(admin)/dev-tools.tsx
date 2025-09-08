import { Link } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DevToolsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Tools</Text>
      <Link href="/(app)/firebase-test" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Firebase Test</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(app)/seed" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Seed Database</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1F2937",
  },
  button: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
});
