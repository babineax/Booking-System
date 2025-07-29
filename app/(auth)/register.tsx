import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { InputField } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { SignUpData } from '../../types/auth';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleInputChange = (field: keyof SignUpData, value: string) => {
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

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      setLoading(true);
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        role: 'customer'
      });
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
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
        <View className="flex-1 justify-center px-6 py-12">
          <View className="bg-white rounded-2xl shadow-lg p-8">
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </Text>
              <Text className="text-gray-600 text-center">
                Join us to start booking your services
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
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <InputField
                label="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <InputField
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="new-password"
              />

              <InputField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
                autoComplete="new-password"
              />

              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                className={`py-4 rounded-xl mt-6 ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-center text-gray-600 mb-4">
                Already have an account?
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity className="py-3 border border-blue-600 rounded-xl">
                  <Text className="text-blue-600 text-center font-semibold">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
