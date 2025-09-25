import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, User } from "../../../firebase/services/userService";

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; updates: Partial<User> }>({ 
    mutationFn: ({ id, updates }) => userService.updateUser(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch both the staff list and the individual staff member query
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      queryClient.invalidateQueries({ queryKey: ['staffMember', variables.id] });
    },
  });
};
