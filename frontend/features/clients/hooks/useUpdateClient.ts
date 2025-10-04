import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "../../../firebase/services/clientService";
import { User } from "../../../firebase/types";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; updates: Partial<User> }>({
    mutationFn: ({ id, updates }) => clientService.updateClient(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
