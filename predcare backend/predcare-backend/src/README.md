# PRED Care Backend API

A comprehensive healthcare management system backend built with Node.js, Express, and MySQL. This API provides authentication, doctor management, appointment scheduling, and availability management features for the PRED Care Mobile Application.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Doctor, Patient)
- Password encryption with bcrypt
- Profile management
- Password change functionality

### 👨‍⚕️ Doctor Management
- CRUD operations for doctor profiles
- Specialization tracking
- License number management
- Status management (Active/Inactive)
- Doctor statistics
- Search and filter functionality

### 📅 Availability Management
- Weekly schedule management
- Time slot configuration
- Doctor availability tracking
- Recurring and specific date availability
- Leave/time-off management
- Bulk schedule updates

### 📆 Appointment System
- Appointment booking
- Status tracking (scheduled, confirmed, cancelled, completed)
- Patient and doctor relationship management

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **Database Driver:** mysql2

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MySQL (v8.x or higher)
- Git

---

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd predcare-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Install required packages**
```bash
npm install express cors dotenv mysql2 bcryptjs jsonwebtoken
```

---

## ⚙️ Configuration

1. **Create a `.env` file in the root directory**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=predcare_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=*
```

2. **Update the `.env` file with your credentials**
   - Replace `your_password_here` with your MySQL password
   - Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🗄️ Database Setup

1. **Create the database**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE predcare_db;
USE predcare_db;
```

2. **The application will automatically create the required tables on startup:**
   - `users` - User accounts and authentication
   - `doctors` - Doctor profiles and information
   - `availability` - Doctor availability schedules
   - `appointments` - Appointment records

3. **Verify tables were created**
```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE doctors;
DESCRIBE availability;
DESCRIBE appointments;
```

---

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

### Access Points
- **Local:** `http://localhost:5000`
- **Network (for mobile):** `http://YOUR_LOCAL_IP:5000`
  - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Example: `http://192.168.1.100:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

For mobile development:
```
http://192.168.1.100:5000/api
```

---

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "1234567890",
  "role": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "patient",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "1234567890",
    "role": "patient",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "phone": "9876543210"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### Get All Users (Admin Only)
```http
GET /api/auth/users?role=patient&search=john
Authorization: Bearer <token>
```

#### Delete User (Admin Only)
```http
DELETE /api/auth/users/:id
Authorization: Bearer <token>
```

---

### Doctor Endpoints

#### Get All Doctors
```http
GET /api/doctors?status=Active&specialization=Cardiology&search=john
```

**Query Parameters:**
- `status` - Filter by Active/Inactive
- `specialization` - Filter by specialization
- `search` - Search by name, email, or specialization

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "specialization": "Cardiology",
      "license_number": "LIC123456",
      "status": "Active",
      "primary_clinic": "PRED CLINIC"
    }
  ]
}
```

#### Get Doctor by ID
```http
GET /api/doctors/:id
```

#### Get Doctor Statistics
```http
GET /api/doctors/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_doctors": 12,
    "active_doctors": 10,
    "inactive_doctors": 2,
    "total_specializations": 8
  }
}
```

#### Create Doctor (Admin Only)
```http
POST /api/doctors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "specialization": "Cardiology",
  "license_number": "LIC123456",
  "address": "123 Medical Center",
  "status": "Active",
  "primary_clinic": "PRED CLINIC"
}
```

#### Update Doctor (Admin Only)
```http
PUT /api/doctors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Jane Smith Updated",
  "status": "Active"
}
```

#### Delete Doctor (Admin Only)
```http
DELETE /api/doctors/:id
Authorization: Bearer <token>
```

---

### Availability Endpoints

#### Get Doctor Availability
```http
GET /api/availability/doctor/:doctorId
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "doctor_id": 1,
      "day_of_week": "Monday",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "is_available": true
    }
  ]
}
```

#### Get Availability by ID
```http
GET /api/availability/:id
```

#### Get All Availability (Admin/Doctor Only)
```http
GET /api/availability?doctor_id=1&day_of_week=Monday
Authorization: Bearer <token>
```

#### Set Doctor Availability (Admin/Doctor Only)
```http
POST /api/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor_id": 1,
  "day_of_week": "Monday",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "is_available": true
}
```

#### Bulk Set Availability (Admin/Doctor Only)
```http
POST /api/availability/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor_id": 1,
  "schedule": [
    {
      "day_of_week": "Monday",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "is_available": true
    },
    {
      "day_of_week": "Tuesday",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "is_available": true
    }
  ]
}
```

#### Update Availability (Admin/Doctor Only)
```http
PUT /api/availability/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "start_time": "10:00:00",
  "end_time": "18:00:00"
}
```

#### Delete Availability (Admin/Doctor Only)
```http
DELETE /api/availability/:id
Authorization: Bearer <token>
```

---

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## 📁 Project Structure

```
predcare-backend/
├── src/
│   ├── config/
│   │   └── database.js              # Database configuration and connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── doctorController.js      # Doctor management logic
│   │   └── availabilityController.js # Availability management logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── models/
│   │   ├── userModel.js             # User database operations
│   │   ├── doctorModel.js           # Doctor database operations
│   │   └── availabilityModel.js     # Availability database operations
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── doctorRoutes.js          # Doctor routes
│   │   └── availabilityRoutes.js    # Availability routes
│   └── server.js                    # Main application entry point
├── .env                             # Environment variables (not in git)
├── .gitignore                       # Git ignore configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

---

## 🔒 Security Features

- **Password Hashing:** Passwords hashed using bcrypt with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **Role-Based Access Control:** Different permissions for Admin, Doctor, Patient
- **Input Validation:** All endpoints validate input data
- **SQL Injection Prevention:** Parameterized queries using mysql2
- **CORS Configuration:** Configurable cross-origin resource sharing
- **Token Expiration:** Automatic token expiration (7 days default)

---

## 🔑 Default Accounts

### Create Admin Account
```bash
POST /api/auth/register
{
  "email": "admin@predcare.com",
  "password": "Admin@123",
  "full_name": "System Administrator",
  "role": "admin"
}
```

### Test User Account
```bash
POST /api/auth/register
{
  "email": "shareeba@gmail.com",
  "password": "shareeba",
  "full_name": "Shareeba",
  "role": "patient"
}
```

---

## 🐛 Troubleshooting

### Database Connection Issues
**Problem:** Cannot connect to database

**Solutions:**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE predcare_db;`
- Check MySQL port: `SHOW VARIABLES LIKE 'port';`

### Port Already in Use
**Problem:** Error: Port 5000 is already in use

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
PORT=5001
```

### JWT Token Errors
**Problem:** Invalid token or token expired

**Solutions:**
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time (default 7d)
- Verify Authorization header format: `Bearer <token>`
- Re-login to get new token

### CORS Errors
**Problem:** CORS policy blocking requests

**Solutions:**
- Update CORS_ORIGIN in `.env` to allow your frontend origin
- For development: `CORS_ORIGIN=*`
- For production: `CORS_ORIGIN=https://yourdomain.com`

### Module Not Found Errors
**Problem:** Cannot find module 'xyz'

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_password
DB_NAME=predcare_db
JWT_SECRET=your_very_secure_secret_key
CORS_ORIGIN=https://yourdomain.com
```

### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start src/server.js --name predcare-api

# View logs
pm2 logs predcare-api

# Stop application
pm2 stop predcare-api

# Restart application
pm2 restart predcare-api
```

### Using Docker
```dockerfile
# Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t predcare-api .
docker run -p 5000:5000 --env-file .env predcare-api
```

---

## 🔄 Integration with Mobile App

### Configure Mobile App
Update the API base URL in your React Native app:

```typescript
// src/config/api.ts or in your screens
const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

### Network Configuration
- **Development:** Use your local IP address
- **Production:** Use your server domain
- **Android Emulator:** Use `http://10.0.2.2:5000/api`
- **iOS Simulator:** Use `http://localhost:5000/api`

---

## 🎯 Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Using Postman
1. Import the API endpoints
2. Set up environment variables for BASE_URL and TOKEN
3. Test each endpoint with different scenarios

---

## 📈 Future Enhancements

- [ ] Appointment booking system implementation
- [ ] Email notifications (nodemailer)
- [ ] SMS alerts (Twilio integration)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Medical records management
- [ ] Prescription management
- [ ] File upload for documents (multer)
- [ ] Real-time notifications (Socket.io)
- [ ] Analytics dashboard data
- [ ] Multi-language support
- [ ] Rate limiting for API security
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Database migrations system
- [ ] Logging system (Winston)



## 🔍 Quick Reference

### Common Commands
```bash
# Start server
npm start

# Development mode with auto-reload
npm run dev

# Install dependencies
npm install

# Create database
mysql -u root -p
CREATE DATABASE predcare_db;

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check Node version
node --version

# Check npm version
npm --version
```

### Useful Scripts
Add these to `package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```
