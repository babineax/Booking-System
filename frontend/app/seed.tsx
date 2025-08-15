import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { seedDatabase, seedUsers } from "../firebase/utils/seedData";

interface SeedingResult {
  success: boolean;
  users?: any[];
  services?: any[];
  error?: string;
}

export default function SeedingPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResults, setSeedingResults] = useState<SeedingResult | null>(
    null
  );

  const handleFullSeed = async () => {
    setIsSeeding(true);
    setSeedingResults(null);

    try {
      console.log("🌱 Starting database seeding...");
      const result = await seedDatabase();

      setSeedingResults(result);

      if (result.success) {
        Alert.alert(
          "Success!",
          `Database seeded successfully!\nUsers: ${
            result.users?.length || 0
          }\nServices: ${result.services?.length || 0}`
        );
        console.log(
          "✅ Users created:",
          result.users?.map((u) => `${u.email} (${u.role})`)
        );
      } else {
        Alert.alert("Error", result.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("❌ Seeding error:", error);
      Alert.alert("Error", error.message || "Unknown error occurred");
      setSeedingResults({
        success: false,
        error: error.message || "Unknown error occurred",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedUsers = async () => {
    setIsSeeding(true);
    try {
      console.log("🌱 Starting user seeding...");
      const users = await seedUsers();
      Alert.alert("Success!", `Created ${users.length} users`);
      console.log(
        "✅ Created users:",
        users.map((u) => `${u.email} (${u.role})`)
      );
    } catch (error: any) {
      console.error("❌ User seeding error:", error);
      Alert.alert("Error", error.message || "Unknown error occurred");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: "white",
            padding: 25,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
              color: "#333",
            }}
          >
            🔥 Firebase Database Seeder
          </Text>

          <View
            style={{
              backgroundColor: "#fff3cd",
              padding: 15,
              borderRadius: 8,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#ffeaa7",
            }}
          >
            <Text
              style={{ color: "#856404", fontWeight: "bold", marginBottom: 5 }}
            >
              ⚠️ Warning:
            </Text>
            <Text style={{ color: "#856404", fontSize: 14 }}>
              This will create real data in your Firebase project. Make sure
              you're connected to your development environment.
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#333",
              }}
            >
              What will be created:
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              👥 <Text style={{ fontWeight: "bold" }}>3 Users:</Text>
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#888",
                marginLeft: 20,
                marginBottom: 3,
              }}
            >
              • Admin: admin@bookingsystem.com / admin123
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#888",
                marginLeft: 20,
                marginBottom: 3,
              }}
            >
              • Staff: sarah@bookingsystem.com / stylist123
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#888",
                marginLeft: 20,
                marginBottom: 8,
              }}
            >
              • Customer: customer@example.com / customer123
            </Text>

            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              ✂️ <Text style={{ fontWeight: "bold" }}>5 Services:</Text>{" "}
              Haircuts, coloring, styling, treatments
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              🕒 <Text style={{ fontWeight: "bold" }}>Business Hours:</Text>{" "}
              Standard schedules for staff
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleFullSeed}
            disabled={isSeeding}
            style={{
              backgroundColor: isSeeding ? "#ccc" : "#28a745",
              padding: 15,
              borderRadius: 8,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              {isSeeding
                ? "🌱 Seeding Database..."
                : "🚀 Seed Complete Database"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSeedUsers}
            disabled={isSeeding}
            style={{
              backgroundColor: isSeeding ? "#ccc" : "#007bff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              👥 Seed Users Only
            </Text>
          </TouchableOpacity>

          {seedingResults && (
            <View
              style={{
                backgroundColor: seedingResults.success ? "#d4edda" : "#f8d7da",
                padding: 15,
                borderRadius: 8,
                marginTop: 10,
                borderWidth: 1,
                borderColor: seedingResults.success ? "#c3e6cb" : "#f5c6cb",
              }}
            >
              <Text
                style={{
                  color: seedingResults.success ? "#155724" : "#721c24",
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
              >
                {seedingResults.success ? "✅ Success!" : "❌ Error"}
              </Text>
              <Text
                style={{
                  color: seedingResults.success ? "#155724" : "#721c24",
                  fontSize: 14,
                }}
              >
                {seedingResults.success
                  ? `Created ${seedingResults.users?.length || 0} users and ${
                      seedingResults.services?.length || 0
                    } services`
                  : seedingResults.error}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
