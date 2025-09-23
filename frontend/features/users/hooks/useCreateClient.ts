import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, User } from "../../../firebase/services/userService";

// Define the expected request type for creating a client
interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const createClient = async (
  clientData: CreateClientRequest,
): Promise<User> => {
  try {
    // We need to add a method to userService to handle just adding a client
    // without authentication. I'll assume one called `addClient` will be created.
    const newUser = await userService.addClient({
      ...clientData,
      role: "customer",
    });
    return newUser;
  } catch (error) {
    console.error("Error creating client:", error);
    throw new Error("Failed to create client. Please try again.");
  }
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateClientRequest>({
    mutationFn: createClient,
    onSuccess: () => {
      // Invalidate and refetch the users query to see the new client
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
