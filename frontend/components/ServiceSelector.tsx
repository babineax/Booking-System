import { FlatList, Text, TouchableOpacity, View } from "react-native";

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
  services: Service[]; // Add services prop
};

const ServiceSelector = ({ service, setService, onNext, onBack, services }: Props) => {
  // Services are now passed as props from the parent component
  // that handles the Redux query

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