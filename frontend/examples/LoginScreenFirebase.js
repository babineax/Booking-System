
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../src/redux/apis/firebaseUsersApiSlice';
import { setCredentials } from '../src/redux/features/auth/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.error || 'An error occurred');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />
      
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#007bff' }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
