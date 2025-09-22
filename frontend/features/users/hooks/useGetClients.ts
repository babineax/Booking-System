import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../firebase/services/userService";

export const useGetClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => userService.getClients(),
  });
};
