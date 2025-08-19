import { User } from 'firebase/auth';
import { UserInfo } from '../../firebase/types/auth';

export interface AuthState {
  userInfo: UserInfo | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RootState {
  auth: AuthState;
  
}
