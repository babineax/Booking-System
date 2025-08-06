import { StyleSheet, Text, View } from "react-native";

// FIX 1: Update the steps array to match the new booking flow.
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

        return (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                isCompleted ? styles.completedCircle :
                isActive ? styles.activeCircle : styles.inactiveCircle
              ]}
            >
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                isActive ? styles.activeLabel :
                isCompleted ? styles.completedLabel : styles.inactiveLabel
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#16a34a',
  },
  activeCircle: {
    backgroundColor: '#2563eb',
  },
  inactiveCircle: {
    backgroundColor: '#d1d5db',
  },
  stepNumber: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  completedLabel: {
    color: '#15803d',
  },
  inactiveLabel: {
    color: '#9ca3af',
  },
});

export default BookingStepper;