import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useGetStaff } from "../features/users/hooks/useGetStaff";

export default function StaffSelector({ serviceId, staff, setStaff, onNext, onBack }) {
  const { data: allStaff = [], isLoading } = useGetStaff();

  const qualifiedStaff = allStaff.filter(member => 
    member.serviceIds?.includes(serviceId)
  );

  return (
    <View>
      <Text style={styles.label}>Select Service Provider</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#3182ce" />
      ) : qualifiedStaff.length > 0 ? (
        qualifiedStaff.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.item, staff === user.id && styles.selected]}
            onPress={() => setStaff(user.id)}
          >
            <Text>
              {user.firstName} {user.lastName}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noStaffText}>No staff members are available for this service.</Text>
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
  noStaffText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#718096',
  }
});
