

import { seedDatabase, seedUsers } from '../firebase/seedData';


const seedEverything = async () => {
  try {
    const result = await seedDatabase();
    console.log('Seeding result:', result);
    
    if (result.success) {
      console.log(`✅ Created ${result.users.length} users`);
      console.log(`✅ Created ${result.services.length} services`);
    } else {
      console.error('❌ Seeding failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};


const seedOnlyUsers = async () => {
  try {
    const users = await seedUsers();
    console.log(`✅ Created ${users.length} users:`, users);
  } catch (error) {
    console.error('❌ Failed to seed users:', error);
  }
};


const MyComponent = () => {
  const handleSeed = () => {
    seedEverything();
  };

  return (
    <TouchableOpacity onPress={handleSeed}>
      <Text>Seed Database</Text>
    </TouchableOpacity>
  );
};

export { seedEverything, seedOnlyUsers };
