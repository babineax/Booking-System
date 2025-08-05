import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CheckCircle2 } from "lucide-react-native";

type Props = {
  date: string;
  time: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  onConfirm: () => void;
  onEdit: () => void;
};

const BookingConfirmation = ({
  date,
  time,
  service,
  onConfirm,
  onEdit,
}: Props) => {
  return (
    <ScrollView className="p-4 flex-1 bg-white">
      <View className="items-center mb-6">
        <CheckCircle2 size={60} color="#2563EB" />
        <Text className="text-xl font-semibold text-blue-800 mt-4">
          Confirm Your Booking
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Review your booking details before proceeding.
        </Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 space-y-2">
        <Text className="text-lg font-medium text-gray-800">Service</Text>
        <Text className="text-base text-gray-700">{service?.name}</Text>
        <Text className="text-sm text-gray-600">
          Duration: {service?.duration} mins
        </Text>
        <Text className="text-sm text-gray-600">
          Price: KES {service?.price.toLocaleString()}
        </Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-6 space-y-2">
        <Text className="text-lg font-medium text-gray-800">Date & Time</Text>
        <Text className="text-base text-gray-700">{date}</Text>
        <Text className="text-base text-gray-700">{time}</Text>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={onEdit}
          className="bg-gray-300 py-3 px-6 rounded-xl"
        >
          <Text className="text-gray-700 font-medium">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          className="bg-blue-700 py-3 px-6 rounded-xl"
        >
          <Text className="text-white font-medium">Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookingConfirmation;
