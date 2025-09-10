import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { QueryProvider } from "../providers/QueryProvider";
import { AuthProvider, useAuth } from "../firebase/providers/AuthProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </QueryProvider>
      <Toast />
    </Provider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth(); // Using the real useAuth hook

  useEffect(() => {
    // Don't redirect until loading is complete
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    // If the user is not signed in and not in the auth group, redirect to login.
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    // If the user is signed in, regardless of role, redirect to the admin group. the bug was here , it was redirecting to app
    else if (isAuthenticated && inAuthGroup) {
      router.replace("/(admin)");
    }
  }, [isAuthenticated, isLoading, segments]);

  // While loading, you can return a splash screen or a loading indicator
  if (isLoading) {
    // You might want to return a proper loading component here
    return null;
  }

  return (
    <Stack>
      {/* The (auth) group has its own layout, so we can hide the header here */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* The (app) group has its own layout (Tabs), so hide the header here */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} /> 
      {/* Add a screen for the admin group */}
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
  );
}