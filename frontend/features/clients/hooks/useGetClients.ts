import { useQuery } from "@tanstack/react-query";
import { clientService } from "../../../firebase/services/clientService";
import { User } from "../../../firebase/types";

export const useGetClients = () => {
  return useQuery<User[], Error>({
    queryKey: ["clients"],
    queryFn: () => clientService.getAllClients(),
  });
};
