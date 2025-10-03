import { User as FirebaseUser } from "firebase/auth";

export interface User {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "staff" | "admin";
  isAdmin: boolean;
  isActive: boolean;
  serviceIds?: string[];
  workingHours?: {
    [key: string]: { isWorking: boolean; startTime: string; endTime: string };
  };
  googleAuth?: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
  };
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
  role?: "customer" | "staff" | "admin";
  specialties?: string[];
  bio?: string;
  preferences?: Record<string, any>;
}
