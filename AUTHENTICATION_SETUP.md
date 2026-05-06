# Finance Tracker - Authentication System Setup Guide

## 📋 Overview

This guide provides complete implementation details for the authentication system integrated into the Finance Tracker application.

## ✅ Completed Files

### Backend Files Created:
1. **`backend/models/User.js`** - MongoDB User schema with password hashing
2. **`backend/routes/auth.js`** - Authentication API endpoints
3. **`backend/middleware/auth.js`** - JWT authentication middleware
4. **Updated `backend/server.js`** - Added auth routes
5. **Updated `backend/package.json`** - Added bcryptjs & jsonwebtoken

### Frontend Files Created:
1. **`src/context/AuthContext.jsx`** - Auth state management
2. **`src/components/Login.jsx`** - Login page with form validation
3. **`src/components/Signup.jsx`** - Signup page with validation
4. **`src/components/Profile.jsx`** - User profile management
5. **Updated `src/hooks/useApi.js`** - Auth API service layer

## 🚀 Installation Steps

### Backend Setup

**Step 1: Install Dependencies**
```bash
cd D:\finance-tracker\backend
npm install
```

**Step 2: Update .env file**
Add these environment variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
PORT=5000
```

**Step 3: Start Backend**
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

**Step 1: Create ProtectedRoute Component**
Create `src/components/ProtectedRoute.jsx`:
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Step 2: Update App.jsx**
Replace the current App.jsx with router setup:
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import SearchFilter from './components/SearchFilter';
import BudgetPlanner from './components/BudgetPlanner';
import Analytics from './components/Analytics';
import TransactionList from './components/TransactionList';
import NavBar from './components/NavBar';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Navigate to="/" />} element={<Login />} />
        <Route path="/signup" element={<Navigate to="/" />} element={<Signup />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* ... other protected routes ... */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
```

**Step 3: Update NavBar Component**
Add user profile dropdown to existing NavBar:
```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// In your NavBar component, add this user menu section:
const { user, logout } = useAuth();
const navigate = useNavigate();
const [showProfileMenu, setShowProfileMenu] = useState(false);

return (
  <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-600">💰 Finance Tracker</h1>
      
      <div className="flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)} className="btn btn-secondary">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full" />
            ) : (
              user?.fullName?.charAt(0).toUpperCase() || '👤'
            )}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <p className="font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                👤 Profile Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);
```

**Step 4: Install Frontend Dependencies**
```bash
cd D:\finance-tracker
npm install react-router-dom
npm run dev
```

## 🔌 API Endpoints

### Authentication Endpoints

**POST /api/auth/signup**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**GET /api/auth/me** (Protected)
- Headers: `Authorization: Bearer {token}`

**PUT /api/auth/profile** (Protected)
```json
{
  "fullName": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "darkMode": true,
    "currency": "USD"
  }
}
```

**PUT /api/auth/password** (Protected)
```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**POST /api/auth/logout** (Protected)

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: 7-day expiration by default
3. **CORS**: Configured for allowed origins
4. **Protected Routes**: Middleware-based route protection
5. **Token Storage**: Secure localStorage with Bearer token
6. **Email Validation**: Unique email constraint in DB
7. **Password Requirements**: Minimum 6 characters

## 📁 Complete Folder Structure

```
finance-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js (NEW)
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── auth.js (NEW)
│   │   ├── transactions.js
│   │   └── budgets.js
│   ├── middleware/
│   │   └── auth.js (NEW)
│   ├── server.js (UPDATED)
│   ├── package.json (UPDATED)
│   └── .env.example
│
├── src/
│   ├── components/
│   │   ├── Login.jsx (NEW)
│   │   ├── Signup.jsx (NEW)
│   │   ├── Profile.jsx (NEW)
│   │   ├── ProtectedRoute.jsx (NEW)
│   │   ├── NavBar.jsx (UPDATED)
│   │   ├── App.jsx (UPDATED)
│   │   ├── Dashboard.jsx
│   │   ├── AddIncome.jsx
│   │   ├── AddExpense.jsx
│   │   ├── BudgetPlanner.jsx
│   │   ├── Analytics.jsx
│   │   ├── SearchFilter.jsx
│   │   └── TransactionList.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx (NEW)
│   │
│   ├── hooks/
│   │   ├── useApi.js (UPDATED)
│   │   └── useLocalStorage.js
│   │
│   ├── utils/
│   │   └── calculations.js
│   │
│   └── App.jsx (Router setup)
```

## 🧪 Testing Authentication

### Test Signup
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

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {your_token_here}"
```

## 🎨 Design Consistency

The authentication pages maintain the existing design language:
- **Colors**: Blue (#blue-600) primary, gray secondary
- **Components**: Cards, buttons, inputs styled consistently
- **Spacing**: Tailwind spacing scale
- **Typography**: Matching font weights and sizes
- **Dark Mode**: Full support with dark: classes
- **Responsive**: Mobile-first design
- **Icons**: Emoji-based for consistency

## 📦 Environment Variables (.env.example)

```
# Backend
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/finance-tracker
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
PORT=5000

# Frontend (.env in root)
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Railway)
1. Push changes to GitHub
2. Railway auto-deploys with new auth routes
3. Set JWT_SECRET in Railway environment

### Frontend (GitHub Pages)
1. Run `npm run build`
2. Update docs folder
3. Commit and push
4. GitHub Pages auto-updates

## ✨ Features Included

- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Password hashing with bcryptjs
- ✅ Protected routes
- ✅ User profile management
- ✅ Password change functionality
- ✅ Token persistence
- ✅ Automatic token refresh
- ✅ User avatar support
- ✅ Dark mode preferences
- ✅ CORS configuration
- ✅ Error handling
- ✅ Loading states
- ✅ Success notifications
- ✅ Mobile responsive design
- ✅ Consistent UI/UX

## 🔍 Next Steps

1. Install dependencies
2. Configure MongoDB connection
3. Set up JWT secret
4. Create ProtectedRoute component
5. Update App.jsx with routing
6. Update NavBar with user menu
7. Test authentication flow
8. Deploy backend to Railway
9. Deploy frontend to GitHub Pages

## 📞 Support

For any issues with authentication:
1. Check MongoDB connection
2. Verify JWT_SECRET is set
3. Check CORS configuration
4. Verify token in localStorage
5. Check browser console for errors
