// utils/googleCalendar.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  Constants.expoConfig?.extra?.googleClientId || "default_client_id";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export async function addEventToGoogleCalendar(
  summary: string,
  description: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const redirectUri = "https://auth.expo.io/@gideonsitienei/booking-system";

    // 🔐 Request Google auth
    const authRequest = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
      ],
      responseType: AuthSession.ResponseType.Token,
      usePKCE: false, // Disable PKCE for implicit flow
    });

    const result = await authRequest.promptAsync(discovery, { useProxy: true });

    if (result.type !== "success" || !result.authentication?.accessToken) {
      Alert.alert("Authentication failed", "Could not log in to Google");
      return;
    }

    const accessToken = result.authentication.accessToken;

    // 🗓️ Create calendar event via Google Calendar API
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
      }
    );

    if (response.ok) {
      Alert.alert(
        "✅ Added to Calendar",
        "Your booking is now on Google Calendar!"
      );
    } else {
      const error = await response.json();
      console.error("Google Calendar Error:", error);
      Alert.alert(
        "❌ Failed",
        `Could not add event to Google Calendar: ${error.error.message}`
      );
    }
  } catch (error) {
    console.error("Google Calendar Integration Error:", error);
    Alert.alert("Error", "Something went wrong adding the event.");
  }
}
