// firebase/services/userService.ts
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase_config";
import { LoginCredentials, RegisterData, User } from "../types";

class UserService {
  private usersCollection = "users";

  /**
   * Register a new user in Firebase Auth + Firestore
   */
  async register({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: RegisterData): Promise<User> {
    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Create user profile document in Firestore
    const userDoc: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName,
      lastName,
      phone: phone || "",
      role: "customer",
      isAdmin: false,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      username: "",
    };

    await setDoc(doc(db, this.usersCollection, firebaseUser.uid), userDoc);

    return userDoc;
  }

  /**
   * Login with email + password
   */
  async login({
    email,
    password,
  }: LoginCredentials): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Fetch user profile from Firestore
    const docSnap = await getDoc(
      doc(db, this.usersCollection, firebaseUser.uid)
    );

    if (!docSnap.exists()) {
      throw new Error("User profile not found in Firestore");
    }

    const user = { id: firebaseUser.uid, ...docSnap.data() } as User;

    return { user, firebaseUser };
  }
}

export const userService = new UserService();
export default userService;
