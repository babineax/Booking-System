import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";

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

        const mockSlots = [
          "09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM",
        ];

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

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = time === item;

    return (
      <TouchableOpacity
        onPress={() => setTime(item)}
        style={[
          styles.slotButton,
          isSelected ? styles.slotButtonSelected : styles.slotButtonDefault,
        ]}
      >
        <Text
          style={[
            styles.slotText,
            isSelected ? styles.slotTextSelected : styles.slotTextDefault,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

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
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
          style={[styles.button, styles.nextButton, !time && styles.nextButtonDisabled]}
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
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  listContent: {
    paddingVertical: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  slotButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "48%",
    borderWidth: 1,
  },
  slotButtonDefault: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
  },
  slotButtonSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#1D4ED8",
  },
  slotText: {
    textAlign: "center",
  },
  slotTextDefault: {
    color: "#000",
  },
  slotTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    marginRight: 8,
    backgroundColor: "#D1D5DB",
  },
  backButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  nextButton: {
    marginLeft: 8,
    backgroundColor: "#2563EB",
  },
  nextButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TimeSlotSelector;