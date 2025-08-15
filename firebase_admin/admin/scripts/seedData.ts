import type { UserRecord } from "firebase-admin/auth";
import { auth, db } from "../firebase_admin"; // use Admin SDK

// ---------------------- TYPES ----------------------
interface UserInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "staff" | "customer";
  specialties?: string[];
  bio?: string;
}

export type ServiceCategory =
  | "haircut"
  | "coloring"
  | "styling"
  | "treatment"
  | "consultation"
  | "other";

export interface Service {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  isActive: boolean;
}

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface BusinessHours {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

// ---------------------- SEED DATA ----------------------
const usersData: UserInput[] = [
  {
    username: "admin",
    email: "admin@bookingsystem.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    phone: "+1234567890",
    role: "admin",
  },
  {
    username: "stylist1",
    email: "sarah@bookingsystem.com",
    password: "stylist123",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "+1234567891",
    role: "staff",
    specialties: ["haircut", "coloring"],
    bio: "Professional hair stylist with 5+ years of experience.",
  },
  {
    username: "customer1",
    email: "customer@example.com",
    password: "customer123",
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567892",
    role: "customer",
  },
];

const servicesData: Omit<Service, "staffMembers">[] = [
  {
    name: "Men's Haircut",
    description: "Professional haircut for men",
    duration: 30,
    price: 25,
    category: "haircut",
    isActive: true,
  },
  {
    name: "Women's Haircut",
    description: "Professional haircut for women",
    duration: 45,
    price: 35,
    category: "haircut",
    isActive: true,
  },
  {
    name: "Hair Coloring",
    description: "Full hair coloring service",
    duration: 120,
    price: 80,
    category: "coloring",
    isActive: true,
  },
  {
    name: "Hair Styling",
    description: "Special occasion hair styling",
    duration: 60,
    price: 45,
    category: "styling",
    isActive: true,
  },
  {
    name: "Deep Conditioning Treatment",
    description: "Intensive hair treatment",
    duration: 30,
    price: 25,
    category: "treatment",
    isActive: true,
  },
];

const defaultWeeklyHours: BusinessHours[] = [
  { dayOfWeek: "monday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { dayOfWeek: "tuesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  {
    dayOfWeek: "wednesday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "17:00",
  },
  {
    dayOfWeek: "thursday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "17:00",
  },
  { dayOfWeek: "friday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  {
    dayOfWeek: "saturday",
    isOpen: true,
    openTime: "10:00",
    closeTime: "16:00",
  },
  { dayOfWeek: "sunday", isOpen: false },
];

// ---------------------- SEED FUNCTIONS ----------------------
export async function seedUsers(): Promise<UserRecord[]> {
  const createdUsers: UserRecord[] = [];
  console.log("Seeding users...");

  for (const user of usersData) {
    try {
      let userRecord: UserRecord;

      try {
        // Check if user exists
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`User already exists: ${user.email}`);
      } catch {
        // Create new user
        userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: `${user.firstName} ${user.lastName}`,
        });
        console.log(`Created user: ${user.email}`);
      }

      // Set custom role claim
      await auth.setCustomUserClaims(userRecord.uid, { role: user.role });

      // Firestore user document (idempotent with merge)
      await db
        .collection("users")
        .doc(userRecord.uid)
        .set(
          {
            username: user.username,
            role: user.role,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            specialties: user.specialties || [],
            bio: user.bio || "",
          },
          { merge: true }
        );

      createdUsers.push(userRecord);
    } catch (err: any) {
      console.error(
        `Failed to process user ${user.email}:`,
        err.message || err
      );
    }
  }

  return createdUsers;
}

export async function seedServices(users: UserRecord[]): Promise<void> {
  console.log("Seeding services...");

  const staffUsers = users.filter((u) => u.customClaims?.role === "staff");

  for (const service of servicesData) {
    try {
      // Check if service already exists
      const query = await db
        .collection("services")
        .where("name", "==", service.name)
        .get();
      if (!query.empty) {
        console.log(`Service already exists: ${service.name}`);
        continue;
      }

      await db.collection("services").add({
        ...service,
        staffMembers: staffUsers.map((u) => u.uid),
      });

      console.log(`Created service: ${service.name}`);
    } catch (err: any) {
      console.error(
        `Failed to create service ${service.name}:`,
        err.message || err
      );
    }
  }
}

export async function seedBusinessHours(users: UserRecord[]): Promise<void> {
  console.log("Seeding business hours...");

  const staffUsers = users.filter((u) => u.customClaims?.role === "staff");

  for (const staff of staffUsers) {
    try {
      // Idempotent merge
      await db
        .collection("businessHours")
        .doc(staff.uid)
        .set({ weeklyHours: defaultWeeklyHours }, { merge: true });
      console.log(`Created business hours for: ${staff.displayName}`);
    } catch (err: any) {
      console.error(
        `Failed to create business hours for ${staff.displayName}:`,
        err.message || err
      );
    }
  }
}

export async function seedDatabase(): Promise<{
  users: UserRecord[];
  success: boolean;
}> {
  const users = await seedUsers();
  await seedServices(users);
  await seedBusinessHours(users);
  console.log("Database seeding completed!");
  return { users, success: true };
}
