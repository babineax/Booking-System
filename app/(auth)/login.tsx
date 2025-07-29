import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { InputField } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-center">
                Sign in to your account to continue
              </Text>
            </View>

            <View className="space-y-4">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
              />

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`py-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-4">
                <Link href="/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-600 font-medium">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <View className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-center text-gray-600 mb-4">
                Don't have an account?
              </Text>
              <Link href="/register" asChild>
                <TouchableOpacity className="py-3 border border-blue-600 rounded-xl">
                  <Text className="text-blue-600 text-center font-semibold">
                    Create Account
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
