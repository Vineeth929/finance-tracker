export const calculateTotals = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    savings: Math.round((income - expenses) * 100) / 100
  };
};

export const calculateByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categories = {};

  expenses.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = 0;
    }
    categories[t.category] += t.amount;
  });

  return categories;
};

export const getSuggestions = (transactions, selectedMonth) => {
  const filtered = filterByMonth(transactions, selectedMonth);
  const { income, expenses } = calculateTotals(filtered);
  const categories = calculateByCategory(filtered);
  const suggestions = [];

  if (income === 0) {
    return suggestions;
  }

  // Wants spending check
  const wantsAmount = categories['Wants'] || 0;
  const wantsPercent = (wantsAmount / income) * 100;
  if (wantsPercent > 30) {
    suggestions.push({
      type: 'warning',
      message: `⚠️ You're overspending on wants (${wantsPercent.toFixed(1)}% of income). Try to keep it under 30%.`
    });
  }

  // Savings check
  const savingsPercent = ((income - expenses) / income) * 100;
  if (savingsPercent < 20) {
    suggestions.push({
      type: 'info',
      message: `💡 Consider saving at least 20% of your income. Currently: ${savingsPercent.toFixed(1)}%`
    });
  }

  // Biggest expense
  if (Object.keys(categories).length > 0) {
    const biggestCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    suggestions.push({
      type: 'info',
      message: `📊 Your biggest expense category is ${biggestCategory[0]} (₹${biggestCategory[1].toFixed(2)})`
    });
  }

  return suggestions;
};

export const filterByMonth = (transactions, selectedMonth) => {
  if (!selectedMonth) return transactions;

  return transactions.filter(t => {
    const txDate = new Date(t.date);
    const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
    return txMonth === selectedMonth;
  });
};

export const getAvailableMonths = (transactions) => {
  const months = new Set();
  transactions.forEach(t => {
    const date = new Date(t.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.add(month);
  });
  return Array.from(months).sort().reverse();
};
