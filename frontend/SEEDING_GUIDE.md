# Console-Based Database Seeding

## Steps to seed via browser console:

1. **Open your app in a web browser**
2. **Open Developer Tools** (F12 or right-click → Inspect)
3. **Go to the Console tab**
4. **Paste and run this code:**

```javascript
// Import the seeding function (this assumes your app is running)
import('../../firebase/seedData').then(async ({ seedDatabase }) => {
  try {
    console.log('🌱 Starting database seeding...');
    const result = await seedDatabase();
    
    if (result.success) {
      console.log('✅ Database seeded successfully!');
      console.log(`👥 Users created: ${result.users.length}`);
      console.log(`🛠️ Services created: ${result.services.length}`);
      console.table(result.users);
      console.table(result.services);
    } else {
      console.error('❌ Seeding failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
});
```

## Alternative: Simple function call
```javascript
// If seedDatabase is already available globally
window.seedDatabase?.().then(result => {
  console.log('Seeding result:', result);
});
```

## What gets created:
- 👨‍💼 1 Admin user (admin@bookingsystem.com / admin123)
- 💇‍♀️ 1 Staff user (sarah@bookingsystem.com / stylist123) 
- 👤 1 Customer user (customer@example.com / customer123)
- ✂️ 5 Services (haircuts, coloring, styling, treatments)
- 🕒 Business hours for staff members (Mon-Fri 9-5, Sat 10-4, Sun closed)

## Safety Notes:
⚠️ Only run this on your development/test Firebase project
⚠️ This will create real data in your Firestore database
⚠️ Make sure you're connected to the correct Firebase project
