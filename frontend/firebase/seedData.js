
import { businessHoursService } from './services/businessHoursService';
import { serviceService } from './services/serviceService';
import { userService } from './services/userService';

const seedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@bookingsystem.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
    },
    {
      username: 'stylist1',
      email: 'sarah@bookingsystem.com',
      password: 'stylist123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567891',
      role: 'staff',
      specialties: ['haircut', 'coloring'],
      bio: 'Professional hair stylist with 5+ years of experience.',
    },
    {
      username: 'customer1',
      email: 'customer@example.com',
      password: 'customer123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567892',
      role: 'customer',
      preferences: {
        favoriteServices: [],
        communicationPreferences: {
          email: true,
          sms: false
        }
      },
    },
  ],
  
  services: [
    {
      name: 'Men\'s Haircut',
      description: 'Professional haircut for men including wash and style',
      duration: 30,
      price: 25,
      category: 'haircut',
      isActive: true,
    },
    {
      name: 'Women\'s Haircut',
      description: 'Professional haircut for women including wash and style',
      duration: 45,
      price: 35,
      category: 'haircut',
      isActive: true,
    },
    {
      name: 'Hair Coloring',
      description: 'Full hair coloring service with professional products',
      duration: 120,
      price: 80,
      category: 'coloring',
      isActive: true,
    },
    {
      name: 'Hair Styling',
      description: 'Special occasion hair styling',
      duration: 60,
      price: 45,
      category: 'styling',
      isActive: true,
    },
    {
      name: 'Deep Conditioning Treatment',
      description: 'Intensive hair treatment for damaged or dry hair',
      duration: 30,
      price: 25,
      category: 'treatment',
      isActive: true,
    },
  ],
};

// Function to seed users
async function seedUsers() {
  console.log('Seeding users...');
  const createdUsers = [];
  
  for (const userData of seedData.users) {
    try {
      const result = await userService.register(userData);
      createdUsers.push(result.user);
      console.log(`Created user: ${userData.email}`);
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error.message);
    }
  }
  
  return createdUsers;
}


async function seedServices(staffUsers) {
  console.log('Seeding services...');
  const createdServices = [];
  
  for (const serviceData of seedData.services) {
    try {
    
      const staffMembers = staffUsers
        .filter(user => user.role === 'staff')
        .map(user => user.id);
      
      const service = await serviceService.createService({
        ...serviceData,
        staffMembers,
      });
      
      createdServices.push(service);
      console.log(`Created service: ${serviceData.name}`);
    } catch (error) {
      console.error(`Failed to create service ${serviceData.name}:`, error.message);
    }
  }
  
  return createdServices;
}


async function seedBusinessHours(staffUsers) {
  console.log('Seeding business hours...');
  
  const defaultWeeklyHours = [
    { dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '16:00' },
    { dayOfWeek: 'sunday', isOpen: false },
  ];
  
  for (const staffUser of staffUsers.filter(user => user.role === 'staff')) {
    try {
      await businessHoursService.setWeeklyBusinessHours(
        staffUser.id,
        defaultWeeklyHours
      );
      console.log(`Created business hours for: ${staffUser.firstName} ${staffUser.lastName}`);
    } catch (error) {
      console.error(`Failed to create business hours for ${staffUser.firstName}:`, error.message);
    }
  }
}


export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    
    const users = await seedUsers();
    
   
    const services = await seedServices(users);
    
   
    await seedBusinessHours(users);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${services.length} services`);
    
    return {
      users,
      services,
      success: true,
    };
  } catch (error) {
    console.error('Database seeding failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}


export {
  seedBusinessHours, seedServices, seedUsers
};

