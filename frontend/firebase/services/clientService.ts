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
import { User, RegisterData } from "../types";

class ClientService {
  private clientsCollection = "clients";
  private usersCollection = "users";

  async addClient(
    clientData: Omit<RegisterData, "password" | "role">,
  ): Promise<User> {
    try {
      const clientDocRef = doc(collection(db, this.clientsCollection));
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
      await setDoc(userDocRef, clientDoc);

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
        orderBy("firstName"),
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
      // Note: This only deletes the Firestore record. The auth user, if one exists, is separate.
      await deleteDoc(doc(db, this.clientsCollection, id));
      // Optionally, also delete the user record
      await deleteDoc(doc(db, this.usersCollection, id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete client");
    }
  }
}

export const clientService = new ClientService();
export default clientService;
