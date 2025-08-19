import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

interface TokenError extends Error {
  code?: string;
  status?: number;
}

export interface CalendarCredentials {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
  scope: string;
}

class GoogleCalendarService {
  private provider: GoogleAuthProvider;

  constructor() {
    this.provider = new GoogleAuthProvider();
    SCOPES.forEach(scope => this.provider.addScope(scope));
    
    if (CLIENT_ID) {
      this.provider.setCustomParameters({
        client_id: CLIENT_ID,
        prompt: 'consent',
      });
    }
  }

  async authorize() {
    try {
      if (!CLIENT_ID) {
        throw new Error('Google OAuth Client ID is not configured');
      }

      
      this.provider.addScope('https://www.googleapis.com/auth/calendar');
      this.provider.setCustomParameters({
        access_type: 'offline',  
        prompt: 'consent'        
      });

      const result = await signInWithPopup(auth, this.provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('Failed to get Google credentials');
      }

      const accessToken = credential.accessToken;
      const user = result.user;

      if (!accessToken || !user) {
        throw new Error('Failed to get access token or user');
      }

      
      await user.getIdToken(true); 
      const idTokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(idTokenResult.expirationTime).getTime();

      
      await this.storeCredentials(user.uid, {
        accessToken,
        refreshToken: '',  
        expirationTime,
        scope: SCOPES.join(' ')
      });

      return accessToken;
    } catch (error: any) {
      console.error('Error authorizing with Google Calendar:', error);
      
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Please allow popups for Google Calendar authentication');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Authentication was cancelled');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Authentication window was closed');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials');
      }
      
      throw error;
    }
  }

  private async storeCredentials(userId: string, credentials: CalendarCredentials) {
    try {
      const userDoc = doc(db, 'users', userId);
      await setDoc(userDoc, { calendarCredentials: credentials }, { merge: true });
    } catch (error) {
      console.error('Error storing calendar credentials:', error);
      throw error;
    }
  }

  async getStoredCredentials(userId: string): Promise<CalendarCredentials | null> {
    try {
      const userDoc = doc(db, 'users', userId);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.calendarCredentials || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      throw error;
    }
  }

  private async refreshAccessToken(userId: string): Promise<string> {
    try {
     
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      
      const result = await signInWithPopup(auth, this.provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential?.accessToken) {
        throw new Error('Failed to refresh Google credentials');
      }

     
      const idTokenResult = await currentUser.getIdTokenResult();
      const expirationTime = new Date(idTokenResult.expirationTime).getTime();

      await this.storeCredentials(userId, {
        accessToken: credential.accessToken,
        refreshToken: '', 
        expirationTime,
        scope: SCOPES.join(' ')
      });

      return credential.accessToken;
    } catch (error: any) {
      console.error('Error refreshing access token:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        
        throw new Error('Please sign in again to refresh your calendar access');
      }
      
      throw error;
    }
  }

  private async executeWithToken<T>(
    userId: string,
    operation: (token: string) => Promise<T>
  ): Promise<T> {
    try {
      const credentials = await this.getStoredCredentials(userId);
      if (!credentials) {
        throw new Error('No stored credentials');
      }

      let { accessToken, expirationTime } = credentials;
      
    
      if (Date.now() + 5 * 60 * 1000 >= expirationTime) {
        accessToken = await this.refreshAccessToken(userId);
      }

      const result = await operation(accessToken);
      return result;
    } catch (error) {
      const tokenError = error as TokenError;
      if (tokenError.status === 401 || tokenError.code === 'TOKEN_EXPIRED') {
        
        const newAccessToken = await this.refreshAccessToken(userId);
        return await operation(newAccessToken);
      }
      throw error;
    }
  }

  async createCalendarEvent(userId: string, event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  }) {
    return this.executeWithToken(userId, async (accessToken) => {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const error = new Error('Failed to create calendar event') as TokenError;
        error.status = response.status;
        throw error;
      }

      return await response.json();
    });
  }

  async listCalendarEvents(userId: string, timeMin: string, timeMax: string) {
    return this.executeWithToken(userId, async (accessToken) => {
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = new Error('Failed to fetch calendar events') as TokenError;
        error.status = response.status;
        throw error;
      }

      return await response.json();
    });
  }
}

export const googleCalendarService = new GoogleCalendarService();
