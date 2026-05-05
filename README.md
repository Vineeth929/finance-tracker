# 💰 Finance Tracker

A simple, personal finance web app to track income, expenses, and guide smart spending vs savings. 

**No login required • No backend • All data stored locally in browser**

---

## ✨ Features

### 📊 Dashboard
- View total income, expenses, and savings
- See percentage breakdowns
- Visual pie chart showing income vs expenses

### 💵 Add Income
- Record income with amount, source, and date
- Sources: Salary, Freelance, Investment Returns, Bonus, Gift, Other

### 💳 Add Expense
- Track expenses with category and notes
- Categories:
  - **Needs**: Rent, Food, Utilities, Transportation, Healthcare
  - **Wants**: Entertainment, Shopping, Dining Out, Subscriptions, Hobbies
  - **Savings & Investment**: Savings, Investments, Insurance

### 💡 Smart Suggestions
- ⚠️ Warning if Wants > 30% of income
- 💡 Tip to save at least 20% of income
- 📊 Highlights biggest expense category

### 📋 Transactions
- View all income and expenses in one place
- Delete transactions if needed
- Sorted by date (newest first)

### 🎨 Dark Mode
- Toggle between light and dark themes
- Your preference is saved

### 📥 Export Data
- Download all your financial data as JSON
- Useful for backup or analysis

### 📅 Monthly Filter
- Filter transactions by month
- View month-specific insights

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

1. **Clone or Download the Project**
   ```bash
   cd finance-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Go to `http://localhost:5173`
   - Start tracking your finances!

---

## 📁 Project Structure

```
finance-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard with totals
│   │   ├── AddIncome.jsx          # Income form
│   │   ├── AddExpense.jsx         # Expense form
│   │   ├── SmartSuggestions.jsx   # Financial insights
│   │   ├── TransactionList.jsx    # Transaction history
│   │   └── Charts.jsx             # Chart visualizations
│   ├── hooks/
│   │   └── useLocalStorage.js     # Custom localStorage hook
│   ├── utils/
│   │   └── calculations.js        # Financial calculations
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── README.md                      # This file
```

---

## 💾 Data Storage

All data is stored in your **browser's localStorage**:
- Transactions are saved automatically
- Data persists even after closing the browser
- No internet connection needed after first load
- Export your data anytime for backup

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Chart visualization
- **LocalStorage API** - Client-side data storage

---

## 💡 Usage Tips

1. **Start Simple**: Add all transactions for the current month first
2. **Regular Updates**: Update daily or weekly for accuracy
3. **Monthly Review**: Use the month filter to review each month's finances
4. **Export Regularly**: Export your data monthly as backup
5. **Smart Goals**: Use suggestions to improve your spending habits

---

## 🎯 Financial Guidelines

The app uses these widely-accepted financial principles:

- **50/30/20 Rule**:
  - 50% for Needs (essentials)
  - 30% for Wants (discretionary)
  - 20% for Savings/Investment

- **Warnings**:
  - If Wants exceed 30% → Overspending alert
  - If Savings below 20% → Savings goal reminder

---

## 🌙 Dark Mode

Click the "🌙 Dark" or "☀️ Light" button in the header to toggle dark mode. Your preference is automatically saved.

---

## 📥 Exporting Data

Click the **"📥 Export Data as JSON"** button to download your entire financial history as a JSON file. Perfect for:
- Creating backups
- Analyzing data in spreadsheets
- Switching devices

---

## 🔒 Privacy

- ✅ No sign-up required
- ✅ No data sent to servers
- ✅ All data stays in your browser
- ✅ Completely private and secure

---

## 📝 Tips for Best Results

1. **Be Consistent**: Log transactions daily or weekly
2. **Categorize Accurately**: Use the right category for better insights
3. **Add Notes**: Notes help you remember large expenses later
4. **Review Monthly**: Use the month filter to analyze trends
5. **Export & Backup**: Export data monthly for peace of mind

---

## 🐛 Troubleshooting

### Data not saving?
- Check your browser's localStorage is enabled
- Try a different browser
- Clear cache and reload

### Can't see charts?
- Make sure JavaScript is enabled
- Refresh the page
- Try a different browser

### Lost data accidentally?
- Unfortunately, once deleted from localStorage, data cannot be recovered
- Always keep regular JSON exports as backup!

---

## 📞 Support

For issues or feature requests, feel free to improve the code and customize it for your needs!

---

**Made with ❤️ for better financial habits**

Start tracking today. Save more tomorrow. 💰
