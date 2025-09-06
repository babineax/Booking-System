import { useMutation } from '@tanstack/react-query';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Define the expected request and response types
interface CreateBookingRequest {
  serviceId: string;
  startTime: string; // Should be in a consistent format, e.g., ISO 8601
  clientId?: string; // Optional: for admins booking for a client
}

interface CreateBookingResponse {
  success: boolean;
  message: string;
}

// Get a reference to the Firebase Functions service
const functions = getFunctions();

// Get a reference to the createBooking callable function
const createBookingCallable = httpsCallable<CreateBookingRequest, CreateBookingResponse>(functions, 'createBooking');

const callCreateBooking = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
  try {
    const result = await createBookingCallable(data);
    return result.data;
  } catch (error) {
    // The error object from Firebase Functions has a message and code
    console.error("Error calling createBooking function:", error);
    // Re-throw a more generic error to be handled by the mutation's onError callback
    throw new Error('Failed to create booking. Please try again.');
  }
};

export const useCreateBooking = () => {
  return useMutation<CreateBookingResponse, Error, CreateBookingRequest>({
    mutationFn: callCreateBooking,
  });
};
