import { View, Text, StyleSheet } from "react-native";

export default function EditServiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Service</Text>
      {/* Add your edit form here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
