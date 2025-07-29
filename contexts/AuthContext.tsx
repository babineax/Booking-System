import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContextType, AuthUser, UserProfile, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as AuthUser);
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user as AuthUser);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is acceptable for new users
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>): Promise<void> => {
    try {
      setLoading(true);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            display_name: `${userData.first_name} ${userData.last_name}`,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in the database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            display_name: `${userData.first_name} ${userData.last_name}`,
            role: userData.role || 'customer',
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone_number: userData.phone_number,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw here as the user is still created in auth
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createStaffAccount = async (email: string, password: string, userData: Partial<UserProfile>): Promise<void> => {
    try {
      setLoading(true);
      
      // Only admin users can create staff accounts
      if (userProfile?.role !== 'admin') {
        throw new Error('Unauthorized: Only admin users can create staff accounts');
      }

      // This would require server-side implementation or Supabase Edge Functions
      // For now, we'll throw an error indicating this needs backend implementation
      throw new Error('Staff account creation requires server-side implementation. Please use Supabase Auth Admin API or Edge Functions.');

    } catch (error: any) {
      console.error('Create staff account error:', error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'your-app://reset-password', // Update with your app's deep link
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    createStaffAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
