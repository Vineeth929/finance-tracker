# Quick Start Guide - Finance Tracker with Auth

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free)

---

## 🔧 Backend Setup (2 minutes)

```bash
# 1. Go to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Edit .env and add:
#    - MONGODB_URI from MongoDB Atlas
#    - JWT_SECRET (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 5. Start server
npm start
```

✅ Should show: `✅ MongoDB connected` and `🚀 Server running on port 5000`

---

## 🎨 Frontend Setup (2 minutes)

```bash
# 1. Go to root directory
cd ..

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# (Default values are fine for local development)

# 4. Start development server
npm run dev
```

✅ Opens browser at http://localhost:5173

---

## 🧪 Quick Test (1 minute)

1. **Sign Up**
   - Click "Sign up here"
   - Fill in: Name, Email, Password
   - Click "Sign Up"

2. **See Dashboard**
   - You're now logged in!
   - Dashboard fully functional

3. **Profile**
   - Click avatar (top right)
   - Click "Profile Settings"
   - Update name, change password

4. **Logout**
   - Click avatar
   - Click "Log Out"
   - Redirected to login

---

## 📦 Project Structure

```
finance-tracker/
├── backend/           ← Node.js + Express + MongoDB
│   ├── models/       ← Database schemas
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← JWT verification
│   ├── server.js
│   ├── package.json
│   ├── .env          ← Your secrets (DO NOT COMMIT)
│   └── .env.example  ← Template
│
├── src/              ← React frontend
│   ├── components/   ← React components
│   ├── context/      ← Auth state (Context API)
│   ├── hooks/        ← API + custom hooks
│   ├── App.jsx       ← Main router
│   ├── main.jsx
│   └── index.css     ← Tailwind
│
├── SETUP.md          ← Full setup guide
├── IMPLEMENTATION_SUMMARY.md ← What was built
└── QUICKSTART.md     ← This file
```

---

## 🔐 Key Features

- ✅ User registration & login
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Profile management
- ✅ Password change
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Full dashboard access

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to API" | Check backend is running on port 5000 |
| "Invalid credentials" | Check email/password are correct |
| "MongoDB connection failed" | Check MongoDB URI in .env |
| "JWT_SECRET not set" | Add JWT_SECRET to .env |

---

## 📚 Documentation

- **SETUP.md** - Complete step-by-step guide
- **IMPLEMENTATION_SUMMARY.md** - All components built
- **AUTHENTICATION_SETUP.md** - Original setup notes

---

## 🚀 Next Steps

### For Development
1. Keep both servers running
2. Edit files and they auto-reload
3. Open browser console for errors
4. Check terminal for server logs

### For Production
1. Set real MONGODB_URI
2. Generate new JWT_SECRET
3. Build frontend: `npm run build`
4. Deploy backend (Railway/Heroku)
5. Deploy frontend (GitHub Pages)

---

## 💡 Tips

**Debug Auth Issues**
```bash
# Check stored token
localStorage.getItem('authToken')

# Clear storage if stuck
localStorage.clear()
```

**Test API Directly**
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"test123","confirmPassword":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## ✨ You're Ready!

```
Backend:  http://localhost:5000
Frontend: http://localhost:5173
```

Sign up and start tracking your finances! 💰

For detailed help, see `SETUP.md`
