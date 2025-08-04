# Booking System Backend API

A comprehensive REST API for a booking system built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Customer, Staff, and Admin roles
- **Service Management**: CRUD operations for services
- **Booking System**: Complete booking lifecycle management
- **Business Hours**: Staff availability management
- **Authentication**: JWT-based authentication with role-based access control

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/booking-system
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:3000
   ```

4. Seed the database with initial data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication & Users

#### Public Routes
- `POST /api/users` - Register new user
- `POST /api/users/auth` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/staff` - Get all staff members

#### Protected Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Admin Routes
- `GET /api/users` - Get all users

### Services

#### Public Routes
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category

#### Admin Routes
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete/deactivate service

### Bookings

#### Public Routes
- `GET /api/bookings/available-slots` - Get available time slots

#### Customer Routes
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking

#### Staff/Admin Routes
- `GET /api/bookings` - Get all bookings (filtered by role)
- `PUT /api/bookings/:id/status` - Update booking status

### Business Hours

#### Public Routes
- `GET /api/business-hours` - Get all staff business hours
- `GET /api/business-hours/:staffId` - Get business hours for specific staff

#### Staff/Admin Routes
- `POST /api/business-hours` - Set business hours

## Data Models

### User Model
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  role: ['customer', 'staff', 'admin'],
  isAdmin: Boolean,
  isActive: Boolean,
  specialties: [String], 
  bio: String, 
  preferences: Object 
}
```

### Service Model
```javascript
{
  name: String,
  description: String,
  duration: Number, // in minutes
  price: Number,
  category: ['haircut', 'coloring', 'styling', 'treatment', 'consultation', 'other'],
  isActive: Boolean,
  staffMembers: [ObjectId] /
}
```

### Booking Model
```javascript
{
  customer: ObjectId, 
  service: ObjectId, 
  staffMember: ObjectId, 
  appointmentDate: Date,
  startTime: String, 
  endTime: String, 
  status: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
  notes: String,
  customerNotes: String,
  totalPrice: Number,
  paymentStatus: ['pending', 'paid', 'refunded'],
  reminderSent: Boolean
}
```

### Business Hours Model
```javascript
{
  dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  isOpen: Boolean,
  openTime: String, 
  closeTime: String, 
  breakStart: String, 
  breakEnd: String, 
  staffMember: ObjectId 
}
```

## User Roles & Permissions

### Customer
- Create bookings
- View their own bookings
- Cancel bookings (with 24-hour notice)
- Update their profile

### Staff
- View their assigned bookings
- Update booking status
- Set their business hours
- View customer details for their bookings

### Admin
- All staff permissions
- Manage services (CRUD)
- View all bookings
- Manage users
- Override booking restrictions

## Sample Data

After running `npm run seed`, you'll have:

**Login Credentials:**
- Admin: `admin@booking.com` / `admin123`
- Staff (Sarah): `sarah@booking.com` / `staff123`
- Staff (Mike): `mike@booking.com` / `staff123`
- Customer: `john@example.com` / `customer123`

**Services:**
- Basic Haircut (60 min, $45)
- Premium Cut & Style (90 min, $75)
- Hair Coloring (180 min, $120)
- Beard Trim (30 min, $25)
- Consultation (30 min, $15)

## API Usage Examples

### Register a new customer
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_doe",
    "email": "jane@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1234567893"
  }'
```

### Get available time slots
```bash
curl "http://localhost:5000/api/bookings/available-slots?date=2024-08-10&serviceId=SERVICE_ID&staffMemberId=STAFF_ID"
```

### Create a booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": "SERVICE_ID",
    "staffMemberId": "STAFF_ID",
    "appointmentDate": "2024-08-10",
    "startTime": "10:00",
    "customerNotes": "First time customer"
  }'
```

## Error Handling

The API uses consistent error response format:
```javascript
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Scripts
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run dev` - Start development server with nodemon


### Project Structure
```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/           # Route controllers
│   ├── userController.js
│   ├── serviceController.js
│   ├── bookingController.js
│   └── businessHoursController.js
├── middlewares/           # Custom middleware
│   ├── asyncHandler.js
│   └── authMiddleware.js
├── models/               # Mongoose models
│   ├── userModel.js
│   ├── serviceModel.js
│   ├── bookingModel.js
│   └── businessHoursModel.js
├── routes/               # Express routes
│   ├── userRoutes.js
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   └── businessHoursRoutes.js
├── utils/                # Utility functions
│   └── createToken.js
├── seed.js               # Database seeding script
└── server.js             # Main application file
```


