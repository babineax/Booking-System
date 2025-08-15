# Firebase Migration Guide

This document outlines the migration from the REST API backend to Firebase.

## Overview

The application has been migrated from a Node.js/Express/MongoDB backend to Firebase (Authentication + Firestore). The migration includes:

1. **Firebase Authentication** - Replaces custom JWT authentication
2. **Firestore Database** - Replaces MongoDB
3. **Firebase Client SDK** - Replaces REST API calls
4. **New Redux API Slices** - Firebase-specific API management

## Environment Setup

### Required Environment Variables

Add the following to your `.env` file:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Migration Features

### 1. Authentication
- **Before**: Custom JWT with username/email/password
- **After**: Firebase Authentication with email/password
- **Changes**: 
  - Automatic session management
  - Better security with Firebase tokens
  - Built-in password reset functionality

### 2. Data Models

#### Users Collection (`users`)
```javascript
{
  id: string (Firebase Auth UID)
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'customer' | 'staff' | 'admin'
  isAdmin: boolean
  isActive: boolean
  specialties?: string[] (for staff)
  bio?: string (for staff)
  preferences?: object (for customers)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Services Collection (`services`)
```javascript
{
  id: string
  name: string
  description: string
  duration: number (minutes)
  price: number
  category: 'haircut' | 'coloring' | 'styling' | 'treatment' | 'consultation' | 'other'
  isActive: boolean
  staffMembers: string[] (user IDs)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Bookings Collection (`bookings`)
```javascript
{
  id: string
  customerId: string
  serviceId: string
  staffMemberId: string
  appointmentDate: timestamp
  startTime: string ("HH:MM")
  endTime: string ("HH:MM")
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  customerNotes?: string
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  reminderSent: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Business Hours Collection (`businessHours`)
```javascript
{
  id: string
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isOpen: boolean
  openTime?: string ("HH:MM")
  closeTime?: string ("HH:MM")
  breakStart?: string ("HH:MM")
  breakEnd?: string ("HH:MM")
  staffMemberId: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Migration

### Old vs New API Usage

#### Authentication
```javascript
// Before (REST API)
import { useLoginMutation } from '../redux/apis/usersApiSlice';

// After (Firebase)
import { useLoginMutation } from '../redux/apis/firebaseUsersApiSlice';
```

#### Services
```javascript
// Before (REST API)
import { useGetServicesQuery } from '../redux/apis/servicesApiSlice';

// After (Firebase)
import { useGetServicesQuery } from '../redux/apis/firebaseServicesApiSlice';
```

#### Bookings
```javascript
// Before (REST API)
import { useCreateBookingMutation } from '../redux/apis/bookingsApiSlice';

// After (Firebase)
import { useCreateBookingMutation } from '../redux/apis/firebaseBookingsApiSlice';
```

### New Firebase Service APIs

Direct service usage (for custom logic):

```javascript
import { 
  userService, 
  serviceService, 
  bookingService, 
  businessHoursService 
} from '../firebase/services';

// Example: Direct service usage
const user = await userService.getUserById(userId);
const services = await serviceService.getActiveServices();
const bookings = await bookingService.getBookingsByDate(new Date());
```

## Key Changes

### 1. Authentication Flow
- No more custom JWT tokens
- Firebase handles authentication state automatically
- Use `AuthProvider` for auth state management

### 2. Data Queries
- Real-time updates with Firestore listeners (can be added)
- Better offline support
- Automatic caching with Redux Toolkit Query

### 3. Security
- Firestore Security Rules replace server-side middleware
- Client-side validation with Firebase Auth

### 4. File Structure
```
firebase/
├── config.ts                     # Firebase configuration
├── AuthProvider.js              # Authentication context
└── services/
    ├── index.ts                 # Service exports
    ├── userService.ts           # User management
    ├── serviceService.ts        # Service management
    ├── bookingService.ts        # Booking management
    └── businessHoursService.ts  # Business hours management

src/redux/apis/
├── firebaseUsersApiSlice.js     # Firebase users API
├── firebaseServicesApiSlice.js  # Firebase services API
├── firebaseBookingsApiSlice.js  # Firebase bookings API
└── firebaseBusinessHoursApiSlice.js # Firebase business hours API
```

## Migration Steps

### Phase 1: Setup Firebase (Completed)
- ✅ Firebase project configuration
- ✅ Authentication setup
- ✅ Firestore database creation
- ✅ Service layer implementation
- ✅ Redux API slices creation

### Phase 2: Update Components
1. Replace old API imports with Firebase API slices
2. Update authentication flows
3. Update form submissions
4. Test all functionality

### Phase 3: Remove Old Backend Dependencies
1. Remove REST API calls
2. Remove old API slices
3. Clean up unused imports
4. Update environment variables

### Phase 4: Testing & Optimization
1. Test all user flows
2. Add error handling
3. Implement offline support
4. Add real-time features

## Usage Examples

### Authentication
```javascript
import { useLoginMutation } from '../redux/apis/firebaseUsersApiSlice';

const [login, { isLoading, error }] = useLoginMutation();

const handleLogin = async (credentials) => {
  try {
    const result = await login(credentials).unwrap();
    // User is automatically logged in via AuthProvider
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Creating a Booking
```javascript
import { useCreateBookingMutation } from '../redux/apis/firebaseBookingsApiSlice';

const [createBooking] = useCreateBookingMutation();

const handleCreateBooking = async (bookingData) => {
  try {
    const booking = await createBooking(bookingData).unwrap();
    console.log('Booking created:', booking);
  } catch (error) {
    console.error('Failed to create booking:', error);
  }
};
```

### Getting Services
```javascript
import { useGetActiveServicesQuery } from '../redux/apis/firebaseServicesApiSlice';

const ServicesComponent = () => {
  const { data: services, isLoading, error } = useGetActiveServicesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {services?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
};
```

## Next Steps

1. **Update App Components**: Replace old API usage with Firebase APIs
2. **Add AuthProvider**: Wrap your app with the AuthProvider
3. **Test Migration**: Verify all functionality works
4. **Add Firestore Security Rules**: Implement proper security
5. **Optimize Performance**: Add real-time listeners where needed

## Support

For questions or issues during migration, refer to:
- Firebase Documentation: https://firebase.google.com/docs
- Redux Toolkit Query: https://redux-toolkit.js.org/rtk-query/overview
- This migration guide for specific implementation details
