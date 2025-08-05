import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";

// Updated type to match the backend model
type Service = {
  _id: string; // The backend uses _id for the unique ID
  name: string;
  description?: string;
  duration?: number; // in minutes
  price?: number;
};

type Props = {
  service: string;
  setService: (id: string) => void;
  onNext: () => void;
  onBack?: () => void;
};

const ServiceSelector = ({ service, setService, onNext, onBack }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        // API INTEGRATION: Fetch data from the backend API
        const res = await fetch("http://localhost:5000/api/services");

        if (!res.ok) {
          throw new Error(`Failed to fetch services: ${res.status}`);
        }

        const data = await res.json();
        setServices(data);

      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <View className="flex-1 gap-4">
      <Text className="text-xl font-bold text-blue-800">Choose a Service</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          style={{ flex: 1 }} // Allows the FlatList to take up space and scroll
          renderItem={({ item }) => {
            const isSelected = service === item._id;

            return (
              <TouchableOpacity
                onPress={() => setService(item._id)}
                className={`p-4 rounded-lg mb-3 border ${
                  isSelected ? "bg-blue-600 border-blue-700" : "bg-white border-gray-300"
                }`}
              >
                <Text className={`text-lg ${isSelected ? "text-white" : "text-black"}`}>
                  {item.name}
                </Text>
                {item.price && (
                  <Text className={`text-sm ${isSelected ? "text-white" : "text-gray-600"}`}>
                    KES {item.price}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View className="flex-row justify-between mt-4">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className="flex-1 mr-2 py-3 bg-gray-300 rounded-lg"
          >
            <Text className="text-center text-black font-medium">Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={!service}
          onPress={onNext}
          className={`flex-1 ${onBack ? "ml-2" : ""} py-3 rounded-lg ${
            service ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <Text className="text-center text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceSelector;