import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";

type Service = {
  id: string;
  name: string;
  description?: string;
  duration?: number; // in minutes
  price?: number;
};

type Props = {
  service: string;
  setService: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const ServiceSelector = ({ service, setService, onNext, onBack }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        // Replace this mock with a real API call
        // const res = await fetch("/api/services");
        // const data = await res.json();
        // setServices(data);

        const mockData: Service[] = [
          { id: "1", name: "Haircut", price: 500 },
          { id: "2", name: "Shave", price: 300 },
          { id: "3", name: "Massage", price: 800 },
        ];

        setTimeout(() => {
          setServices(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <View className="gap-4">
      <Text className="text-xl font-bold text-blue-800">Choose a Service</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = service === item.id;

            return (
              <TouchableOpacity
                onPress={() => setService(item.id)}
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
        <TouchableOpacity
          onPress={onBack}
          className="flex-1 mr-2 py-3 bg-gray-300 rounded-lg"
        >
          <Text className="text-center text-black font-medium">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!service}
          onPress={onNext}
          className={`flex-1 ml-2 py-3 rounded-lg ${
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
