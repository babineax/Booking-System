import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { format, addDays } from "date-fns";

type Props = {
  date: string;
  setDate: (date: string) => void;
  onNext: () => void;
};

const DatePicker = ({ date, setDate, onNext }: Props) => {
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  return (
    <View className="gap-4">
      <Text className="text-xl font-bold text-blue-800">Pick a Date</Text>

      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.toDateString()}
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        renderItem={({ item }) => {
          const formatted = format(item, "EEE, MMM d");
          const isSelected = date === item.toDateString();

          return (
            <TouchableOpacity
              onPress={() => setDate(item.toDateString())}
              className={`px-4 py-2 rounded-lg mx-1 border ${
                isSelected ? "bg-blue-600 border-blue-700" : "bg-white border-gray-300"
              }`}
            >
              <Text className={`text-sm ${isSelected ? "text-white" : "text-black"}`}>
                {formatted}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        disabled={!date}
        onPress={onNext}
        className={`w-full py-3 rounded-lg ${
          date ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DatePicker;
