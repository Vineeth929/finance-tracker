export const calculateTotals = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { income: 0, expenses: 0, savings: 0 };
  }

  const income = transactions
    .filter(t => t?.type === 'income')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const expenses = transactions
    .filter(t => t?.type === 'expense')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  return {
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    savings: Math.round((income - expenses) * 100) / 100
  };
};

export const calculateByCategory = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {};
  }

  const expenses = transactions.filter(t => t?.type === 'expense');
  const categories = {};

  expenses.forEach(t => {
    if (!categories[t?.category]) {
      categories[t?.category] = 0;
    }
    categories[t?.category] += t?.amount || 0;
  });

  return categories;
};

export const getSuggestions = (transactions, selectedMonth) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const filtered = filterByMonth(transactions, selectedMonth);
  const { income, expenses } = calculateTotals(filtered);
  const categories = calculateByCategory(filtered) || {};
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
  const categoryKeys = Object.keys(categories || {});
  if (categoryKeys.length > 0) {
    const biggestCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    suggestions.push({
      type: 'info',
      message: `📊 Your biggest expense category is ${biggestCategory[0]} (₹${biggestCategory[1].toFixed(2)})`
    });
  }

  return suggestions;
};

export const filterByMonth = (transactions, selectedMonth) => {
  if (!Array.isArray(transactions) || !selectedMonth) return transactions || [];

  return transactions.filter(t => {
    if (!t?.date) return false;
    const txDate = new Date(t.date);
    const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
    return txMonth === selectedMonth;
  });
};

export const getAvailableMonths = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const months = new Set();
  transactions.forEach(t => {
    if (!t?.date) return;
    const date = new Date(t.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.add(month);
  });
  return Array.from(months).sort().reverse();
};

export const calculateBudgetStatus = (transactions, budgets, selectedMonth) => {
  if (!budgets || typeof budgets !== 'object' || Object.keys(budgets).length === 0) {
    return [];
  }

  const filtered = filterByMonth(transactions, selectedMonth);
  const spending = calculateByCategory(filtered);

  return Object.keys(budgets || {}).map(category => {
    const spent = spending[category] || 0;
    const budget = budgets[category] || 0;
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    return {
      category,
      budget,
      spent,
      remaining: Math.max(0, budget - spent),
      percent: Math.min(100, percent),
      isOverBudget: spent > budget
    };
  });
};

export const searchTransactions = (transactions, query) => {
  if (!Array.isArray(transactions) || !query?.trim()) return transactions || [];

  const lowerQuery = query.toLowerCase();
  return transactions.filter(t => {
    if (!t) return false;
    const amountMatch = (t?.amount || '').toString().includes(query);
    const categoryMatch = (t?.category || '').toLowerCase().includes(lowerQuery);
    const subcategoryMatch = (t?.subcategory || '').toLowerCase().includes(lowerQuery);
    const sourceMatch = (t?.source || '').toLowerCase().includes(lowerQuery);
    const notesMatch = (t?.notes || '').toLowerCase().includes(lowerQuery);
    return amountMatch || categoryMatch || subcategoryMatch || sourceMatch || notesMatch;
  });
};

export const getMonthlyTrends = (transactions, months = 6) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {};
  }

  const trends = {};
  const allMonths = getAvailableMonths(transactions) || [];
  (allMonths || []).slice(0, months).forEach(month => {
    const filtered = filterByMonth(transactions, month);
    const { income, expenses } = calculateTotals(filtered);
    trends[month] = { income, expenses, savings: income - expenses };
  });
  return trends;
};
