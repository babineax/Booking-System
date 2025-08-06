import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

// Updated type to match the backend model
type Service = {
  _id: string; // The backend uses _id for the unique ID
  name: string;
  description?: string;
  duration?: number; // in minutes
  price?: number;
};

// --- DUMMY DATA FOR TESTING WITHOUT BACKEND ---
const DUMMY_SERVICES: Service[] = [
  { _id: '1', name: 'Haircut', description: 'Classic haircut and style', duration: 30, price: 3000 },
  { _id: '2', name: 'Beard Trim', description: 'Professional beard trimming and shaping', duration: 15, price: 1500 },
  { _id: '3', name: 'Manicure & Pedicure', description: 'Full manicure and pedicure service', duration: 60, price: 5000 },
  { _id: '4', name: 'Hair Styling', description: 'Advanced hair styling for events', duration: 45, price: 4000 },
];
// ---------------------------------------------

type Props = {
  service: string;
  setService: (id: string) => void;
  onNext: () => void;
  onBack?: () => void;
};

const ServiceSelector = ({ service, setService, onNext, onBack }: Props) => {
  // We use useState with DUMMY_SERVICES to initialize the data.
  // This removes the need for useEffect and the loading state.
  const [services, setServices] = useState<Service[]>(DUMMY_SERVICES);

  /*
  // The original API call is commented out.
  // Uncomment this code and remove the dummy data when you are ready to connect to the backend again.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
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
  */

  return (
    <View className="flex-1 gap-4">
      <Text className="text-xl font-bold text-blue-800">Choose a Service</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const isSelected = service === item._id;

          return (
            <TouchableOpacity
              onPress={() => setService(item._id)}
              className={`p-3 rounded-lg mb-2 shadow-sm active:opacity-75 ${
                isSelected
                  ? "bg-blue-600 border border-blue-700"
                  : "bg-white border border-gray-300"
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {item.name}
              </Text>
              {item.price && (
                <Text
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  KES {item.price}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

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