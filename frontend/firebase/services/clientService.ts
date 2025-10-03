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
} from "firebase/firestore";
import { db } from "../config/firebase_config";
import { RegisterData, User } from "../types";

class ClientService {
  private clientsCollection = "clients";
  private usersCollection = "users";

  async addClient(
    clientData: Omit<RegisterData, "password" | "role"> & { id?: string }
  ): Promise<User> {
    try {
      // If caller provides an id (e.g., Firebase Auth UID), use it so login can resolve.
      const clientDocRef = clientData.id
        ? doc(db, this.clientsCollection, clientData.id)
        : doc(collection(db, this.clientsCollection));
      const userDocRef = doc(db, this.usersCollection, clientDocRef.id);

      const clientDoc: Partial<User> = {
        id: clientDocRef.id,
        username: clientData.email,
        email: clientData.email,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        phone: clientData.phone || "",
        role: "customer",
        isAdmin: false,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(clientDocRef, clientDoc);
      // Keep users doc minimal and authoritative for role lookup
      await setDoc(
        userDocRef,
        {
          email: clientDoc.email,
          role: "customer",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      return clientDoc as User;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add client");
    }
  }

  async getClientById(id: string): Promise<User | null> {
    try {
      const clientDoc = await getDoc(doc(db, this.clientsCollection, id));

      if (clientDoc.exists()) {
        return { id: clientDoc.id, ...clientDoc.data() } as User;
      }

      return null;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get client");
    }
  }

  async getAllClients(): Promise<User[]> {
    try {
      const clientsQuery = query(
        collection(db, this.clientsCollection),
        orderBy("firstName")
      );

      const querySnapshot = await getDocs(clientsQuery);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get clients");
    }
  }

  async updateClient(id: string, updates: Partial<User>): Promise<User> {
    try {
      const clientRef = doc(db, this.clientsCollection, id);
      await updateDoc(clientRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const updatedClient = await this.getClientById(id);
      if (!updatedClient) {
        throw new Error("Failed to retrieve updated client");
      }

      return updatedClient;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update client");
    }
  }

  async deleteClient(id: string): Promise<void> {
    try {
      // Delete client profile; do not automatically delete users doc to avoid breaking auth
      await deleteDoc(doc(db, this.clientsCollection, id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete client");
    }
  }
}

export const clientService = new ClientService();
export default clientService;
