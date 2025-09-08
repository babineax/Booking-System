import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

async function getUsers({ role }) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export function useGetUsers({ role }) {
  return useQuery({
    queryKey: ["users", role],
    queryFn: () => getUsers({ role }),
  });
}
