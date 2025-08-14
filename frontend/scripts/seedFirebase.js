
import { seedDatabase } from '../firebase/seedData.js';

async function runSeeding() {
  console.log('🌱 Starting Firebase database seeding...\n');
  
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      console.log('✅ Database seeded successfully!\n');
      console.log(`👥 Users created: ${result.users?.length || 0}`);
      console.log(`🛠️ Services created: ${result.services?.length || 0}\n`);
      
      console.log('📋 Created Users:');
      result.users?.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
      
      console.log('\n🎯 You can now login with:');
      console.log('  Admin: admin@bookingsystem.com / admin123');
      console.log('  Staff: sarah@bookingsystem.com / stylist123');
      console.log('  Customer: customer@example.com / customer123');
      
    } else {
      console.error('❌ Seeding failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error.message);
    process.exit(1);
  }
}

// Run the seeding
runSeeding();
