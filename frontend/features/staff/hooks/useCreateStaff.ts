import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../../../firebase/services/staffService";
import { User, RegisterData } from "../../../firebase/types";

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, Omit<RegisterData, "password" | "role">>({
    mutationFn: (staffData) => staffService.createStaff(staffData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
    },
  });
};
