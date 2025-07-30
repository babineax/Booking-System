import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { InputField } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-2xl shadow-lg p-8">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </Text>
            <Text className="text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {!emailSent ? (
            <View className="space-y-6">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                className={`py-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center py-8">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Text className="text-green-600 text-2xl">✓</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-lg mb-2">
                Email Sent!
              </Text>
              <Text className="text-gray-600 text-center">
                Check your email for password reset instructions
              </Text>
            </View>
          )}

          <View className="mt-8 pt-6 border-t border-gray-200">
            <Text className="text-center text-gray-600 mb-4">
              Remember your password?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity className="py-3 border border-blue-600 rounded-xl">
                <Text className="text-blue-600 text-center font-semibold">
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
