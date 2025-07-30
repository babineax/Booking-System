# Booking System 

A  booking system app with Supabase authentication and role-based access control.

## Features

### ✅ Completed Authentication Features

- **User Registration**: Customers can create accounts
- **User Login/Logout**: Email and password authentication  
- **Password Reset**: Email-based password reset functionality
- **Role-Based Access Control**: Support for customer, staff, and admin roles
- **Staff Account Creation**: Admin users can create staff/admin accounts (requires backend implementation)
- **Authentication Guards**: Protected routes based on user roles
- **Session Management**: Persistent authentication state with AsyncStorage
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Comprehensive error handling for auth failures

### User Roles

1. **Customer**: Default role for self-registered users
   - Can make bookings
   - View booking history
   - Manage profile

2. **Staff**: Created by admin users
   - Manage bookings
   - Customer support access

3. **Admin**: Highest privilege level
   - Create staff accounts (requires backend)
   - System administration
   - Full access to all features



## Project Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── login.tsx        # Sign in screen
│   ├── register.tsx     # Customer registration
│   ├── forgot-password.tsx # Password reset
│   └── _layout.tsx      # Auth layout
├── (app)/               # Protected app screens
│   ├── index.tsx        # Dashboard/home screen
│   ├── create-staff.tsx # Staff account creation (admin only)
│   └── _layout.tsx      # App layout
├── _layout.tsx          # Root layout with auth provider
└── index.tsx            # Entry point

components/
├── InputField.tsx       # Reusable input component
└── auth/               # Auth-specific components

contexts/
└── AuthContext.tsx     # Authentication context provider

lib/
├── supabase.ts         # Supabase configuration
└── authGuards.ts       # Authentication guard hooks

types/
└── auth.ts            # Authentication type definitions

.env                    # Environment variables (not in git)
.env.example           # Environment variables template
```

