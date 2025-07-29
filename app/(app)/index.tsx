import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 py-12">
      <View className="bg-white rounded-2xl shadow-lg p-8">
        <Text className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to Booking System
        </Text>
        
        {userProfile && (
          <View className="mb-8">
            <Text className="text-lg text-gray-700 mb-2">
              Hello, {userProfile.first_name} {userProfile.last_name}!
            </Text>
            <Text className="text-gray-600 mb-2">
              Email: {user?.email}
            </Text>
            <Text className="text-gray-600 mb-2">
              Role: {userProfile.role}
            </Text>
            {userProfile.phone_number && (
              <Text className="text-gray-600 mb-2">
                Phone: {userProfile.phone_number}
              </Text>
            )}
          </View>
        )}

        <View className="space-y-4">
          {userProfile?.role === 'admin' && (
            <View className="bg-red-50 p-4 rounded-xl">
              <Text className="text-red-800 font-semibold mb-2">
                Admin Features
              </Text>
              <Text className="text-red-700 mb-2">
                • Create staff accounts
              </Text>
              <Text className="text-red-700 mb-2">
                • Manage all bookings
              </Text>
              <Text className="text-red-700 mb-4">
                • System administration
              </Text>
              <Link href="/(app)/create-staff" asChild>
                <TouchableOpacity className="bg-red-600 py-3 px-4 rounded-lg">
                  <Text className="text-white text-center font-semibold">
                    Create Staff Account
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}

          {userProfile?.role === 'staff' && (
            <View className="bg-blue-50 p-4 rounded-xl">
              <Text className="text-blue-800 font-semibold mb-2">
                Staff Features
              </Text>
              <Text className="text-blue-700">
                • Manage bookings
              </Text>
              <Text className="text-blue-700">
                • Customer support
              </Text>
            </View>
          )}

          {userProfile?.role === 'customer' && (
            <View className="bg-green-50 p-4 rounded-xl">
              <Text className="text-green-800 font-semibold mb-2">
                Customer Features
              </Text>
              <Text className="text-green-700">
                • Make bookings
              </Text>
              <Text className="text-green-700">
                • View booking history
              </Text>
              <Text className="text-green-700">
                • Manage profile
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="mt-8 py-4 bg-gray-600 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
