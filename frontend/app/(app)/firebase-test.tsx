import { ScrollView, Text, View } from "react-native";
import FirebaseTestComponent from "../../components/FirebaseTestComponent";

export default function FirebaseTestScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Firebase Migration Test
        </Text>

        <FirebaseTestComponent />

        <View
          style={{
            backgroundColor: "white",
            padding: 15,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Test Instructions:
          </Text>
          <Text style={{ marginBottom: 5 }}>
            1. Click &ldquo;Test Firebase Connection&rdquo; to verify Firebase
            setup
          </Text>
          <Text style={{ marginBottom: 5 }}>
            2. Check console logs for detailed Firebase information
          </Text>
          <Text style={{ marginBottom: 5 }}>
            3. Test user registration (will create a test user)
          </Text>
          <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>
            Make sure your Firebase project is configured and Firestore is
            enabled.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
