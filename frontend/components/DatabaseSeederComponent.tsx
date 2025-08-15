// import { useState } from "react";
// import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { seedDatabase, seedUsers } from "../firebase/admin/scripts/seedData";

// interface SeedingResult {
//   success: boolean;
//   users?: any[];
//   services?: any[];
//   error?: string;
// }

// const DatabaseSeederComponent = () => {
//   const [isSeeding, setIsSeeding] = useState(false);
//   const [seedingResults, setSeedingResults] = useState<SeedingResult | null>(
//     null
//   );

//   const handleFullSeed = async () => {
//     setIsSeeding(true);
//     setSeedingResults(null);

//     try {
//       console.log("Starting database seeding...");
//       const result = await seedDatabase();

//       setSeedingResults(result);

//       if (result.success) {
//         Alert.alert(
//           "Success!",
//           `Database seeded successfully!\nUsers: ${
//             result.users?.length || 0
//           }\nServices: ${result.services?.length || 0}`
//         );
//       } else {
//         Alert.alert("Error", result.error);
//       }
//     } catch (error: any) {
//       console.error("Seeding error:", error);
//       Alert.alert("Error", error.message);
//       setSeedingResults({ success: false, error: error.message });
//     } finally {
//       setIsSeeding(false);
//     }
//   };

//   const handleSeedUsers = async () => {
//     setIsSeeding(true);
//     try {
//       const users = await seedUsers();
//       Alert.alert("Success!", `Created ${users.length} users`);
//       console.log("Created users:", users);
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setIsSeeding(false);
//     }
//   };

//   return (
//     <ScrollView style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
//       <View
//         style={{
//           backgroundColor: "white",
//           padding: 20,
//           borderRadius: 10,
//           marginBottom: 20,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.1,
//           shadowRadius: 4,
//           elevation: 3,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: "bold",
//             marginBottom: 15,
//             textAlign: "center",
//           }}
//         >
//           Database Seeder
//         </Text>

//         <Text style={{ marginBottom: 15, color: "#666", textAlign: "center" }}>
//           Use these buttons to populate your Firestore database with initial
//           data
//         </Text>

//         <TouchableOpacity
//           onPress={handleFullSeed}
//           disabled={isSeeding}
//           style={{
//             backgroundColor: isSeeding ? "#ccc" : "#28a745",
//             padding: 15,
//             borderRadius: 8,
//             marginBottom: 10,
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
//             {isSeeding ? "Seeding Database..." : "Seed Full Database"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleSeedUsers}
//           disabled={isSeeding}
//           style={{
//             backgroundColor: isSeeding ? "#ccc" : "#007bff",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 8,
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: "white", fontWeight: "bold" }}>
//             Seed Users Only
//           </Text>
//         </TouchableOpacity>

//         <View
//           style={{
//             backgroundColor: "#fff3cd",
//             padding: 12,
//             borderRadius: 8,
//             marginTop: 15,
//             borderWidth: 1,
//             borderColor: "#ffeaa7",
//           }}
//         >
//           <Text style={{ color: "#856404", fontSize: 14, fontWeight: "bold" }}>
//             ⚠️ Warning:
//           </Text>
//           <Text style={{ color: "#856404", fontSize: 12, marginTop: 5 }}>
//             This will create test data in your Firestore database. Make sure
//             you're connected to the correct Firebase project.
//           </Text>
//         </View>

//         {seedingResults && (
//           <View
//             style={{
//               backgroundColor: seedingResults.success ? "#d4edda" : "#f8d7da",
//               padding: 12,
//               borderRadius: 8,
//               marginTop: 15,
//               borderWidth: 1,
//               borderColor: seedingResults.success ? "#c3e6cb" : "#f5c6cb",
//             }}
//           >
//             <Text
//               style={{
//                 color: seedingResults.success ? "#155724" : "#721c24",
//                 fontWeight: "bold",
//                 marginBottom: 5,
//               }}
//             >
//               {seedingResults.success ? "✅ Success!" : "❌ Error"}
//             </Text>
//             <Text
//               style={{
//                 color: seedingResults.success ? "#155724" : "#721c24",
//                 fontSize: 12,
//               }}
//             >
//               {seedingResults.success
//                 ? `Created ${seedingResults.users?.length || 0} users and ${
//                     seedingResults.services?.length || 0
//                   } services`
//                 : seedingResults.error}
//             </Text>
//           </View>
//         )}

//         <View style={{ marginTop: 20 }}>
//           <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
//             Data to be created:
//           </Text>
//           <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
//             👥 3 Users (1 admin, 1 staff, 1 customer)
//           </Text>
//           <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
//             ✂️ 5 Services (haircuts, coloring, styling, treatments)
//           </Text>
//           <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
//             🕒 7 Business hour schedules for staff
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default DatabaseSeederComponent;
