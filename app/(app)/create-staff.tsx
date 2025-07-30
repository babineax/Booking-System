import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { InputField } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

export default function CreateStaffScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'staff' as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const { createStaffAccount, userProfile } = useAuth();

  // Only admin users should access this screen
  if (userProfile?.role !== 'admin') {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-xl text-red-600 text-center">
          Access Denied: Admin privileges required
        </Text>
      </View>
    );
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return 'Please fill in all required fields';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  };

  const handleCreateStaff = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      setLoading(true);
      await createStaffAccount(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        role: formData.role
      });
      
      Alert.alert(
        'Staff Account Created',
        `${formData.role} account created successfully for ${formData.firstName} ${formData.lastName}`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Account Creation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-gray-50"
      >
        <View className="flex-1 px-6 py-12">
          <View className="bg-white rounded-2xl shadow-lg p-8">
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Create Staff Account
              </Text>
              <Text className="text-gray-600 text-center">
                Create a new staff or admin account
              </Text>
            </View>

            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <InputField
                    label="First Name"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder="First name"
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    label="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder="Last name"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <InputField
                label="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />

              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Role
                </Text>
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={() => handleInputChange('role', 'staff')}
                    className={`flex-1 py-3 px-4 rounded-lg border ${
                      formData.role === 'staff' 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      formData.role === 'staff' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Staff
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleInputChange('role', 'admin')}
                    className={`flex-1 py-3 px-4 rounded-lg border ${
                      formData.role === 'admin' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      formData.role === 'admin' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <InputField
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter password"
                secureTextEntry
                autoComplete="new-password"
              />

              <InputField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm password"
                secureTextEntry
                autoComplete="new-password"
              />

              <TouchableOpacity
                onPress={handleCreateStaff}
                disabled={loading}
                className={`py-4 rounded-xl mt-6 ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Creating Account...' : 'Create Staff Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
