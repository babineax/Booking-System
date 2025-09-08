import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

// --- Service Types ---
interface CreateClientData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface CreateClientResponse {
  success: boolean;
  message: string;
  clientId: string;
}

interface BookingData {
  serviceId: string;
  startTime: string;
  clientId: string;
  serviceProviderId: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
}

// --- Callable Functions ---
const createClientCallable = httpsCallable<
  CreateClientData,
  CreateClientResponse
>(functions, "createClient");
const createBookingCallable = httpsCallable<BookingData, BookingResponse>(
  functions,
  "createBooking",
);

// --- Service Methods ---
const createClient = (
  data: CreateClientData,
): Promise<CreateClientResponse> => {
  return createClientCallable(data).then((result) => result.data);
};

const createBooking = (data: BookingData): Promise<BookingResponse> => {
  return createBookingCallable(data).then((result) => result.data);
};

export const adminService = {
  createClient,
  createBooking,
};
