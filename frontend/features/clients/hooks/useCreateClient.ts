import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "../../../firebase/services/clientService";
import { User, RegisterData } from "../../../firebase/types";

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, Omit<RegisterData, "password" | "role">>({
    mutationFn: (clientData) => clientService.addClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
