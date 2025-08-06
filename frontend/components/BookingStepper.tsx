import React from "react";
import { View, Text, StyleSheet } from "react-native";

const steps = ["Choose Service", "Select Date", "Pick Time", "Confirm"];

type Props = {
  currentStep: number;
};

const BookingStepper = ({ currentStep }: Props) => {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        const stepStyle = isCompleted
          ? styles.stepCompleted
          : isActive
          ? styles.stepActive
          : styles.stepInactive;

        const textStyle = isCompleted
          ? styles.textCompleted
          : isActive
          ? styles.textActive
          : styles.textInactive;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={[styles.stepCircle, stepStyle]}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, textStyle]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: "#2563EB", // Tailwind's blue-600
  },
  stepCompleted: {
    backgroundColor: "#16A34A", // Tailwind's green-600
  },
  stepInactive: {
    backgroundColor: "#D1D5DB", // Tailwind's gray-300
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  textActive: {
    color: "#1D4ED8", // Tailwind's blue-700
    fontWeight: "600",
  },
  textCompleted: {
    color: "#15803D", // Tailwind's green-700
  },
  textInactive: {
    color: "#9CA3AF", // Tailwind's gray-400
  },
});

export default BookingStepper;