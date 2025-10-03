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
  private staffCollection = "staff";
  private clientsCollection = "clients";

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

    // Minimal users doc for role lookup
    await setDoc(doc(db, this.usersCollection, firebaseUser.uid), {
      email: firebaseUser.email!,
      role: "customer",
      createdAt: serverTimestamp(),
    });

    // Full customer profile in clients collection
    const clientProfile: User = {
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
    await setDoc(
      doc(db, this.clientsCollection, firebaseUser.uid),
      clientProfile
    );

    return clientProfile;
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

    // Determine role from users collection
    const roleSnap = await getDoc(
      doc(db, this.usersCollection, firebaseUser.uid)
    );
    if (!roleSnap.exists()) {
      throw new Error("User role not found");
    }
    const role = (roleSnap.data() as any).role;

    const profileCollection =
      role === "admin" || role === "staff"
        ? this.staffCollection
        : this.clientsCollection;
    const profileSnap = await getDoc(
      doc(db, profileCollection, firebaseUser.uid)
    );
    if (!profileSnap.exists()) {
      throw new Error("User data not found");
    }

    const user = { id: firebaseUser.uid, ...profileSnap.data() } as User;

    return { user, firebaseUser };
  }
}

export const userService = new UserService();
export default userService;
