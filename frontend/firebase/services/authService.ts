import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase_config";
import { User, LoginCredentials, RegisterData } from "../types";

class AuthService {
  private usersCollection = "users";
  private staffCollection = "staff";
  private clientsCollection = "clients";

  async register(
    userData: RegisterData,
  ): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );

      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      const userDoc: User = {
        id: firebaseUser.uid,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        role: userData.role || "customer",
        isAdmin: userData.role === "admin",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Create a document in the users collection for auth purposes
      await setDoc(doc(db, this.usersCollection, firebaseUser.uid), {
        email: userDoc.email,
        role: userDoc.role,
        createdAt: serverTimestamp(),
      });

      // Create a document in the corresponding role collection
      if (userDoc.role === "staff" || userDoc.role === "admin") {
        userDoc.serviceIds = [];
        userDoc.bio = userData.bio || "";
        userDoc.workingHours = {
          monday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          tuesday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          wednesday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          thursday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          friday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          saturday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          sunday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
        };
        await setDoc(doc(db, this.staffCollection, firebaseUser.uid), userDoc);
      } else {
        userDoc.preferences = userData.preferences || {};
        await setDoc(
          doc(db, this.clientsCollection, firebaseUser.uid),
          userDoc,
        );
      }

      return { user: userDoc, firebaseUser };
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );

      const firebaseUser = userCredential.user;

      // Get user role from the users collection
      const userRoleDoc = await getDoc(
        doc(db, this.usersCollection, firebaseUser.uid),
      );
      if (!userRoleDoc.exists()) {
        throw new Error("User role not found");
      }
      const role = userRoleDoc.data().role;

      // Fetch the user profile from the correct collection
      const collectionName =
        role === "staff" || role === "admin"
          ? this.staffCollection
          : this.clientsCollection;
      const userDoc = await getDoc(doc(db, collectionName, firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;

      return { user, firebaseUser };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async getCurrentUserData(): Promise<User | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const userRoleDoc = await getDoc(
      doc(db, this.usersCollection, currentUser.uid),
    );
    if (!userRoleDoc.exists()) {
      return null;
    }
    const role = userRoleDoc.data().role;

    const collectionName =
      role === "staff" || role === "admin"
        ? this.staffCollection
        : this.clientsCollection;
    const userDoc = await getDoc(doc(db, collectionName, currentUser.uid));

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }

    return null;
  }
}

export const authService = new AuthService();
export default authService;
