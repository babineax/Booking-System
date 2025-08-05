import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";

type Props = {
  date: string;
  time: string;
  setTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const TimeSlotSelector = ({ date, time, setTime, onNext, onBack }: Props) => {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);

        // Replace with real API call later
        // Example: `/api/bookings/available-slots?date=${date}`
        const mockSlots = [
          "09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM",
        ];

        // Simulate network delay
        setTimeout(() => {
          setSlots(mockSlots);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  return (
    <View className="gap-4">
      <Text className="text-xl font-bold text-blue-800">Pick a Time</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const isSelected = time === item;

            return (
              <TouchableOpacity
                onPress={() => setTime(item)}
                className={`px-4 py-3 rounded-lg mb-3 w-[48%] border ${
                  isSelected ? "bg-blue-600 border-blue-700" : "bg-white border-gray-300"
                }`}
              >
                <Text className={`text-center ${isSelected ? "text-white" : "text-black"}`}>
                  {item}
                </Text>
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
          disabled={!time}
          onPress={onNext}
          className={`flex-1 ml-2 py-3 rounded-lg ${
            time ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <Text className="text-center text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimeSlotSelector;
