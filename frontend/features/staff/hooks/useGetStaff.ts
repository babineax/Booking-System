import { useQuery } from "@tanstack/react-query";
import { staffService } from "../../../firebase/services/staffService";
import { User } from "../../../firebase/types";

export const useGetStaff = () => {
  return useQuery<User[], Error>({
    queryKey: ["staffMembers"],
    queryFn: () => staffService.getStaffMembers(),
  });
};
