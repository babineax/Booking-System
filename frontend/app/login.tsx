import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your navigation stack types
type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Use typed navigation
const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color="#00BCD4" style={styles.icon} />
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          placeholderTextColor="#ccc"
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#00BCD4" style={styles.icon} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#ccc"
          underlineColorAndroid="transparent"
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/images/Google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/images/Facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      {/* Sign Up Prompt */}
      <Text style={styles.signupPrompt}>
        Don’t Have an Account?{' '}
        <Text style={styles.signupText} onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#00BCD4',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '30%',
    height: 45,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 5,
    fontSize: 13,
    color: '#000',
    marginBottom: 0,
    paddingVertical: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#333',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 80,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    color: '#333',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  signupPrompt: {
    color: '#000',
  },
  signupText: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
});
