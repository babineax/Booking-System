import { View, Text, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";

type Props = {
  date: string;
  setDate: (date: string) => void;
  onNext: () => void;
};

const DatePicker = ({ date, setDate, onNext }: Props) => {
  // Format the selected date for the calendar's `markedDates` prop
  const markedDate = date
    ? {
        [format(new Date(date), "yyyy-MM-dd")]: {
          selected: true,
          selectedColor: "#1d4ed8", // Corresponds to Tailwind's 'blue-600'
        },
      }
    : {};

  return (
    <View className="gap-4">
      <Text className="text-xl font-bold text-blue-800">Pick a Date</Text>

      <Calendar
        // This marks the selected day in the calendar UI
        markedDates={markedDate}
        // This is the function that gets called when a day is pressed
        onDayPress={(day) => {
          setDate(new Date(day.dateString).toDateString());
        }}
        // Optional: you can disable past dates
        minDate={new Date()}
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