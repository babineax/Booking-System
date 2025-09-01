import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config'; // Assuming your db export is here

type Service = {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
};

const getServices = async (): Promise<Service[]> => {
  const servicesCollection = collection(db, 'services');
  const servicesSnapshot = await getDocs(servicesCollection);
  const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  return servicesList;
};

export const useGetServices = () => {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: getServices,
  });
};
