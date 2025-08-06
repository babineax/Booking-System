import { StyleSheet, Text, View } from "react-native";

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
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.activeStepNumber,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                isActive && styles.activeStepLabel,
                isCompleted && styles.completedStepLabel,
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
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
  },
  stepIndicator: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  activeCircle: {
    backgroundColor: "#2563eb",
    borderColor: "#1d4ed8",
  },
  completedCircle: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeStepNumber: {
    color: "#ffffff",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginLeft: 8,
  },
  completedLine: {
    backgroundColor: "#10b981",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  activeStepLabel: {
    color: "#2563eb",
    fontWeight: "600",
  },
  completedStepLabel: {
    color: "#10b981",
    fontWeight: "600",
  },
});

export default BookingStepper;
