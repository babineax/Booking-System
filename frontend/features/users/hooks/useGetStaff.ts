import { useQuery } from "@tanstack/react-query";
import { userService, User } from "../../../firebase/services/userService";

export const useGetStaff = () => {
  return useQuery<User[], Error>({
    queryKey: ['staffMembers'],
    queryFn: () => userService.getStaffMembers(),
  });
};
