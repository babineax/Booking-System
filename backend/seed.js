import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import BusinessHours from "./models/businessHoursModel.js";
import Service from "./models/serviceModel.js";
import User from "./models/userModel.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    
    await User.deleteMany({});
    await Service.deleteMany({});
    await BusinessHours.deleteMany({});

    console.log('Cleared existing data');

    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@booking.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isAdmin: true,
    });

    
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staff1 = await User.create({
      username: 'sarah_stylist',
      email: 'sarah@booking.com',
      password: staffPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567890',
      role: 'staff',
      specialties: ['haircut', 'coloring', 'styling'],
      bio: 'Expert stylist with 8 years of experience in modern cuts and color techniques.',
    });

    const staff2 = await User.create({
      username: 'mike_barber',
      email: 'mike@booking.com',
      password: staffPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      phone: '+1234567891',
      role: 'staff',
      specialties: ['haircut', 'styling'],
      bio: 'Professional barber specializing in classic and modern mens cuts.',
    });

    
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567892',
      role: 'customer',
    });

    console.log('Created users');

    
    const services = [
      {
        name: 'Basic Haircut',
        description: 'Professional haircut with wash and style',
        duration: 60,
        price: 45,
        category: 'haircut',
        staffMembers: [staff1._id, staff2._id],
      },
      {
        name: 'Premium Cut & Style',
        description: 'Precision cut with premium styling and finish',
        duration: 90,
        price: 75,
        category: 'haircut',
        staffMembers: [staff1._id],
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service with consultation',
        duration: 180,
        price: 120,
        category: 'coloring',
        staffMembers: [staff1._id],
      },
      {
        name: 'Beard Trim',
        description: 'Professional beard trimming and styling',
        duration: 30,
        price: 25,
        category: 'styling',
        staffMembers: [staff2._id],
      },
      {
        name: 'Consultation',
        description: 'Hair consultation to discuss styling options',
        duration: 30,
        price: 15,
        category: 'consultation',
        staffMembers: [staff1._id, staff2._id],
      },
    ];

    await Service.insertMany(services);
    console.log('Created services');

    
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    for (const staff of [staff1, staff2]) {
      const businessHours = daysOfWeek.map(day => ({
        dayOfWeek: day,
        isOpen: day !== 'saturday' || staff === staff1, // Staff1 works Saturdays, Staff2 doesn't
        openTime: '09:00',
        closeTime: day === 'saturday' ? '16:00' : '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        staffMember: staff._id,
      }));

      await BusinessHours.insertMany(businessHours);
    }

    console.log('Created business hours');

    console.log('Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@booking.com / admin123');
    console.log('Staff (Sarah): sarah@booking.com / staff123');
    console.log('Staff (Mike): mike@booking.com / staff123');
    console.log('Customer: john@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
