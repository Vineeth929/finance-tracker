import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../hooks/useApi';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

export default function DashboardPage() {
  const { transactions, budgets, goals } = useApp();
  const [healthScore, setHealthScore] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [scoreData, insightsData] = await Promise.all([
        api.getHealthScore(),
        api.getSpendingInsights()
      ]);
      setHealthScore(scoreData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savings = income - expenses;
    return { income, expenses, savings };
  };

  const totals = calculateTotals();
  const recentTransactions = transactions.slice(0, 5);
  const completedGoals = goals.filter(g => g.status === 'Completed').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-24" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Welcome Back! 👋</h1>
        <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Health Score */}
      {healthScore && (
        <GlassCard className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Financial Health Score</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold gradient-text">{healthScore.score}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  healthScore.rating === 'Outstanding' ? 'bg-emerald-500/20 text-emerald-400' :
                  healthScore.rating === 'Excellent' ? 'bg-blue-500/20 text-blue-400' :
                  healthScore.rating === 'Good' ? 'bg-indigo-500/20 text-indigo-400' :
                  healthScore.rating === 'Fair' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {healthScore.rating}
                </span>
              </div>
            </div>
            <div className="text-6xl">📊</div>
          </div>

          {/* Score Breakdown */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Savings Rate</p>
              <p className="text-lg font-bold text-emerald-400">{healthScore.breakdown.savingsRate} pts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Expenses</p>
              <p className="text-lg font-bold text-indigo-400">{healthScore.breakdown.expenseRatio} pts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Budget</p>
              <p className="text-lg font-bold text-blue-400">{healthScore.breakdown.budgetAdherence} pts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Consistency</p>
              <p className="text-lg font-bold text-purple-400">{healthScore.breakdown.consistency} pts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Goals</p>
              <p className="text-lg font-bold text-rose-400">{healthScore.breakdown.goalProgress} pts</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Income"
          value={`₹${totals.income.toLocaleString()}`}
          icon={{ symbol: '📈', color: 'text-emerald-400' }}
        />
        <StatCard
          label="Total Expenses"
          value={`₹${totals.expenses.toLocaleString()}`}
          icon={{ symbol: '💳', color: 'text-rose-400' }}
        />
        <StatCard
          label="Net Savings"
          value={`₹${totals.savings.toLocaleString()}`}
          change={totals.income > 0 ? (totals.savings / totals.income) * 100 : 0}
          icon={{ symbol: '💰', color: 'text-indigo-400' }}
        />
        <StatCard
          label="Active Goals"
          value={goals.filter(g => g.status === 'Active').length}
          icon={{ symbol: '🎯', color: 'text-amber-400' }}
        />
      </div>

      {/* Recent Activity & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📋</span> Recent Activity
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tx.category === 'income' || tx.type === 'income' ? '💵' : '💳'}</span>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No transactions yet. Start tracking your finances!</p>
          )}
        </GlassCard>

        {/* Budget Overview */}
        {budgets && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💰</span> Budget
            </h3>
            <div className="space-y-4">
              {['Needs', 'Wants', 'Savings & Investment'].map(cat => (
                <div key={cat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">{cat}</span>
                    <span className="text-sm font-semibold">₹{budgets[cat]?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      style={{ width: `${Math.min((budgets[cat] / (budgets['Needs'] + budgets['Wants'] + budgets['Savings & Investment'])) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Smart Insights */}
      {insights?.insights && insights.insights.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> Smart Insights
          </h3>
          <div className="space-y-3">
            {insights.insights.map((insight, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                <span className={`text-2xl ${
                  insight.type === 'alert' ? '⚠️' :
                  insight.type === 'warning' ? '🔸' :
                  'ℹ️'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
