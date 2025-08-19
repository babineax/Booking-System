import { User } from 'firebase/auth';

export interface UserInfo {
  uid: string;
  email: string;
  
}

export interface AuthContextType {
  userInfo: UserInfo | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
}
