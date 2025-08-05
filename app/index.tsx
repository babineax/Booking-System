import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome</Text>
      <Button title="Browse Services" onPress={() => router.push("../screens/ServiceListScreen")} />
    </View>
  );
}
