# Booking System

This is a comprehensive booking system built with a mobile-first approach using React Native (Expo) for the frontend and Firebase for the backend services.

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript, NativeWind (Tailwind CSS)
- **Backend**: Firebase (Firestore, Firebase Functions, Firebase Authentication)
- **State Management**: Redux Toolkit, React Query

## Project Structure

- `frontend/`: Contains the Expo-based React Native application for users and staff.
- `firebase_admin/`: Contains Firebase Functions, seeding scripts, and admin-related backend logic.
- `docs/`: Project documentation.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (optional, as you can use `npx expo`)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Booking-System
```

### 2. Installation

This project uses npm workspaces. Install all dependencies from the root directory.

```bash
npm install
```

### 3. Environment Configuration

The frontend requires Firebase configuration to connect to your Firebase project.

- Navigate to the `frontend` directory: `cd frontend`
- Copy the example environment file: `cp .env.example .env`
- Open the `.env` file and fill in your Firebase project's configuration details. You can find these in your Firebase project settings.

```
# .env
EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 4. Database Seeding

To populate your Firestore database with initial data (like services, staff, etc.), run the seeding script.

Make sure your `firebase-admin` service account has the correct permissions.

```bash
cd firebase_admin
npm run seed
```
_Note: For more details on seeding, refer to `frontend/SEEDING_GUIDE.md`._

### 5. Running the Application

#### Frontend (React Native App)

From the `frontend` directory, start the Expo development server.

```bash
cd frontend
npm start
```

This will open the Expo developer tools in your browser. You can then run the app on:
- An iOS or Android simulator.
- The Expo Go app on your physical device.
- A web browser.

#### Backend (Firebase)

The backend logic resides in Firebase. Deploy your functions using the Firebase CLI from the root directory.

```bash
# Make sure you are logged into the correct firebase account
firebase login

# Select your firebase project
firebase use <your-project-id>

# Deploy functions, rules, and indexes
firebase deploy
```

## Available Scripts

### Root
- `npm run client`: Starts the frontend development server.

### Frontend
- `npm start`: Starts the Expo development server.
- `npm run android`: Starts the app on a connected Android device or emulator.
- `npm run ios`: Starts the app on an iOS simulator.
- `npm run web`: Runs the app in a web browser.
- `npm run lint`: Lints the frontend codebase.

### Firebase Admin
- `npm run seed`: Executes the database seeding script.
