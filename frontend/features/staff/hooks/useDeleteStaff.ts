import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../../../firebase/services/staffService";

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (staffId) => staffService.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
    },
  });
};
