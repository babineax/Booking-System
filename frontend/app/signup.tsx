import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={20} color="#00BCD4" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="phone" size={20} color="#00BCD4" style={styles.icon} />
        <TextInput
          placeholder="Mobile Number"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#00BCD4" style={styles.icon} />
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.termsContainer}>
      <Checkbox
    status={agreeTerms ? 'checked' : 'unchecked'}
    onPress={() => setAgreeTerms(!agreeTerms)}
    color="#00BCD4"
  />
  <Text style={styles.termsText}>
    I accept all the <Text style={styles.boldText}>Terms & Conditions</Text>
  </Text>
      </View>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialContainer}>
        <Image
          source={require('../assets/images/Google.png')}
          style={styles.socialIcon}
        />
        <Image
          source={require('../assets/images/Facebook.png')}
          style={styles.socialIcon}
        />
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
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
      height: 40,
      fontSize: 14,
      color: '#000',
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      alignSelf: 'center',
      justifyContent:'center',
      marginLeft: 30,
    },
    termsText: {
      marginLeft: 10,
      fontSize: 14,
      color: '#000',
    },
    boldText: {
      fontWeight: 'bold',
    },
    signupButton: {
      backgroundColor: '#00BCD4',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 80,
      marginBottom: 20,
    },
    signupText: {
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
      justifyContent: 'center',
    },
    socialIcon: {
      width: 40,
      height: 40,
      marginHorizontal: 10,
    },
  });
  