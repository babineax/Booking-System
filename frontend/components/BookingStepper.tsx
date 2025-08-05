import { View, Text } from "react-native";

const steps = ["Select Date", "Pick Time", "Choose Service", "Confirm"];

type Props = {
  currentStep: number;
};

const BookingStepper = ({ currentStep }: Props) => {
  return (
    <View className="flex-row justify-between items-center mb-6 px-2">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <View key={index} className="items-center flex-1">
            <View
              className={`w-8 h-8 rounded-full ${
                isCompleted
                  ? "bg-green-600"
                  : isActive
                  ? "bg-blue-600"
                  : "bg-gray-300"
              } justify-center items-center`}
            >
              <Text className="text-white font-bold text-sm">{index + 1}</Text>
            </View>
            <Text
              className={`text-xs mt-1 text-center ${
                isActive
                  ? "text-blue-700 font-semibold"
                  : isCompleted
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default BookingStepper;
