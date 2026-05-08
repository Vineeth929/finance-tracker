import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

/**
 * Financial Heartbeat Hook
 *
 * Computes the emotional state of the user's finances
 * Drives the entire app's atmosphere, colors, and emotional responses
 *
 * States:
 * - thriving: savings rate > 30%, healthy income, consistent savings
 * - growing: positive savings momentum, improving trends
 * - stable: balanced finances, no significant changes
 * - cautious: lower savings rate, some expense concerns
 * - struggling: negative savings, concerning trends
 */
export const useFinancialHeartbeat = () => {
  const { transactions, budgets, goals } = useApp();

  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        state: 'stable',
        score: 50,
        message: 'Start tracking to build momentum',
        emoji: '💙',
        color: 'indigo',
        intensity: 0.5,
      };
    }

    // Calculate financial metrics
    const income = transactions
      .filter(t => t?.type === 'income')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);

    const expenses = transactions
      .filter(t => t?.type === 'expense')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Recent momentum (last 7 transactions)
    const recentTxs = transactions.slice(0, 7);
    const recentIncome = recentTxs
      .filter(t => t?.type === 'income')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
    const recentExpenses = recentTxs
      .filter(t => t?.type === 'expense')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
    const recentSavings = recentIncome - recentExpenses;

    // Goal progress
    const activeGoals = goals?.filter(g => g?.status === 'Active') || [];
    const completedGoals = goals?.filter(g => g?.status === 'Completed') || [];
    const avgGoalProgress = activeGoals.length > 0
      ? activeGoals.reduce((sum, g) => sum + (g?.progress || 0), 0) / activeGoals.length
      : 0;

    // Determine state based on metrics
    let state = 'stable';
    let score = 50;
    let message = 'Your finances are stable';
    let emoji = '💙';
    let color = 'indigo';
    let intensity = 0.5;

    if (savingsRate >= 30 && recentSavings > 0 && avgGoalProgress > 20) {
      state = 'thriving';
      score = Math.min(95, 60 + Math.floor(savingsRate / 2) + (completedGoals.length * 5));
      message = 'You\'re building momentum! Keep it going 🚀';
      emoji = '✨';
      color = 'purple';
      intensity = 0.8;
    } else if (savingsRate >= 20 && recentSavings > 0) {
      state = 'growing';
      score = Math.min(85, 50 + Math.floor(savingsRate));
      message = 'Your savings are growing beautifully 📈';
      emoji = '💚';
      color = 'emerald';
      intensity = 0.7;
    } else if (savingsRate >= 10 && recentSavings >= 0) {
      state = 'stable';
      score = 50 + Math.floor(savingsRate);
      message = 'You\'re on a solid financial path 🎯';
      emoji = '💙';
      color = 'indigo';
      intensity = 0.5;
    } else if (savingsRate >= 0) {
      state = 'cautious';
      score = Math.max(30, 40 + Math.floor(savingsRate));
      message = 'Watch your spending to build savings 💪';
      emoji = '🌙';
      color = 'amber';
      intensity = 0.6;
    } else {
      state = 'struggling';
      score = Math.max(10, 20 + Math.floor(savingsRate));
      message = 'Focus on reducing expenses to grow 💡';
      emoji = '💙';
      color = 'rose';
      intensity = 0.4;
    }

    return {
      state,
      score,
      message,
      emoji,
      color,
      intensity,
      metrics: {
        income,
        expenses,
        savings,
        savingsRate: Math.round(savingsRate),
        recentMomentum: recentSavings > 0 ? 'positive' : recentSavings < 0 ? 'negative' : 'neutral',
        goalProgress: Math.round(avgGoalProgress),
        completedGoals: completedGoals.length,
      },
    };
  }, [transactions, goals]);
};
