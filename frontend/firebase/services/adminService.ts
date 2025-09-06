import { getFunctions, httpsCallable } from 'firebase/functions';

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
  temporaryPassword?: string;
}

// --- Callable Functions ---
const createClientCallable = httpsCallable<CreateClientData, CreateClientResponse>(functions, 'createClient');

// --- Service Methods ---
const createClient = (data: CreateClientData): Promise<CreateClientResponse> => {
  return createClientCallable(data).then(result => result.data);
};

export const adminService = {
  createClient,
};
