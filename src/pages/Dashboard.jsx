import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

export default function DashboardPage() {
  const { transactions, budgets, goals } = useApp();
  const navigate = useNavigate();
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
      <div className="space-y-4 sm:space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-20 sm:h-24" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn">
      {/* Welcome Header - Responsive Typography */}
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Welcome Back! 👋</h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Action Buttons - Financial Tracking */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/transactions')}
            className="btn btn-primary btn-sm sm:btn-base"
          >
            + Income
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className="btn btn-secondary btn-sm sm:btn-base"
          >
            - Expense
          </button>
          <button
            onClick={() => navigate('/budget')}
            className="btn btn-secondary btn-sm sm:btn-base"
          >
            📊 Budget
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="btn btn-secondary btn-sm sm:btn-base"
          >
            📈 Analytics
          </button>
        </div>
      </div>

      {/* Health Score - Responsive */}
      {healthScore && (
        <GlassCard className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Financial Health Score</p>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">{healthScore.score}</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
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
            <div className="text-4xl sm:text-5xl lg:text-6xl flex-shrink-0">📊</div>
          </div>

          {/* Score Breakdown - Responsive Grid */}
          {healthScore.breakdown && (
            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {[
                { label: 'Savings Rate', value: healthScore.breakdown.savingsRate, color: 'text-emerald-400' },
                { label: 'Expenses', value: healthScore.breakdown.expenseRatio, color: 'text-indigo-400' },
                { label: 'Budget', value: healthScore.breakdown.budgetAdherence, color: 'text-blue-400' },
                { label: 'Consistency', value: healthScore.breakdown.consistency, color: 'text-purple-400' },
                { label: 'Goals', value: healthScore.breakdown.goalProgress, color: 'text-rose-400' },
              ].map(stat => (
                <div key={stat.label} className="rounded-lg p-2 sm:p-3" style={{ background: 'var(--glass-bg)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${stat.color}`}>{stat.value || 0} pts</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Stat Cards - Fully Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
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

      {/* Recent Activity & Budget - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <GlassCard className="md:col-span-2 lg:col-span-3 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <span>📋</span> <span className="hidden sm:inline">Recent Activity</span><span className="sm:hidden">Activity</span>
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {recentTransactions.map(tx => (
                <div
                  key={tx._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 rounded-lg transition-colors"
                  style={{ background: 'var(--glass-bg)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--glass-hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--glass-bg)')}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg sm:text-2xl flex-shrink-0">{tx.category === 'income' || tx.type === 'income' ? '💵' : '💳'}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{tx.description}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm sm:text-base flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 sm:py-8 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              No transactions yet. Start tracking your finances!
            </p>
          )}
        </GlassCard>

        {/* Budget Overview - Responsive */}
        {budgets && budgets.Needs ? (
          <GlassCard className="md:col-span-1 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span>💰</span> <span className="hidden sm:inline">Budget</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {['Needs', 'Wants', 'Savings & Investment'].map(cat => (
                <div key={cat}>
                  <div className="flex justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.replace(' & Investment', '')}</span>
                    <span className="text-xs sm:text-sm font-semibold">₹{Math.round(budgets[cat] || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'var(--glass-hover-bg)' }}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      style={{
                        width: `${Math.min(((budgets[cat] || 0) / Math.max(budgets['Needs'] + budgets['Wants'] + budgets['Savings & Investment'], 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="md:col-span-1 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">💰 <span className="hidden sm:inline">Budget</span></h3>
            <p className="text-center py-4 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>No budget set yet!</p>
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
              <div key={i} className="p-4 rounded-lg flex items-start gap-3" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderWidth: '1px' }}>
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
