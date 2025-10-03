// File: frontend/app/login.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { authService } from "../../firebase/services/authService";
import { setCredentials } from "../../src/redux/features/auth/authSlice";

const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting login with email:", email.trim());

      const { user, firebaseUser } = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login successful, user:", user);

      // Set credentials in Redux store
      dispatch(
        setCredentials({
          user: user,
          token: await firebaseUser.getIdToken(),
          isAdmin: user.isAdmin,
        })
      );

      console.log("Credentials set, navigating...");

      if (user.role === "admin") {
        router.replace("/(admin)");
      } else if (user.role === "staff") {
        router.replace("/(business)");
      } else {
        router.replace("/(app)");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="email-outline"
          size={20}
          color="#00BCD4"
          style={styles.icon}
        />
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          placeholderTextColor="#ccc"
          underlineColorAndroid="transparent"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={20}
          color="#00BCD4"
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#ccc"
          underlineColorAndroid="transparent"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up Prompt */}
      <Text style={styles.signupPrompt}>
        Don&apos;t Have an Account?{" "}
        <Text
          style={styles.signupText}
          onPress={() => router.push("/register")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotPassword: {
    color: "#00BCD4",
    fontSize: 14,
    marginBottom: 30,
    textAlign: "right",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    color: "#666",
    fontSize: 16,
    marginVertical: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 120,
    marginBottom: 30,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signupPrompt: {
    fontSize: 16,
    color: "#666",
  },
  signupText: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
});

export default LoginScreen;
