"use client";
import { useGetServiceByIdQuery } from "@/src/redux/apis/firebaseServicesApiSlice";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();

  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useGetServiceByIdQuery(serviceId as string, {
    skip: !serviceId,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "#6b7280", fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    console.error("Failed to fetch service:", error);
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "red", fontSize: 16 }}>
          Failed to load service.
        </Text>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text style={{ color: "#374151", fontSize: 16 }}>
          No service found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
            marginTop: 16,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
            {service.name}
          </Text>
          {service.description && (
            <Text style={{ marginTop: 8, color: "#4b5563", fontSize: 15 }}>
              {service.description}
            </Text>
          )}
          {service.duration && (
            <Text style={{ marginTop: 16, fontSize: 16, color: "#374151" }}>
              ⏱ {service.duration} minutes
            </Text>
          )}
          {service.price && (
            <Text
              style={{
                marginTop: 8,
                fontSize: 20,
                fontWeight: "700",
                color: "#2563eb",
              }}
            >
              ${service.price}
            </Text>
          )}

          {/* ✅ Staff Members */}
          {service.staffMembers?.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}
              >
                Staff Available:
              </Text>
              {service.staffMembers.map((staff: any, index: number) => (
                <Text
                  key={index}
                  style={{ color: "#374151", marginTop: 4, fontSize: 15 }}
                >
                  👤 {staff.name || staff}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
