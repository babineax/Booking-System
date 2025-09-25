import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, RegisterData } from "../../../firebase/services/userService";

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, Omit<RegisterData, "password" | "role">>({ 
    mutationFn: (staffData) => userService.createStaff(staffData),
    onSuccess: () => {
      // Invalidate and refetch the staff members query to see the new staff
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    },
  });
};
