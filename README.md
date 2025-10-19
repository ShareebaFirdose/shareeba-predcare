# PRED Care Mobile Application

A comprehensive **React Native** healthcare management mobile application built with **TypeScript**. This mobile app connects to the PRED Care backend API and provides a complete doctor and appointment management system with authentication, role-based access control, and intuitive UI.

---

## 📱 Overview

PRED Care Mobile is a full-featured healthcare management application that allows administrators and medical staff to manage doctors, appointments and availability schedules. The app features a modern, user-friendly interface with real-time data synchronization with the backend API.

---

## ✨ Features

### 🔐 Authentication System
- Secure login and registration
- JWT token-based authentication
- Role-based access control (Admin, Doctor, Patient)
- Persistent login sessions
- Profile management
- Password change functionality

### 👨‍⚕️ Doctor Management
- View all doctors with search and filter
- Add new doctors with detailed information
- Update doctor profiles
- Delete doctors (Admin only)
- Status management (Active/Inactive)
- Specialization tracking
- License number verification
- Pull-to-refresh functionality

### 📅 Availability Management
- Set doctor availability schedules
- Recurring weekly schedules
- Specific date availability
- Leave/time-off management
- Multiple time slots per day
- Configurable slot duration (15, 30, 45, 60 minutes)
- Consultation type selection (In-person, Video, Both)
- Fee management for different consultation types

### 📊 Dashboard
- Quick statistics overview
- Total doctors, patients, appointments, and staff count
- Quick action buttons
- Navigation to all major features
- Professional UI with card-based layout

### 👤 Profile Management
- View and update user profile
- Change personal information
- Contact details management
- Account settings

---

## 🛠 Tech Stack

- **Framework:** React Native 0.82+
- **Language:** TypeScript
- **Navigation:** React Navigation v6
  - Native Stack Navigator
  - Bottom Tab Navigator
  - Drawer Navigator
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Storage:** React Native Encrypted Storage
- **UI Components:** Custom components with modern design
- **Icons:** React Native Vector Icons
- **Safe Area:** React Native Safe Area Context

---

## 📦 Installed Packages

### Core Dependencies
```bash
# Navigation
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
@react-navigation/drawer
react-native-screens
react-native-safe-area-context
react-native-gesture-handler

# Networking
axios

# Storage
react-native-encrypted-storage

# Icons
react-native-vector-icons
```

### Installation Commands
```bash
# Install all dependencies
yarn install

# Or using npm
npm install

# iOS specific (Mac only)
cd ios && pod install && cd ..
```

---

## 📁 Project Structure

```
Predcare/
├── android/                        # Android native project
├── ios/                            # iOS native project
├── src/                            # Source code
│   ├── assets/                     # Images, fonts, icons
│   ├── components/                 # Reusable components
│   │   └── common/                 # Common UI components
│   ├── modules/                    # Feature modules
│   │   ├── auth/                   # Authentication module
│   │   │   ├── LoginScreen.tsx     # Login screen
│   │   │   └── RegisterScreen.tsx  # Registration screen
│   │   ├── dashboard/              # Dashboard module
│   │   │   └── DashboardScreen.tsx # Main dashboard
│   │   ├── doctors/                # Doctors module
│   │   │   ├── DoctorListScreen.tsx       # List all doctors
│   │   │   ├── AddDoctorScreen.tsx        # Add new doctor
│   │   │   └── DoctorAvailabilityScreen.tsx # Manage availability
│   │   └── profile/                # Profile module
│   │       └── ProfileScreen.tsx   # User profile
│   ├── navigation/                 # Navigation setup
│   │   ├── stacks/                 # Navigation stacks
│   │   │   ├── AuthStack.tsx       # Auth flow navigation
│   │   │   ├── DashboardStack.tsx  # Dashboard navigation
│   │   │   ├── DoctorStack.tsx     # Doctor module navigation
│   │   │   └── RootNavigator.tsx   # Root navigation logic
│   │   └── AppNavigator.tsx        # Main navigator
│   ├── context/                    # React Context
│   │   └── AuthContext.tsx         # Authentication context
│   ├── services/                   # API services
│   │   └── api.ts                  # API configuration
│   ├── types/                      # TypeScript types
│   │   └── index.ts                # Type definitions
│   └── utils/                      # Utility functions
│       └── helpers.ts              # Helper functions
├── App.tsx                         # App entry point
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or Yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - Mac only)
- PRED Care Backend API running

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Predcare
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Install iOS dependencies (Mac only)**
```bash
cd ios
pod install
cd ..
```

4. **Configure API endpoint**

Update the API base URL in your screens (or create a config file):
```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';
// Example: 'http://192.168.1.100:5000/api'
```

5. **Run the application**

**Android:**
```bash
npx react-native run-android
# or
yarn android
```

**iOS (Mac only):**
```bash
npx react-native run-ios
# or
yarn ios
```

---

## 🔑 Default Login Credentials

### Admin Account
```
Email: admin@predcare.com
Password: Admin@123
```

### Test User Account
```
Email: shareeba@gmail.com
Password: shareeba
```

> **Note:** Make sure to create these accounts in the backend first, or register through the app.

---

## 🎨 Screens Overview

### 1. **LoginScreen**
- Email and password input
- Form validation
- JWT token storage
- Automatic navigation on successful login
- Error handling with alerts

### 2. **DashboardScreen**
- Welcome header with user name
- Quick statistics cards
  - Total doctors
  - Total patients
  - Today's appointments
  - Active staff
- Feature cards with navigation
  - Doctors management
  - Patients
  - Appointments
  - Staff
- Quick action buttons
- Logout functionality

### 3. **DoctorListScreen**
- Search functionality
- Filter by specialization and status
- Pull-to-refresh
- Doctor cards with:
  - Avatar with initials
  - Name and email
  - Status badge (Active/Inactive)
  - Specialization
  - License number
  - Clinic name
  - Phone number
- Action buttons:
  - Manage availability
  - Delete doctor
- Empty state with add button

### 4. **AddDoctorScreen**
- Comprehensive form with sections:
  - **Basic Information:**
    - Name (required)
    - Email (required)
    - Phone number
    - Status toggle (Active/Inactive)
  - **Professional Information:**
    - Specialization (required)
    - License number (required)
    - Primary clinic
    - Address (multiline)
- Form validation
- Loading states
- Success/error alerts
- Auto-navigation on success

### 5. **DoctorAvailabilityScreen**
- Clinic selection
- Availability type options:
  - **Specific Date:** One-time availability
  - **Recurring:** Weekly schedule
  - **Leave:** Time off period
- Day selection (Mon-Sun)
- Multiple time slot management
- Slot duration selection (15/30/45/60 min)
- Consultation type:
  - In-person
  - Video consultation
  - Both
- Fee management for each consultation type
- Dynamic form based on availability type

### 6. **ProfileScreen**
- View user information
- Edit personal details
- Update contact information
- Save changes with validation

---

## 🔧 Configuration

### API Configuration

Create a `src/config/api.ts` file:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
```

### Environment Variables

Create a `.env` file:
```env
API_BASE_URL=http://192.168.1.100:5000/api
API_TIMEOUT=10000
```

---

## 🎯 Key Features Implementation

### Authentication Flow
```typescript
// Login process
1. User enters credentials
2. App sends POST request to /api/auth/login
3. Backend returns JWT token and user data
4. Token stored in secure storage
5. User navigated to Dashboard
6. Token included in subsequent API calls

// Logout process
1. User clicks logout
2. Token removed from storage
3. User state cleared from context
4. Navigation reset to Login screen
```

### Doctor Management Flow
```typescript
// Add Doctor
1. Navigate to AddDoctorScreen
2. Fill form with doctor details
3. Validate required fields
4. POST to /api/doctors with auth token
5. Show success/error message
6. Navigate back on success

// Delete Doctor
1. User clicks delete on doctor card
2. Confirmation alert shown
3. DELETE to /api/doctors/:id
4. Refresh doctor list
5. Show success message
```

### Availability Management
```typescript
// Set Availability
1. Select doctor
2. Choose availability type
3. Select days (recurring) or dates
4. Add time slots
5. Set consultation type and fees
6. POST to /api/availability
7. Navigate back on success
```

---

## 🎨 UI/UX Features

- **Modern Design:** Clean, professional healthcare-focused interface
- **Responsive Layout:** Adapts to different screen sizes
- **Loading States:** Activity indicators during API calls
- **Error Handling:** User-friendly error messages
- **Form Validation:** Real-time input validation
- **Pull-to-Refresh:** Refresh data with pull gesture
- **Touch Feedback:** Visual feedback on button presses
- **Status Indicators:** Color-coded status badges
- **Empty States:** Helpful messages when no data
- **Confirmation Dialogs:** For destructive actions

---

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **Encrypted Storage:** Sensitive data encryption
- **Role-Based Access:** Feature access based on user role
- **Token Expiration Handling:** Auto-logout on token expiry
- **Secure API Calls:** HTTPS recommended for production
- **Input Sanitization:** Validation of all user inputs

---

## 📱 Platform-Specific Notes

### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 31+
- Permissions: Internet access
- Network security config for HTTP (development only)

### iOS
- Minimum iOS: 11.0
- App Transport Security configured for HTTP (development only)
- Required capabilities: Network

---

## 🐛 Troubleshooting

### Common Issues

**1. Cannot connect to backend**
```bash
# Check if backend is running
# Verify API_BASE_URL is correct
# Use your computer's local IP, not localhost
# Android emulator: use 10.0.2.2:5000
# iOS simulator: use localhost:5000
# Physical device: use computer's local IP (192.168.x.x)
```

**2. Metro bundler issues**
```bash
# Clear cache
npx react-native start --reset-cache

# Or
rm -rf node_modules
yarn install
```

**3. Android build errors**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**4. iOS build errors (Mac only)**
```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

**5. Token expiration**
- App automatically logs out on token expiration
- User needs to login again
- Implement refresh token for better UX

---

## 🚀 Deployment

### Android APK Build
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build (Mac only)
```bash
# Open in Xcode
open ios/Predcare.xcworkspace

# Configure signing and build for release
# Product > Archive
```

---

## 🔄 API Integration

### Authentication Endpoints
```typescript
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
PUT /api/auth/profile
PUT /api/auth/change-password
```

### Doctor Endpoints
```typescript
GET /api/doctors
GET /api/doctors/:id
POST /api/doctors (Admin only)
PUT /api/doctors/:id (Admin only)
DELETE /api/doctors/:id (Admin only)
GET /api/doctors/stats
```

### Availability Endpoints
```typescript
GET /api/availability/doctor/:doctorId
POST /api/availability (Admin/Doctor)
PUT /api/availability/:id (Admin/Doctor)
DELETE /api/availability/:id (Admin/Doctor)
POST /api/availability/bulk (Admin/Doctor)
```

---

## 📈 Future Enhancements

- [ ] Patient management module
- [ ] Appointment booking system
- [ ] Real-time notifications (Push notifications)
- [ ] Video consultation integration
- [ ] Medical records management
- [ ] Prescription module
- [ ] Payment integration
- [ ] Chat functionality
- [ ] Calendar view for appointments
- [ ] Reports and analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline mode with local storage
- [ ] Biometric authentication
- [ ] QR code scanning

---


---

---

## 🔍 Quick Reference

### Running Commands
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Build Android APK
cd android && ./gradlew assembleRelease

# Clear cache
npm start -- --reset-cache
```

### Useful Scripts
Add these to `package.json`:
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "clean": "cd android && ./gradlew clean && cd ..",
    "clean-ios": "cd ios && xcodebuild clean && cd .."
  }
}
```

 