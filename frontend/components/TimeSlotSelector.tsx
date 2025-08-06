import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Time</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const isSelected = time === item;

            return (
              <TouchableOpacity
                onPress={() => setTime(item)}
                style={[
                  styles.timeSlot,
                  isSelected ? styles.selectedSlot : styles.unselectedSlot
                ]}
              >
                <Text style={[
                  styles.timeText,
                  isSelected ? styles.selectedText : styles.unselectedText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.button, styles.backButton]}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!time}
          onPress={onNext}
          style={[
            styles.button,
            styles.nextButton,
            time ? styles.enabledNextButton : styles.disabledNextButton
          ]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  row: {
    justifyContent: 'space-between',
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  unselectedSlot: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  timeText: {
    textAlign: 'center',
  },
  selectedText: {
    color: '#ffffff',
  },
  unselectedText: {
    color: '#000000',
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
    backgroundColor: '#d1d5db',
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  enabledNextButton: {
    backgroundColor: '#2563eb',
  },
  disabledNextButton: {
    backgroundColor: '#d1d5db',
  },
  backButtonText: {
    color: '#000000',
    fontWeight: '500',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default TimeSlotSelector;
