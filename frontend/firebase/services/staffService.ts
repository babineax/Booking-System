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

class StaffService {
  private staffCollection = "staff";
  private usersCollection = "users";

  async createStaff(
    staffData: Omit<RegisterData, "password" | "role">
  ): Promise<User> {
    try {
      // This method creates a staff profile in Firestore but does not create an auth user.
      // Store staff profiles in the dedicated staff collection.
      const staffDocRef = doc(collection(db, this.staffCollection));

      const staffDoc: User = {
        id: staffDocRef.id,
        username: staffData.email,
        email: staffData.email,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        phone: staffData.phone || "",
        role: "staff",
        isAdmin: false,
        isActive: true,
        serviceIds: [],
        bio: staffData.bio || "",
        workingHours: {
          monday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
          tuesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
          wednesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
          thursday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
          friday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
          saturday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          sunday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(staffDocRef, staffDoc);

      return staffDoc;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create staff member");
    }
  }

  async getStaffById(id: string): Promise<User | null> {
    try {
      const staffDoc = await getDoc(doc(db, this.staffCollection, id));

      if (staffDoc.exists()) {
        return { id: staffDoc.id, ...staffDoc.data() } as User;
      }

      return null;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get staff member");
    }
  }

  async getStaffMembers(): Promise<User[]> {
    try {
      const staffQuery = query(
        collection(db, this.staffCollection),
        orderBy("firstName")
      );

      const querySnapshot = await getDocs(staffQuery);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to get staff members");
    }
  }

  async updateStaff(id: string, updates: Partial<User>): Promise<User> {
    try {
      const staffRef = doc(db, this.staffCollection, id);
      await updateDoc(staffRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const updatedStaff = await this.getStaffById(id);
      if (!updatedStaff) {
        throw new Error("Failed to retrieve updated staff member");
      }

      return updatedStaff;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update staff member");
    }
  }

  async deleteStaff(id: string): Promise<void> {
    try {
      // Delete from staff collection only (do not touch users collection here)
      await deleteDoc(doc(db, this.staffCollection, id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete staff member");
    }
  }
}

export const staffService = new StaffService();
export default staffService;
