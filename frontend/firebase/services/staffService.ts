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
  where,
} from "firebase/firestore";
import { db } from "../config/firebase_config";
import { User, RegisterData } from "../types";

class StaffService {
  private staffCollection = "staff";
  private usersCollection = "users";

  async createStaff(
    staffData: Omit<RegisterData, "password" | "role">,
  ): Promise<User> {
    try {
      // This method creates a staff profile in Firestore but does not create an auth user.
      const staffDocRef = doc(collection(db, this.usersCollection));

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
      const staffDoc = await getDoc(doc(db, this.usersCollection, id));

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
        collection(db, this.usersCollection),
        where("role", "==", "staff"),
        orderBy("firstName"),
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
      const staffRef = doc(db, this.usersCollection, id);
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
      // Also delete the user record
      await deleteDoc(doc(db, this.usersCollection, id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete staff member");
    }
  }
}

export const staffService = new StaffService();
export default staffService;
