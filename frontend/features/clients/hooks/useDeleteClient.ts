import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "../../../firebase/services/clientService";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (clientId) => clientService.deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
