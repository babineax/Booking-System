import { format } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Date</Text>

      <Calendar
        // This marks the selected day in the calendar UI
        markedDates={markedDate}
        // This is the function that gets called when a day is pressed
        onDayPress={(day) => {
          setDate(new Date(day.dateString).toDateString());
        }}
        // Optional: you can disable past dates
        minDate={format(new Date(), "yyyy-MM-dd")}
      />

      <TouchableOpacity
        disabled={!date}
        onPress={onNext}
        style={[
          styles.button,
          date ? styles.enabledButton : styles.disabledButton
        ]}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#2563eb',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default DatePicker;