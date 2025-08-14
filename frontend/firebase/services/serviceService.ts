import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config';

export interface Service {
  id?: string;
  name: string;
  description: string;
  duration: number; 
  price: number;
  category: 'haircut' | 'coloring' | 'styling' | 'treatment' | 'consultation' | 'other';
  isActive: boolean;
  staffMembers: string[]; 
  createdAt?: any;
  updatedAt?: any;
}

export interface CreateServiceData {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: 'haircut' | 'coloring' | 'styling' | 'treatment' | 'consultation' | 'other';
  staffMembers?: string[];
  isActive?: boolean;
}

class ServiceService {
  private servicesCollection = 'services';

  async createService(serviceData: CreateServiceData): Promise<Service> {
    try {
      const serviceDoc: Omit<Service, 'id'> = {
        name: serviceData.name,
        description: serviceData.description,
        duration: serviceData.duration,
        price: serviceData.price,
        category: serviceData.category,
        isActive: serviceData.isActive ?? true,
        staffMembers: serviceData.staffMembers || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.servicesCollection), serviceDoc);
      
      const createdService = await this.getServiceById(docRef.id);
      if (!createdService) {
        throw new Error('Failed to retrieve created service');
      }

      return createdService;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create service');
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      const serviceDoc = await getDoc(doc(db, this.servicesCollection, id));
      
      if (serviceDoc.exists()) {
        return { id: serviceDoc.id, ...serviceDoc.data() } as Service;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get service');
    }
  }

  async getAllServices(): Promise<Service[]> {
    try {
      const servicesQuery = query(
        collection(db, this.servicesCollection),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(servicesQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get services');
    }
  }

  async getActiveServices(): Promise<Service[]> {
    try {
      const servicesQuery = query(
        collection(db, this.servicesCollection),
        where('isActive', '==', true),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(servicesQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get active services');
    }
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const servicesQuery = query(
        collection(db, this.servicesCollection),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(servicesQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get services by category');
    }
  }

  async getServicesByStaffMember(staffMemberId: string): Promise<Service[]> {
    try {
      const servicesQuery = query(
        collection(db, this.servicesCollection),
        where('staffMembers', 'array-contains', staffMemberId),
        where('isActive', '==', true),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(servicesQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get services by staff member');
    }
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    try {
      const serviceRef = doc(db, this.servicesCollection, id);
      await updateDoc(serviceRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedService = await this.getServiceById(id);
      if (!updatedService) {
        throw new Error('Failed to retrieve updated service');
      }
      
      return updatedService;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update service');
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.servicesCollection, id));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete service');
    }
  }

  async addStaffToService(serviceId: string, staffMemberId: string): Promise<Service> {
    try {
      const service = await this.getServiceById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      if (!service.staffMembers.includes(staffMemberId)) {
        const updatedStaffMembers = [...service.staffMembers, staffMemberId];
        return this.updateService(serviceId, { staffMembers: updatedStaffMembers });
      }

      return service;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add staff to service');
    }
  }

  async removeStaffFromService(serviceId: string, staffMemberId: string): Promise<Service> {
    try {
      const service = await this.getServiceById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      const updatedStaffMembers = service.staffMembers.filter(id => id !== staffMemberId);
      return this.updateService(serviceId, { staffMembers: updatedStaffMembers });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove staff from service');
    }
  }
}

export const serviceService = new ServiceService();
export default serviceService;
