// utils/googleCalendar.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  Constants.expoConfig?.extra?.googleClientId ||
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export async function addEventToGoogleCalendar(
  summary: string,
  description: string,
  startDate: Date,
  endDate: Date,
) {
  try {
    // ✅ Use Expo's redirect helper
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true, // this ensures Expo Go can handle the redirect properly
    });

    console.log("Redirect URI:", redirectUri);

    const authRequest = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
      ],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true, // Enable PKCE
    });

    const result = await authRequest.promptAsync(discovery, {
      useProxy: true, // 👈 important for Expo Go testing
    });

    if (result.type !== "success") {
      Alert.alert("Authentication failed", "Could not log in to Google");
      return;
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: GOOGLE_CLIENT_ID,
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: authRequest.codeVerifier || "",
        },
      },
      discovery,
    );

    const accessToken = tokenResponse.accessToken;

    // 🗓️ Create event
    const event = {
      summary,
      description,
      start: { dateTime: startDate.toISOString(), timeZone: "UTC" },
      end: { dateTime: endDate.toISOString(), timeZone: "UTC" },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (response.ok) {
      Alert.alert(
        "✅ Added to Calendar",
        "Your booking is now on Google Calendar!",
      );
    } else {
      const error = await response.json();
      console.error("Google Calendar Error:", error);
      Alert.alert(
        "❌ Failed",
        `Could not add event: ${error.error?.message || "Unknown error"}`,
      );
    }
  } catch (error) {
    console.error("Google Calendar Integration Error:", error);
    Alert.alert("Error", "Something went wrong adding the event.");
  }
}
