import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";
// The previous import for 'DateObject' was incorrect.
// We will define a simple, local type to avoid this error.

type Props = {
  date: string;
  setDate: (date: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const DatePicker = ({ date, setDate, onNext, onBack }: Props) => {
  const markedDate = date
    ? {
        [format(new Date(date), "yyyy-MM-dd")]: {
          selected: true,
          selectedColor: "#1d4ed8",
          selectedTextColor: "#ffffff",
        },
      }
    : {};

  // We define the type of the 'day' object inline to solve the import error.
  const handleDayPress = (day: { dateString: string }) => {
    setDate(new Date(day.dateString).toDateString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Date</Text>
      <Calendar
        markedDates={markedDate}
        onDayPress={handleDayPress}
        minDate={new Date().toISOString().split('T')[0]}
        style={styles.calendar}
        theme={{
          todayTextColor: '#007AFF',
          selectedDayBackgroundColor: '#1d4ed8',
          selectedDayTextColor: '#ffffff',
          arrowColor: '#1d4ed8',
        }}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={onBack} 
          style={[styles.button, styles.backButton]}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!date}
          onPress={onNext}
          style={[styles.button, styles.nextButton, !date && styles.nextButtonDisabled]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  calendar: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    backgroundColor: '#D1D5DB',
  },
  backButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  nextButton: {
    marginLeft: 8,
    backgroundColor: '#1D4ED8',
  },
  nextButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  nextButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default DatePicker;
