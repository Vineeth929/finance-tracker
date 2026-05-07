# Local Testing Guide - Finance Tracker

## Prerequisites
- Node.js 16+ installed
- Both `node_modules` folders populated
- MongoDB connection working (cloud-hosted)

## Quick Start - Run Both Servers

### Terminal 1 - Start Backend API Server
```bash
cd d:\finance-tracker\backend
npm run dev
```

Expected output:
```
🔧 Starting server with NODE_ENV: development
📦 MONGODB_URI configured: true
🔑 JWT_SECRET configured: true
🌍 Markets, News, and Insights routes enabled
✅ Auth routes loaded
✅ Transactions routes loaded
✅ Budgets routes loaded
✅ Goals routes loaded
✅ Markets routes loaded
✅ News routes loaded
✅ Insights routes loaded
🚀 Server running on port 5000
✅ Ready to accept requests
✅ MongoDB connected
```

### Terminal 2 - Start Frontend Dev Server
```bash
cd d:\finance-tracker
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Testing Flows

### 1. Authentication Flow
1. Open http://localhost:5173
2. Click **Sign Up**
3. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. Click **Create Account**
5. **Expected**: Redirected to Dashboard
6. **Debug**: Check browser console for any errors

### 2. Dashboard Test
1. Should show "Welcome Back! 👋"
2. Should attempt to fetch health score (will be empty initially)
3. Should show stat cards: Total Income, Total Expenses, Net Savings, Active Goals
4. Should show empty Recent Activity
5. **Expected**: No crashes, graceful error handling if API fails

### 3. Add Transaction
1. Click **Transactions** in sidebar
2. Click **Add Income** or **Add Expense** button
3. Fill in:
   - Amount: 1000
   - Category: Salary (for income) or Food (for expense)
   - Description: Test transaction
   - Date: Today
4. Click **Add**
5. **Expected**: Transaction appears in list
6. **Debug**: Check Network tab in DevTools for POST request to `/api/transactions`

### 4. Markets Page Test
1. Click **Markets** in sidebar
2. **Expected**: Shows loading skeleton initially
3. **Expected**: Should eventually show:
   - Error message: "Unable to fetch market data. Please try again."
   - This is OK - waiting for Railway backend to deploy
4. **Debug**: Check console for 404 errors to `http://localhost:5000/api/markets/crypto`

### 5. Goals Page Test
1. Click **Goals** in sidebar
2. Click **+ New Goal** button
3. Fill in:
   - Goal Title: Emergency Fund
   - Description: Save for emergencies
   - Target Amount: 50000
   - Deadline: 2025-12-31
4. Click **Create Goal**
5. **Expected**: Goal card appears with progress bar at 0%
6. **Expected**: Shows "0 / ₹50,000"
7. **Debug**: Check console for POST request to `/api/goals`

### 6. Delete Goal Test
1. On Goals page, click **🗑️ Delete Goal** button
2. Confirm deletion in popup
3. **Expected**: Goal disappears from list
4. **Debug**: Check console for DELETE request

### 7. News Page Test
1. Click **News** in sidebar
2. **Expected**: Shows loading skeleton, then error
3. This is expected - waiting for Railway backend
4. **Debug**: Check Network tab for `/api/news` 404

### 8. Budget Page Test
1. Click **Budget** in sidebar
2. Should show empty state since no budget set
3. **Debug**: Check console for any errors

### 9. Analytics Page Test
1. Click **Analytics** in sidebar
2. Should show a chart (uses local data from transactions)
3. Add some transactions and chart should update

### 10. Settings Page Test
1. Click **Settings** in sidebar
2. Toggle **Dark Mode** button
3. **Expected**: UI theme should change
4. Click **📥 Export Data** button
5. **Expected**: Downloads JSON file with transactions and budgets

### 11. Logout Test
1. Click **Logout** button in sidebar
2. **Expected**: Redirected to login page
3. **Debug**: Check localStorage - `authToken` should be cleared

## Debugging Commands

### Check Backend API Health
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"OK","message":"Finance Tracker API is running","mongoConnected":true}
```

### Test Signup (with curl)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test2@example.com","password":"Test123!","confirmPassword":"Test123!"}'
```

### Test Markets API
```bash
curl http://localhost:5000/api/markets/crypto
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to **Network** tab
3. Perform actions and watch requests
4. Check **Console** tab for errors
5. Check **Application** tab for localStorage (`authToken` key)

## Common Issues & Solutions

### Issue: "Cannot GET /api/markets/crypto"
**Cause**: Backend routes not loading
**Solution**: 
1. Check backend console for "✅ Markets routes loaded"
2. Restart backend with `npm run dev`
3. Verify all route files exist in `backend/routes/`

### Issue: Frontend shows blank page
**Cause**: Frontend not loading CSS/JavaScript
**Solution**:
1. Check browser console for errors
2. Clear browser cache: DevTools > Application > Clear site data
3. Hard refresh: Ctrl+Shift+R
4. Restart frontend dev server

### Issue: "Failed to fetch" errors
**Cause**: Frontend/backend not communicating
**Solution**:
1. Verify backend is running on port 5000
2. Verify frontend .env has `VITE_API_URL=http://localhost:5000/api`
3. Check browser console for CORS errors
4. Restart both servers

### Issue: MongoDB connection fails
**Cause**: Network/credential issue
**Solution**:
1. Check `.env` file has correct MongoDB URI
2. Verify MongoDB Atlas allows your IP
3. Test connection: Check backend console for "✅ MongoDB connected"

### Issue: "authToken not found" errors
**Cause**: localStorage not persisting
**Solution**:
1. Check DevTools > Application > Local Storage
2. Ensure localStorage has key `authToken` after login
3. Check if browser is in private/incognito mode (clears localStorage)

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can sign up with email
- [ ] Can log in with credentials
- [ ] Dashboard loads and shows stat cards
- [ ] Can add income transaction
- [ ] Can add expense transaction
- [ ] Can view transaction list
- [ ] Can delete transaction
- [ ] Can create goal
- [ ] Can delete goal
- [ ] Can see analytics chart
- [ ] Can toggle dark mode
- [ ] Can export data
- [ ] Can log out
- [ ] All 404 errors are expected (waiting for Railway)

## Next Steps

1. **Test all flows listed above**
2. **Report any bugs** with:
   - Browser console error messages
   - Network request URLs and status codes
   - Expected vs actual behavior
3. **Once Railway deploys**, these errors will resolve:
   - Markets page will show live crypto prices
   - News page will show finance articles
   - Health score will calculate based on transactions
   - Insights will show spending analysis

## Notes

- Database uses cloud MongoDB, so data persists even after server restarts
- Each signup creates a new user with isolated data
- All API calls require authentication token
- Rate limiting is disabled in development mode
