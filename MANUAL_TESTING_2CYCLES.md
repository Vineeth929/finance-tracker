# Finance Tracker - Manual Testing Guide (2 Complete Cycles)

## Prerequisites
✅ **Backend running on port 5000** with all routes loaded  
✅ **Frontend running on http://localhost:5173/finance-tracker**  
✅ **MongoDB connected**

---

## CYCLE 1: User Registration & Basic Features

### C1.1 - Open App & See Login Page
1. Open browser: **http://localhost:5173/finance-tracker**
2. **Expected:**
   - ✅ Login page appears
   - ✅ "Welcome to Finance Tracker" heading visible
   - ✅ Email & Password input fields
   - ✅ "Sign Up" button link visible

### C1.2 - Sign Up New User
1. Click **"Sign Up"** button
2. Fill form:
   - **Full Name:** `Test User One`
   - **Email:** `testuser1@example.com`
   - **Password:** `Test123!`
   - **Confirm Password:** `Test123!`
3. Click **"Create Account"**
4. **Expected:**
   - ✅ Account created successfully
   - ✅ Redirects to Dashboard
   - ✅ See "Welcome Back! 👋" message

### C1.3 - Dashboard Loads Correctly
1. **Already on Dashboard** from previous step
2. **Verify you see:**
   - ✅ Sidebar on left with menu items:
     - Dashboard (active/highlighted)
     - Transactions
     - Budget
     - Goals
     - Markets
     - News
     - Analytics
     - Settings
   - ✅ Welcome header with greeting & today's date
   - ✅ **Four stat cards:**
     - Total Income: ₹0 (empty initially)
     - Total Expenses: ₹0 (empty initially)
     - Net Savings: ₹0 (empty initially)
     - Active Goals: 0
   - ✅ Financial Health Score card (showing number 0-100 with rating)
   - ✅ Recent Activity section (empty initially)

### C1.4 - Add Income Transaction
1. Click **"Transactions"** in sidebar
2. Click **"Add Income"** button
3. Fill form:
   - **Amount:** `50000`
   - **Category:** Select `Salary`
   - **Description:** `Monthly Salary`
   - **Date:** (Today's date selected)
4. Click **"Add"**
5. **Expected:**
   - ✅ Form closes
   - ✅ Transaction appears in list showing:
     - 📥 Income icon
     - Amount: 50000
     - Category: Salary
     - Description: Monthly Salary
   - ✅ No error messages

### C1.5 - Add Expense Transaction
1. On Transactions page, click **"Add Expense"** button
2. Fill form:
   - **Amount:** `5000`
   - **Category:** Select `Food`
   - **Description:** `Groceries`
   - **Date:** (Today's date)
3. Click **"Add"**
4. **Expected:**
   - ✅ Expense appears in transaction list
   - ✅ Shows 📤 Expense icon
   - ✅ Amount: 5000

### C1.6 - Navigate to Goals Page
1. Click **"Goals"** in sidebar
2. **Expected:**
   - ✅ Goals page loads
   - ✅ "Savings Goals" heading visible
   - ✅ **"+ New Goal"** button visible
   - ✅ Empty state message (no goals yet)

### C1.7 - Create a Saving Goal
1. Click **"+ New Goal"** button
2. Fill form:
   - **Goal Title:** `Emergency Fund`
   - **Description:** `Save 6 months of expenses`
   - **Target Amount:** `300000`
   - **Deadline:** (Set to 1 year from today)
3. Click **"Create Goal"**
4. **Expected:**
   - ✅ Form closes
   - ✅ Goal card appears showing:
     - Title: "Emergency Fund"
     - Progress bar at 0%
     - "₹0 / ₹300,000"
     - "0% Complete"
     - Status badge: "Active"
     - 🗑️ Delete button

### C1.8 - View Markets Page
1. Click **"Markets"** in sidebar
2. **Expected:**
   - ✅ Markets page loads
   - ✅ See loading skeleton or data
   - ✅ If data loads: Shows list of cryptocurrencies with:
     - Crypto name (Bitcoin, Ethereum, etc.)
     - Price in INR
     - 24h change % (green/red)
     - 7-day sparkline chart
   - ⚠️ If still loading: Wait 5 seconds, may show "Unable to fetch market data"

### C1.9 - View News Page
1. Click **"News"** in sidebar
2. **Expected:**
   - ✅ News page loads
   - ✅ Category tabs visible: All, Markets, Crypto, Economy, Business, General
   - ✅ Shows news articles with:
     - Thumbnail image
     - Headline/title
     - Source badge
     - Description
     - Publication date
     - "Read More" link
   - ⚠️ If loading or empty: This is expected initially

### C1.10 - View Analytics Page
1. Click **"Analytics"** in sidebar
2. **Expected:**
   - ✅ Page loads
   - ✅ Shows chart/visualization of transactions
   - ✅ Shows income (50000) and expense (5000) data

### C1.11 - View Budget Page
1. Click **"Budget"** in sidebar
2. **Expected:**
   - ✅ Page loads
   - ✅ Shows budget section (may be empty)
   - ✅ Option to set budget limits

### C1.12 - View Settings Page
1. Click **"Settings"** in sidebar
2. **Expected:**
   - ✅ Page loads
   - ✅ Dark Mode toggle button visible
   - ✅ Export Data button visible
   - ✅ Display preferences options

### C1.13 - Toggle Dark Mode
1. On Settings page, find and click **"Dark Mode"** toggle
2. **Expected:**
   - ✅ Entire app theme changes to dark
   - ✅ Background becomes dark navy (#0f0f23)
   - ✅ Cards become darker with glass effect
   - ✅ Text becomes light colored
   - ✅ Toggle back to verify light mode works

### C1.14 - Delete Transaction
1. Go back to **"Transactions"** page
2. Find the expense transaction (₹5000 - Groceries)
3. Click **delete/trash icon** on that transaction
4. **Expected:**
   - ✅ Transaction disappears from list
   - ✅ List now shows only income transaction

### C1.15 - Delete Goal
1. Go to **"Goals"** page
2. Find the "Emergency Fund" goal card
3. Click **"🗑️ Delete Goal"** button
4. Confirm deletion when prompted
5. **Expected:**
   - ✅ Confirmation dialog appears
   - ✅ Goal card disappears after confirmation
   - ✅ Goals page shows empty state again

### C1.16 - Logout
1. Look for **"Logout"** button (usually in sidebar at bottom)
2. Click **"Logout"**
3. **Expected:**
   - ✅ Redirects to Login page
   - ✅ Session cleared
   - ✅ localStorage authToken cleared (check DevTools > Application)

---

## CYCLE 2: Multiple Transactions, Goals & Full Feature Testing

### C2.1 - Sign Up Second User
1. Open: **http://localhost:5173/finance-tracker**
2. Click **"Sign Up"**
3. Fill form:
   - **Full Name:** `Test User Two`
   - **Email:** `testuser2@example.com`
   - **Password:** `Test123!`
   - **Confirm Password:** `Test123!`
4. Click **"Create Account"**
5. **Expected:**
   - ✅ New account created
   - ✅ Redirects to Dashboard (empty for new user)

### C2.2 - Add Multiple Income Transactions
1. Click **"Transactions"** in sidebar
2. Add first income:
   - Amount: `60000`
   - Category: `Bonus`
   - Description: `Performance Bonus`
   - Click **"Add"**
3. Add second income:
   - Amount: `20000`
   - Category: `Freelance`
   - Description: `Side Project`
   - Click **"Add"**
4. **Expected:**
   - ✅ Both transactions appear in list
   - ✅ Total shown correctly: ₹80,000

### C2.3 - Add Multiple Expense Transactions
1. Add expense 1:
   - Amount: `10000`
   - Category: `Shopping`
   - Description: `Clothes`
   - Click **"Add"**
2. Add expense 2:
   - Amount: `3000`
   - Category: `Transport`
   - Description: `Fuel & Parking`
   - Click **"Add"**
3. Add expense 3:
   - Amount: `8000`
   - Category: `Utilities`
   - Description: `Electricity & Internet`
   - Click **"Add"**
4. **Expected:**
   - ✅ All 3 expenses appear in transaction list
   - ✅ Total expenses: ₹21,000
   - ✅ Dashboard stat cards update:
     - Total Income: ₹80,000
     - Total Expenses: ₹21,000
     - Net Savings: ₹59,000

### C2.4 - Create Multiple Goals
1. Click **"Goals"** in sidebar
2. Create Goal 1:
   - Title: `Vacation Fund`
   - Description: `Trip to Europe`
   - Target: `200000`
   - Click **"Create Goal"**
3. Create Goal 2:
   - Title: `Car Fund`
   - Description: `Save for new car`
   - Target: `1000000`
   - Click **"Create Goal"**
4. Create Goal 3:
   - Title: `Education`
   - Description: `Learning courses`
   - Target: `500000`
   - Click **"Create Goal"**
5. **Expected:**
   - ✅ All 3 goal cards appear in grid
   - ✅ Dashboard shows: "Active Goals: 3"

### C2.5 - Check Dashboard with Data
1. Click **"Dashboard"** in sidebar
2. **Verify displays:**
   - ✅ Welcome header with current date
   - ✅ Financial Health Score updated (should calculate based on transactions)
   - ✅ Stat cards updated:
     - Total Income: ₹80,000
     - Total Expenses: ₹21,000
     - Net Savings: ₹59,000
     - Active Goals: 3
   - ✅ Recent Activity shows latest transactions
   - ✅ Budget Overview section (if budget set)
   - ✅ Smart Insights card with spending recommendations

### C2.6 - Check Markets Page (With Live Data)
1. Click **"Markets"** in sidebar
2. **Verify:**
   - ✅ Shows list of cryptocurrencies (Bitcoin, Ethereum, etc.)
   - ✅ Each crypto shows:
     - Name and symbol
     - Current price in INR
     - 24h change % (color coded: green for +, red for -)
     - 7-day sparkline chart
   - ✅ "Last Updated" timestamp shows recent time
   - ✅ Refresh button available

### C2.7 - Check News Page (With Categories)
1. Click **"News"** in sidebar
2. **Verify:**
   - ✅ Multiple news articles displayed
   - ✅ Category tabs work: Click "Crypto" tab
   - ✅ Article list updates to show crypto news only
   - ✅ Click "Markets" tab - shows market news
   - ✅ Each article shows source, date, and read link

### C2.8 - Check Analytics with Data
1. Click **"Analytics"** in sidebar
2. **Verify:**
   - ✅ Chart displays with transaction data
   - ✅ Shows 2 data points: Income (₹80,000) and Expenses (₹21,000)
   - ✅ Chart is interactive (hover shows values)
   - ✅ Category breakdown visible

### C2.9 - Set Budget Limits
1. Click **"Budget"** in sidebar
2. Look for budget setup form
3. Set budget values:
   - Needs: `40000`
   - Wants: `20000`
   - Savings & Investment: `20000`
4. Click **"Set Budget"** or **"Save"**
5. **Expected:**
   - ✅ Budget saved successfully
   - ✅ Budget Overview shows progress bars
   - ✅ Shows actual vs budgeted amounts
   - ✅ Expenses (₹21,000) shown against Needs budget

### C2.10 - Export Data
1. Click **"Settings"** in sidebar
2. Look for **"Export Data"** button
3. Click **"📥 Export Data"**
4. **Expected:**
   - ✅ Browser download starts
   - ✅ Downloads JSON or CSV file
   - ✅ File contains all transactions and budget data

### C2.11 - View Financial Health Score
1. On **"Dashboard"** check the Health Score card
2. **Verify:**
   - ✅ Shows numeric score (0-100)
   - ✅ Shows rating: Outstanding/Excellent/Good/Fair/Poor
   - ✅ Shows breakdown:
     - Savings Rate
     - Expense Ratio
     - Budget Adherence
     - Consistency
     - Goal Progress

### C2.12 - View Spending Insights
1. On **"Dashboard"** check Smart Insights section
2. **Verify insights show:**
   - ✅ Biggest spending category: `Shopping` (₹10,000)
   - ✅ Expense ratio analysis
   - ✅ Budget adherence status
   - ✅ Recommendations for improvement

### C2.13 - Check Navigation Sidebar
1. Verify sidebar shows all menu items and is functional:
   - ✅ Dashboard (click - works)
   - ✅ Transactions (click - works)
   - ✅ Budget (click - works)
   - ✅ Goals (click - works)
   - ✅ Markets (click - works)
   - ✅ News (click - works)
   - ✅ Analytics (click - works)
   - ✅ Settings (click - works)
2. Check sidebar styling:
   - ✅ Current page highlighted with gradient
   - ✅ Smooth transitions
   - ✅ Icons visible for each page

### C2.14 - Test Responsive Design
1. Resize browser window to mobile size (375px width)
2. **Expected:**
   - ✅ Sidebar collapses to hamburger menu
   - ✅ Content adjusts to fit screen
   - ✅ Forms are readable on mobile
   - ✅ Charts responsive
3. Resize back to desktop (1024px+)
4. **Expected:**
   - ✅ Sidebar expands back
   - ✅ Multi-column layouts visible

### C2.15 - Update Goal Progress
1. Click **"Goals"** in sidebar
2. Try to find an "Update Progress" or "Add Amount" button
3. If available:
   - Add `50000` to "Vacation Fund"
   - Progress should update to show: ₹50,000 / ₹200,000 (25%)
4. **Expected:**
   - ✅ Progress bar updates
   - ✅ Percentage updates
   - ✅ Dashboard goal card reflects change

### C2.16 - Verify Per-User Data Isolation
1. **In same browser, open incognito/private window**
2. Go to: **http://localhost:5173/finance-tracker**
3. Login with first user: `testuser1@example.com` / `Test123!`
4. **Expected:**
   - ✅ See EMPTY transactions (previous cycle deleted them)
   - ✅ See EMPTY goals (previous cycle deleted them)
5. Open **original window** with second user still logged in
6. **Expected:**
   - ✅ Second user still sees their 3 goals and 5 transactions
   - ✅ Incognito window shows first user's empty data
   - ✅ **Confirms per-user data isolation is working**

### C2.17 - Logout Second User
1. Click **"Logout"** button in sidebar
2. **Expected:**
   - ✅ Redirects to login page
   - ✅ Session cleared

---

## Overall Test Summary

### ✅ Cycle 1 Checklist
- [ ] Login page loads
- [ ] User signup works
- [ ] Dashboard displays
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Create goal
- [ ] View Markets page
- [ ] View News page
- [ ] View Analytics page
- [ ] View Budget page
- [ ] View Settings page
- [ ] Toggle dark mode
- [ ] Delete transaction
- [ ] Delete goal
- [ ] Logout works

### ✅ Cycle 2 Checklist
- [ ] Sign up second user
- [ ] Add multiple income transactions
- [ ] Add multiple expense transactions
- [ ] Create multiple goals
- [ ] Dashboard shows correct stats
- [ ] Markets page shows crypto data
- [ ] News page loads with categories
- [ ] Analytics displays chart with data
- [ ] Set budget limits
- [ ] Export data works
- [ ] View financial health score
- [ ] View spending insights
- [ ] All navigation items work
- [ ] Responsive design (mobile & desktop)
- [ ] Update goal progress (if available)
- [ ] Per-user data isolation verified
- [ ] Logout works

---

## Known Issues to Ignore
- ⚠️ Markets data may take 5-10s to load initially
- ⚠️ News articles may not load if RSS feed is rate limited
- ⚠️ First time health score may show 0 (calculates after data)

## What to Report if Issues Found
1. **Page doesn't load:** Check browser console (F12), note error
2. **Button doesn't work:** Check if form validation shows error
3. **Data not saving:** Check Network tab to see API request status
4. **Performance issue:** Note how long page takes to load
5. **Visual issues:** Screenshot and describe what looks wrong

---

**Happy Testing! 🚀**
