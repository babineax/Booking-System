// frontend/app/(app)/SeedingPage.tsx
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase"; // <-- use client Firebase config

// Example seed data (keep small in frontend)
const usersData = [
  { username: "admin", email: "admin@bookingsystem.com", role: "admin" },
  { username: "sarah", email: "sarah@bookingsystem.com", role: "staff" },
  { username: "john", email: "customer@example.com", role: "customer" },
];

const servicesData = [
  { name: "Men's Haircut", duration: 30, price: 25 },
  { name: "Women's Haircut", duration: 45, price: 35 },
  { name: "Hair Coloring", duration: 120, price: 80 },
];

export default function SeedingPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<{
    users: number;
    services: number;
  } | null>(null);

  const showError = (err: any) => {
    console.error("❌ Seeding error:", err);
    Alert.alert("Error", err.message || "Unknown error occurred");
  };

  const seedUsers = async () => {
    try {
      let count = 0;
      for (const user of usersData) {
        await addDoc(collection(db, "users"), user);
        count++;
      }
      return count;
    } catch (err) {
      showError(err);
      return 0;
    }
  };

  const seedServices = async () => {
    try {
      let count = 0;
      for (const service of servicesData) {
        await addDoc(collection(db, "services"), service);
        count++;
      }
      return count;
    } catch (err) {
      showError(err);
      return 0;
    }
  };

  const handleSeedAll = async () => {
    setIsSeeding(true);
    try {
      const userCount = await seedUsers();
      const serviceCount = await seedServices();

      setResults({ users: userCount, services: serviceCount });
      Alert.alert(
        "✅ Success",
        `Seeded ${userCount} users and ${serviceCount} services`
      );
    } catch (err) {
      showError(err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔥 Firebase Database Seeder</Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Warning:</Text>
          <Text style={styles.warningText}>
            This will create real data in your Firebase project. Make sure
            you’re connected to your development environment.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What will be created:</Text>
          <Text style={styles.infoText}>👥 3 Users</Text>
          <Text style={styles.infoText}>✂️ 3 Services</Text>
        </View>

        <TouchableOpacity
          onPress={handleSeedAll}
          disabled={isSeeding}
          style={[
            styles.button,
            { backgroundColor: isSeeding ? "#aaa" : "#28a745" },
          ]}
        >
          <Text style={styles.buttonText}>
            {isSeeding ? "🌱 Seeding..." : "🚀 Seed Database"}
          </Text>
        </TouchableOpacity>

        {results && (
          <View
            style={[
              styles.resultBox,
              { backgroundColor: "#d4edda", borderColor: "#c3e6cb" },
            ]}
          >
            <Text style={styles.resultText}>
              ✅ Created {results.users} users and {results.services} services
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffeaa7",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningTitle: { color: "#856404", fontWeight: "bold" },
  warningText: { color: "#856404", fontSize: 14 },
  infoBox: { marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  infoText: { fontSize: 14, color: "#666", marginLeft: 10 },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  resultBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
  },
  resultText: { color: "#155724", fontWeight: "bold" },
});
