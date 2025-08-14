import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { auth, db } from '../config';

export interface User {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
  isAdmin: boolean;
  isActive: boolean;
  specialties?: string[];
  bio?: string;
  preferences?: Record<string, any>;
  createdAt?: any;
  updatedAt?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'staff' | 'admin';
  specialties?: string[];
  bio?: string;
  preferences?: Record<string, any>;
}

class UserService {
  private usersCollection = 'users';

  async register(userData: RegisterData): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
      
      await updateProfile(firebaseUser, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      
     
      const userDoc: User = {
        id: firebaseUser.uid,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        role: userData.role || 'customer',
        isAdmin: userData.role === 'admin',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

     
      if (userData.role === 'staff') {
        userDoc.specialties = userData.specialties || [];
        userDoc.bio = userData.bio || '';
      }
      
      if (userData.role === 'customer') {
        userDoc.preferences = userData.preferences || {};
      }

     
      const cleanUserDoc = Object.fromEntries(
        Object.entries(userDoc).filter(([_, value]) => value !== undefined)
      );

      await setDoc(doc(db, this.usersCollection, firebaseUser.uid), cleanUserDoc);

      return { user: userDoc, firebaseUser };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      const user = await this.getUserById(firebaseUser.uid);
      
      if (!user) {
        throw new Error('User data not found');
      }

      return { user, firebaseUser };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, id));
      
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user');
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, this.usersCollection, id);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedUser = await this.getUserById(id);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }
      
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async updateProfile(id: string, profileData: Partial<User>): Promise<User> {
    return this.updateUser(id, profileData);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get users');
    }
  }

  async getStaffMembers(): Promise<User[]> {
    try {
      const staffQuery = query(
        collection(db, this.usersCollection),
        where('role', 'in', ['staff', 'admin']),
        where('isActive', '==', true),
        orderBy('firstName')
      );
      
      const querySnapshot = await getDocs(staffQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get staff members');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.usersCollection, id));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async getCurrentUserData(): Promise<User | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    
    return this.getUserById(currentUser.uid);
  }
}

export const userService = new UserService();
export default userService;
