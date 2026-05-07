const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');

// GET financial health score (protected)
router.get('/health-score', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get transactions
    const allTransactions = await Transaction.find({ userId }).lean();
    const thisMonthTransactions = allTransactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= thisMonth;
    });

    // Calculate income and expenses
    const income = allTransactions.reduce((sum, tx) => {
      return sum + (tx.type === 'income' ? tx.amount : 0);
    }, 0);

    const expenses = allTransactions.reduce((sum, tx) => {
      return sum + (tx.type === 'expense' ? tx.amount : 0);
    }, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Get budget
    const budget = await Budget.findOne({ userId }).lean();
    const budgetExists = !!budget;

    // Get goals
    const goals = await Goal.find({ userId }).lean();
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const totalGoals = goals.length;

    // Calculate consistency (days with transactions in last 30 days)
    const lastThirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = allTransactions.filter(t => new Date(t.date) >= lastThirtyDays);
    const uniqueDays = new Set(recentTransactions.map(t => t.date)).size;

    // Score calculation (0-100)
    let score = 0;
    const breakdown = {};

    // 1. Savings rate (0-30 points)
    if (savingsRate >= 20) {
      breakdown.savingsRate = 30;
      score += 30;
    } else if (savingsRate >= 15) {
      breakdown.savingsRate = 25;
      score += 25;
    } else if (savingsRate >= 10) {
      breakdown.savingsRate = 20;
      score += 20;
    } else if (savingsRate >= 5) {
      breakdown.savingsRate = 15;
      score += 15;
    } else if (savingsRate > 0) {
      breakdown.savingsRate = 10;
      score += 10;
    } else {
      breakdown.savingsRate = 0;
    }

    // 2. Expense ratio (0-25 points) - prefer lower expenses
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
    if (expenseRatio <= 60) {
      breakdown.expenseRatio = 25;
      score += 25;
    } else if (expenseRatio <= 70) {
      breakdown.expenseRatio = 20;
      score += 20;
    } else if (expenseRatio <= 80) {
      breakdown.expenseRatio = 15;
      score += 15;
    } else if (expenseRatio <= 90) {
      breakdown.expenseRatio = 10;
      score += 10;
    } else {
      breakdown.expenseRatio = 5;
      score += 5;
    }

    // 3. Budget adherence (0-20 points)
    if (budgetExists && expenses <= (budget.needs + budget.wants + budget.savings)) {
      breakdown.budgetAdherence = 20;
      score += 20;
    } else if (budgetExists) {
      breakdown.budgetAdherence = 10;
      score += 10;
    } else {
      breakdown.budgetAdherence = 0;
    }

    // 4. Consistency (0-15 points)
    const consistencyScore = Math.min((uniqueDays / 30) * 15, 15);
    breakdown.consistency = Math.round(consistencyScore);
    score += Math.round(consistencyScore);

    // 5. Goal progress (0-10 points)
    if (totalGoals > 0) {
      const goalProgressScore = (completedGoals / totalGoals) * 10;
      breakdown.goalProgress = Math.round(goalProgressScore);
      score += Math.round(goalProgressScore);
    } else {
      breakdown.goalProgress = 0;
    }

    // Determine rating
    let rating;
    if (score >= 90) {
      rating = 'Outstanding';
    } else if (score >= 75) {
      rating = 'Excellent';
    } else if (score >= 60) {
      rating = 'Good';
    } else if (score >= 40) {
      rating = 'Fair';
    } else {
      rating = 'Poor';
    }

    res.json({
      score: Math.round(score),
      rating,
      breakdown,
      metrics: {
        totalIncome: income,
        totalExpenses: expenses,
        totalSavings: savings,
        savingsRate: Math.round(savingsRate * 100) / 100,
        expenseRatio: Math.round(expenseRatio * 100) / 100,
        consistencyDays: uniqueDays,
        completedGoals,
        totalGoals,
        hasBudget: budgetExists
      }
    });
  } catch (err) {
    console.error('Health score calculation error:', err.message);
    res.status(500).json({ error: 'Failed to calculate health score', details: err.message });
  }
});

// GET spending insights (protected)
router.get('/spending-insights', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId, type: 'expense' }).lean();

    if (transactions.length === 0) {
      return res.json({
        insights: [
          { type: 'info', message: 'Start tracking expenses to get personalized insights!' }
        ]
      });
    }

    const insights = [];

    // Calculate category breakdown
    const categoryTotals = {};
    let totalExpenses = 0;

    transactions.forEach(tx => {
      const cat = tx.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
      totalExpenses += tx.amount;
    });

    // Find biggest spending category
    const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (biggestCategory) {
      const [category, amount] = biggestCategory;
      const percentage = Math.round((amount / totalExpenses) * 100);
      insights.push({
        type: 'warning',
        message: `Your biggest expense category is ${category} (₹${Math.round(amount)} - ${percentage}% of total).`,
        category,
        amount: Math.round(amount),
        percentage
      });
    }

    // Check if wants > 30%
    const wantsCategory = categoryTotals['Wants'] || 0;
    const wantsPercentage = (wantsCategory / totalExpenses) * 100;
    if (wantsPercentage > 30) {
      insights.push({
        type: 'alert',
        message: `Your "Wants" spending is ${Math.round(wantsPercentage)}% of total - consider reducing discretionary spending.`,
        wantsPercentage: Math.round(wantsPercentage)
      });
    }

    // Check if savings is low
    const savingsCategory = categoryTotals['Savings & Investment'] || 0;
    const savingsPercentage = (savingsCategory / totalExpenses) * 100;
    if (savingsPercentage < 10) {
      insights.push({
        type: 'info',
        message: 'Try to allocate more towards savings and investments for long-term growth.',
        savingsPercentage: Math.round(savingsPercentage)
      });
    }

    // Average transaction
    const avgTransaction = Math.round(totalExpenses / transactions.length);
    insights.push({
      type: 'info',
      message: `Your average expense is ₹${avgTransaction}.`
    });

    res.json({ insights, metrics: { totalExpenses: Math.round(totalExpenses), transactionCount: transactions.length } });
  } catch (err) {
    console.error('Spending insights error:', err.message);
    res.status(500).json({ error: 'Failed to generate insights', details: err.message });
  }
});

module.exports = router;
