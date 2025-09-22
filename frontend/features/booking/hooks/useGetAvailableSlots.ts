import { useQuery } from "@tanstack/react-query";
import { getFunctions, httpsCallable } from "firebase/functions";

// Define the expected request and response types
interface AvailabilityRequest {
  staffId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
}

interface AvailabilityResponse {
  slots: string[];
}

const functions = getFunctions();
const getAvailableSlotsCallable = httpsCallable<AvailabilityRequest, AvailabilityResponse>(functions, "getAvailableSlots");

const fetchAvailableSlots = async (request: AvailabilityRequest): Promise<string[]> => {
  if (!request.staffId || !request.serviceId || !request.date) {
    // Don't fetch if the necessary parameters aren't available
    return [];
  }
  try {
    const result = await getAvailableSlotsCallable(request);
    return result.data.slots;
  } catch (error) {
    console.error("Error calling getAvailableSlots function:", error);
    throw new Error("Failed to fetch available time slots.");
  }
};

export const useGetAvailableSlots = (request: AvailabilityRequest) => {
  return useQuery<string[], Error>({
    queryKey: ['availableSlots', request.staffId, request.serviceId, request.date],
    queryFn: () => fetchAvailableSlots(request),
    enabled: !!request.staffId && !!request.serviceId && !!request.date,
  });
};
