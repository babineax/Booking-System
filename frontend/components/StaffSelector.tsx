import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGetUsers } from "../../../features/users/hooks/useGetUsers"; // Assuming you have a hook to get users

export default function StaffSelector({
  staff,
  setStaff,
  onNext,
  onBack,
}) {
  const { data: users = [], isLoading } = useGetUsers({ role: "staff" });

  return (
    <View>
      <Text style={styles.label}>Select Service Provider</Text>
      {isLoading ? (
        <Text>Loading staff...</Text>
      ) : (
        users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.item, staff === user.id && styles.selected]}
            onPress={() => setStaff(user.id)}
          >
            <Text>{user.firstName} {user.lastName}</Text>
          </TouchableOpacity>
        ))
      )}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !staff && styles.disabled]}
          onPress={onNext}
          disabled={!staff}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: "#a0e0a0",
    borderColor: "#0a0",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
});
