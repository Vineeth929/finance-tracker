# Finance Tracker - Complete Setup Guide

## 📋 Overview

This guide provides step-by-step instructions to set up and run the Finance Tracker application with the new authentication system. The app features user registration, login, profile management, and a complete finance tracking dashboard.

---

## 🎯 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

---

## 🔧 Backend Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Environment File

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
# MongoDB (Get connection string from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

# JWT Secret (Generate a random string, min 32 characters)
JWT_SECRET=generate_a_random_secret_string_of_at_least_32_characters_for_security

JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Step 3: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace username and password in the string
7. Paste into `MONGODB_URI` in `.env`

### Step 4: Generate JWT Secret

Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `JWT_SECRET` in `.env`

### Step 5: Start Backend Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## 🎨 Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
cd ..  # Go to root directory
npm install
```

This will install React Router and other dependencies.

### Step 2: Create Frontend Environment File

```bash
cp .env.example .env
```

For **local development**, the default is fine:

```env
VITE_API_URL=http://localhost:5000/api
```

For **production** (GitHub Pages):

```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 3: Start Frontend Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🔐 Testing the Authentication System

### Test 1: Create an Account

1. Open http://localhost:5173
2. Click "Sign up here"
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. You should be redirected to the dashboard

### Test 2: Login

1. Click on the profile icon (top right)
2. Click "Log Out"
3. You should be redirected to login
4. Enter the email and password you just created
5. Click "Log In"

### Test 3: Profile Management

1. Click the profile icon (top right)
2. Click "Profile Settings"
3. Update your name or avatar URL
4. Click "Save Changes"

### Test 4: Change Password

1. Click the profile icon (top right)
2. Click "Profile Settings"
3. Click "Change Password" tab
4. Fill in current and new password
5. Click "Update Password"

### Test 5: API Testing (Optional)

Test signup via curl:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "confirmPassword": "test123"
  }'
```

Test login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js (User schema with password hashing)
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── auth.js (Authentication endpoints)
│   │   ├── transactions.js
│   │   └── budgets.js
│   ├── middleware/
│   │   └── auth.js (JWT verification)
│   ├── server.js (Express app setup)
│   ├── package.json
│   ├── .env (Git ignored)
│   └── .env.example
│
├── src/
│   ├── components/
│   │   ├── Login.jsx (Login page)
│   │   ├── Signup.jsx (Registration page)
│   │   ├── ForgotPassword.jsx (Password reset UI)
│   │   ├── Profile.jsx (Profile & settings)
│   │   ├── ProtectedRoute.jsx (Route protection)
│   │   ├── NavBar.jsx (Navigation with user menu)
│   │   ├── Dashboard.jsx
│   │   ├── AddIncome.jsx
│   │   ├── AddExpense.jsx
│   │   ├── BudgetPlanner.jsx
│   │   ├── Analytics.jsx
│   │   ├── TransactionList.jsx
│   │   ├── SearchFilter.jsx
│   │   └── SmartSuggestions.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx (Auth state management)
│   │
│   ├── hooks/
│   │   ├── useApi.js (API service layer)
│   │   └── useLocalStorage.js
│   │
│   ├── utils/
│   │   └── calculations.js
│   │
│   ├── App.jsx (Router setup)
│   ├── main.jsx
│   ├── index.css
│   ├── package.json
│   ├── .env (Git ignored)
│   └── .env.example
```

---

## 🔌 API Endpoints

### Authentication Endpoints

**POST /api/auth/signup** - Register new user
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
Response: `{ token, user }`

**POST /api/auth/login** - Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `{ token, user }`

**GET /api/auth/me** - Get current user (Protected)
Headers: `Authorization: Bearer {token}`
Response: `{ user }`

**PUT /api/auth/profile** - Update profile (Protected)
```json
{
  "fullName": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```
Response: `{ user }`

**PUT /api/auth/password** - Change password (Protected)
```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```
Response: `{ token, message }`

**POST /api/auth/logout** - Logout (Protected)
Response: `{ message }`

---

## 🔒 Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: 7-day expiration
3. **CORS**: Restricted to allowed origins
4. **Protected Routes**: Middleware-based protection
5. **Token Storage**: Secure localStorage with Bearer tokens
6. **Email Validation**: Unique email constraint in DB
7. **Input Validation**: Server-side validation on all endpoints
8. **Password Requirements**: Minimum 6 characters

---

## 📦 Deployment

### Deploy Backend (Railway / Heroku)

1. **Create account** on Railway or Heroku
2. **Connect GitHub repository**
3. **Set environment variables**:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret (IMPORTANT: Generate a new one for production)
   - `NODE_ENV` = production
4. **Deploy** - Service will auto-deploy on git push

### Deploy Frontend (GitHub Pages)

1. **Update `.env`** with production backend URL:
   ```env
   VITE_API_URL=https://your-railway-backend.com/api
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Update docs folder** (if using GitHub Pages):
   ```bash
   npm run deploy
   ```

4. **Commit and push** to GitHub
5. **Enable GitHub Pages** in repository settings

---

## 🐛 Troubleshooting

### Backend Connection Issues

**Error**: "MongoDB connection failed"
- Check MongoDB URI in `.env`
- Verify MongoDB Atlas network access settings
- Check username/password are correct

**Error**: "JWT_SECRET not set"
- Create `.env` file from `.env.example`
- Generate and add JWT_SECRET

### Frontend Issues

**Error**: "Cannot connect to API"
- Check backend is running on port 5000
- Verify VITE_API_URL in `.env`
- Check CORS settings in `backend/server.js`
- Open browser console for detailed errors

**Error**: "Token expired"
- Clear localStorage: `localStorage.clear()`
- Login again

### Authentication Not Working

**Check list**:
1. Is backend running? (http://localhost:5000/api/health)
2. Is MongoDB connected? (Check backend logs)
3. Is JWT_SECRET set in `.env`?
4. Are you using correct email/password?
5. Check browser console for errors

---

## 📝 API Integration Notes

The frontend uses the `useApi` hook which:

1. **Automatically adds** Authorization header with token
2. **Handles token** from localStorage
3. **Updates context** on successful auth
4. **Redirects** to login on 401 errors

### Using the API Hook

```javascript
import { api } from './hooks/useApi';

// Login
const response = await api.login(email, password);

// Protected request (token added automatically)
const user = await api.getUser(token);

// Transactions
const transactions = await api.getTransactions();
const result = await api.addTransaction(data);
```

---

## 🎓 Key Files to Understand

### Frontend

- **AuthContext.jsx**: Manages auth state and provides useAuth hook
- **ProtectedRoute.jsx**: Wraps routes that require authentication
- **useApi.js**: API service layer with auto token handling
- **App.jsx**: React Router setup with protected routes

### Backend

- **auth.js (middleware)**: JWT verification and user extraction
- **auth.js (routes)**: All authentication endpoints
- **User.js (model)**: User schema with password hashing

---

## 🚀 Next Steps

1. ✅ Set up MongoDB
2. ✅ Configure environment variables
3. ✅ Test authentication flow
4. ✅ Test dashboard functionality
5. ✅ Deploy backend
6. ✅ Deploy frontend

---

## 📞 Support

### Common Issues

1. **"Invalid credentials"** → Check email/password
2. **"Email already registered"** → Use different email
3. **"Network error"** → Check backend is running
4. **"Not authorized"** → Token expired, login again

### Debug Mode

Enable logs in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

Check server logs:
```bash
# Backend logs show all requests
# Frontend browser console shows API calls
```

---

## ✨ Features Implemented

- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Password hashing with bcryptjs
- ✅ Protected routes
- ✅ User profile management
- ✅ Password change functionality
- ✅ Token persistence
- ✅ User avatar support
- ✅ Dark mode preferences
- ✅ CORS configuration
- ✅ Error handling
- ✅ Loading states
- ✅ Mobile responsive design
- ✅ Consistent UI/UX

---

## 📄 License

This project is open source and available under the MIT License.
