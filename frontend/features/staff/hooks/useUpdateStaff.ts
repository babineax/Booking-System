import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../../../firebase/services/staffService";
import { User } from "../../../firebase/types";

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; updates: Partial<User> }>({
    mutationFn: ({ id, updates }) => staffService.updateStaff(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
    },
  });
};
