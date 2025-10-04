import { View, Text, StyleSheet } from "react-native";

export default function AdminStatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Statistics</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartText}>Chart will be displayed here</Text>
      </View>
      <Text style={styles.placeholder}>
        Detailed statistics and data visualizations will be available here.
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
    marginBottom: 24,
    color: "#1F2937",
  },
  chartPlaceholder: {
    width: "80%",
    height: 200,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 24,
  },
  chartText: {
    color: "#6B7280",
    fontSize: 16,
  },
  placeholder: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
