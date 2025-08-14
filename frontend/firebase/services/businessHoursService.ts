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

export interface BusinessHours {
  id?: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string; 
  closeTime?: string;
  breakStart?: string; 
  breakEnd?: string;
  staffMemberId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CreateBusinessHoursData {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
  staffMemberId: string;
}

class BusinessHoursService {
  private businessHoursCollection = 'businessHours';

  async createBusinessHours(businessHoursData: CreateBusinessHoursData): Promise<BusinessHours> {
    try {
      
      const existing = await this.getBusinessHoursByStaffAndDay(
        businessHoursData.staffMemberId, 
        businessHoursData.dayOfWeek
      );

      if (existing) {
        throw new Error('Business hours already exist for this staff member and day');
      }

      const businessHoursDoc: Omit<BusinessHours, 'id'> = {
        dayOfWeek: businessHoursData.dayOfWeek,
        isOpen: businessHoursData.isOpen,
        openTime: businessHoursData.openTime,
        closeTime: businessHoursData.closeTime,
        breakStart: businessHoursData.breakStart,
        breakEnd: businessHoursData.breakEnd,
        staffMemberId: businessHoursData.staffMemberId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.businessHoursCollection), businessHoursDoc);
      
      const createdBusinessHours = await this.getBusinessHoursById(docRef.id);
      if (!createdBusinessHours) {
        throw new Error('Failed to retrieve created business hours');
      }

      return createdBusinessHours;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create business hours');
    }
  }

  async getBusinessHoursById(id: string): Promise<BusinessHours | null> {
    try {
      const businessHoursDoc = await getDoc(doc(db, this.businessHoursCollection, id));
      
      if (businessHoursDoc.exists()) {
        return { id: businessHoursDoc.id, ...businessHoursDoc.data() } as BusinessHours;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get business hours');
    }
  }

  async getBusinessHoursByStaffMember(staffMemberId: string): Promise<BusinessHours[]> {
    try {
      const businessHoursQuery = query(
        collection(db, this.businessHoursCollection),
        where('staffMemberId', '==', staffMemberId),
        orderBy('dayOfWeek')
      );
      
      const querySnapshot = await getDocs(businessHoursQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BusinessHours[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get business hours by staff member');
    }
  }

  async getBusinessHoursByStaffAndDay(
    staffMemberId: string, 
    dayOfWeek: string
  ): Promise<BusinessHours | null> {
    try {
      const businessHoursQuery = query(
        collection(db, this.businessHoursCollection),
        where('staffMemberId', '==', staffMemberId),
        where('dayOfWeek', '==', dayOfWeek)
      );
      
      const querySnapshot = await getDocs(businessHoursQuery);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BusinessHours;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get business hours by staff and day');
    }
  }

  async getAllBusinessHours(): Promise<BusinessHours[]> {
    try {
      const businessHoursQuery = query(
        collection(db, this.businessHoursCollection),
        orderBy('staffMemberId'),
        orderBy('dayOfWeek')
      );
      
      const querySnapshot = await getDocs(businessHoursQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BusinessHours[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get all business hours');
    }
  }

  async updateBusinessHours(id: string, updates: Partial<BusinessHours>): Promise<BusinessHours> {
    try {
      const businessHoursRef = doc(db, this.businessHoursCollection, id);
      await updateDoc(businessHoursRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedBusinessHours = await this.getBusinessHoursById(id);
      if (!updatedBusinessHours) {
        throw new Error('Failed to retrieve updated business hours');
      }
      
      return updatedBusinessHours;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update business hours');
    }
  }

  async deleteBusinessHours(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.businessHoursCollection, id));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete business hours');
    }
  }

  async setWeeklyBusinessHours(
    staffMemberId: string, 
    weeklyHours: Omit<CreateBusinessHoursData, 'staffMemberId'>[]
  ): Promise<BusinessHours[]> {
    try {
      const results: BusinessHours[] = [];
      
      for (const dayHours of weeklyHours) {
        const existing = await this.getBusinessHoursByStaffAndDay(
          staffMemberId, 
          dayHours.dayOfWeek
        );
        
        if (existing) {
          
          const updated = await this.updateBusinessHours(existing.id!, dayHours);
          results.push(updated);
        } else {
          
          const created = await this.createBusinessHours({
            ...dayHours,
            staffMemberId
          });
          results.push(created);
        }
      }
      
      return results;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to set weekly business hours');
    }
  }

  async getWorkingDays(staffMemberId: string): Promise<string[]> {
    try {
      const businessHours = await this.getBusinessHoursByStaffMember(staffMemberId);
      
      return businessHours
        .filter(hours => hours.isOpen)
        .map(hours => hours.dayOfWeek);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get working days');
    }
  }

  async isStaffAvailable(
    staffMemberId: string, 
    dayOfWeek: string, 
    time: string
  ): Promise<boolean> {
    try {
      const businessHours = await this.getBusinessHoursByStaffAndDay(staffMemberId, dayOfWeek);
      
      if (!businessHours || !businessHours.isOpen) {
        return false;
      }

      // Check if time is within working hours
      const isWithinWorkingHours = businessHours.openTime && businessHours.closeTime &&
        time >= businessHours.openTime && time <= businessHours.closeTime;

      if (!isWithinWorkingHours) {
        return false;
      }

      
      const isDuringBreak = businessHours.breakStart && businessHours.breakEnd &&
        time >= businessHours.breakStart && time <= businessHours.breakEnd;

      return !isDuringBreak;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to check staff availability');
    }
  }

  async getAvailableHours(staffMemberId: string, dayOfWeek: string): Promise<{
    openTime?: string;
    closeTime?: string;
    breakStart?: string;
    breakEnd?: string;
  } | null> {
    try {
      const businessHours = await this.getBusinessHoursByStaffAndDay(staffMemberId, dayOfWeek);
      
      if (!businessHours || !businessHours.isOpen) {
        return null;
      }

      return {
        openTime: businessHours.openTime,
        closeTime: businessHours.closeTime,
        breakStart: businessHours.breakStart,
        breakEnd: businessHours.breakEnd
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get available hours');
    }
  }

  getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  isTimeRangeValid(openTime: string, closeTime: string): boolean {
    return openTime < closeTime;
  }

  isBreakTimeValid(openTime: string, closeTime: string, breakStart?: string, breakEnd?: string): boolean {
    if (!breakStart || !breakEnd) return true;
    
    return breakStart >= openTime && 
           breakEnd <= closeTime && 
           breakStart < breakEnd;
  }
}

export const businessHoursService = new BusinessHoursService();
export default businessHoursService;
