import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { useFinancialHeartbeat } from '../hooks/useFinancialHeartbeat';
import AmbientBackground from '../components/ui/AmbientBackground';
import AnimatedStatCard from '../components/ui/AnimatedStatCard';
import ProgressAnimation from '../components/ui/ProgressAnimation';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import NarrativeChart from '../components/ui/NarrativeChart';
import CuriosityWidget from '../components/ui/CuriosityWidget';
import MilestoneCard from '../components/ui/MilestoneCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function DashboardPage() {
  const { transactions, budgets, goals } = useApp();
  const navigate = useNavigate();
  const heartbeat = useFinancialHeartbeat();
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
        api.getHealthScore().catch(err => {
          console.error('Failed to fetch health score:', err);
          return null;
        }),
        api.getSpendingInsights().catch(err => {
          console.error('Failed to fetch insights:', err);
          return null;
        }),
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
    if (!transactions || transactions.length === 0) {
      return { income: 0, expenses: 0, savings: 0 };
    }
    const income = transactions
      .filter(t => t?.type === 'income')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
    const expenses = transactions
      .filter(t => t?.type === 'expense')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
    const savings = income - expenses;
    return { income, expenses, savings };
  };

  const totals = calculateTotals();
  const recentTransactions =
    transactions && transactions.length > 0 ? transactions.slice(0, 5) : [];
  const completedGoals =
    goals && goals.length > 0
      ? goals.filter(g => g?.status === 'Completed').length
      : 0;
  const activeGoals = goals && goals.length > 0 ? goals.filter(g => g?.status === 'Active').length : 0;

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-20 sm:h-24" count={3} />
      </div>
    );
  }

  // Color variants for heartbeat state
  const heartbeatColors = {
    thriving: '#A855F7',
    growing: '#34D399',
    stable: '#3B82F6',
    cautious: '#F59E0B',
    struggling: '#EF4444',
  };

  return (
    <>
      {/* Emotional Background that responds to financial state */}
      <AmbientBackground state={heartbeat.state} intensity={heartbeat.intensity} />

      <motion.div
        className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header with Financial Heartbeat */}
        <motion.div className="space-y-3 sm:space-y-4" variants={itemVariants}>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
              {heartbeat.emoji} Welcome Back!
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Heartbeat Status - Emotional message */}
          <motion.div
            className="rounded-lg p-3 sm:p-4"
            style={{
              background: `rgba(${
                heartbeat.color === 'purple'
                  ? '168, 85, 247'
                  : heartbeat.color === 'emerald'
                    ? '16, 185, 129'
                    : heartbeat.color === 'amber'
                      ? '245, 158, 11'
                      : heartbeat.color === 'rose'
                        ? '239, 68, 68'
                        : '59, 130, 246'
              }, 0.1)`,
              border: `1px solid rgba(${
                heartbeat.color === 'purple'
                  ? '168, 85, 247'
                  : heartbeat.color === 'emerald'
                    ? '16, 185, 129'
                    : heartbeat.color === 'amber'
                      ? '245, 158, 11'
                      : heartbeat.color === 'rose'
                        ? '239, 68, 68'
                        : '59, 130, 246'
              }, 0.3)`,
            }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p
              className="text-xs sm:text-sm font-semibold"
              style={{ color: heartbeatColors[heartbeat.state] }}
            >
              {heartbeat.message}
            </p>
          </motion.div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <motion.button
              onClick={() => navigate('/transactions')}
              className="btn btn-primary btn-sm sm:btn-base flex-1 sm:flex-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              + Add Income
            </motion.button>
            <motion.button
              onClick={() => navigate('/transactions')}
              className="btn btn-secondary btn-sm sm:btn-base flex-1 sm:flex-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              - Add Expense
            </motion.button>
            <motion.button
              onClick={() => navigate('/budget')}
              className="btn btn-secondary btn-sm sm:btn-base hidden sm:inline-flex"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              💰 Budget
            </motion.button>
          </div>
        </motion.div>

        {/* Financial Summary - Emotionally Engaging Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
          variants={itemVariants}
        >
          <AnimatedStatCard
            label="Income"
            value={totals.income}
            icon="📈"
            isGrowing={heartbeat.state === 'thriving' || heartbeat.state === 'growing'}
          />
          <AnimatedStatCard
            label="Expenses"
            value={totals.expenses}
            icon="💳"
            trend={
              totals.expenses > 0
                ? { direction: 'down', percentage: 5 }
                : null
            }
          />
          <AnimatedStatCard
            label="Savings"
            value={totals.savings}
            icon="💰"
            isGrowing={totals.savings > 0}
            trend={
              totals.income > 0
                ? { direction: totals.savings > 0 ? 'up' : 'down', percentage: Math.abs((totals.savings / totals.income) * 100) }
                : null
            }
          />
          <AnimatedStatCard
            label="Goals"
            value={activeGoals}
            icon="🎯"
          />
        </motion.div>

        {/* Financial Health Score - Narrative */}
        {healthScore && (
          <motion.div variants={itemVariants}>
            <GlassCard className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                {/* Health Score Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs sm:text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Financial Health Score
                    </p>
                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <motion.span
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        {healthScore.score}
                      </motion.span>
                      <span
                        className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                        style={{
                          background:
                            healthScore.rating === 'Outstanding'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : healthScore.rating === 'Excellent'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : healthScore.rating === 'Good'
                                  ? 'rgba(168, 85, 247, 0.2)'
                                  : healthScore.rating === 'Fair'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)',
                          color:
                            healthScore.rating === 'Outstanding'
                              ? '#34D399'
                              : healthScore.rating === 'Excellent'
                                ? '#3B82F6'
                                : healthScore.rating === 'Good'
                                  ? '#A855F7'
                                  : healthScore.rating === 'Fair'
                                    ? '#F59E0B'
                                    : '#EF4444',
                        }}
                      >
                        {healthScore.rating}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    className="text-4xl sm:text-5xl lg:text-6xl flex-shrink-0"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📊
                  </motion.div>
                </div>

                {/* Score Breakdown with Progress */}
                {healthScore.breakdown && (
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Savings Rate',
                        value: healthScore.breakdown.savingsRate,
                        max: 100,
                        color: '#34D399',
                      },
                      {
                        label: 'Budget Adherence',
                        value: healthScore.breakdown.budgetAdherence,
                        max: 100,
                        color: '#A855F7',
                      },
                      {
                        label: 'Goal Progress',
                        value: healthScore.breakdown.goalProgress,
                        max: 100,
                        color: '#F59E0B',
                      },
                    ].map(stat => (
                      <ProgressAnimation
                        key={stat.label}
                        label={stat.label}
                        value={stat.value || 0}
                        max={stat.max}
                        variant={
                          stat.value >= 75
                            ? 'success'
                            : stat.value >= 50
                              ? 'growth'
                              : 'default'
                        }
                        showGlow={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Financial Stories - Narrative Charts */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          variants={itemVariants}
        >
          <GlassCard className="p-4 sm:p-6">
            <NarrativeChart
              type="income"
              title="Income Flow"
              icon="💵"
              data={
                transactions
                  ?.filter(t => t?.type === 'income')
                  .slice(0, 4)
                  .map(t => ({
                    label: t.description.substring(0, 12),
                    value: t.amount,
                  })) || []
              }
            />
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <NarrativeChart
              type="spending"
              title="Spending Patterns"
              icon="💳"
              data={
                transactions
                  ?.filter(t => t?.type === 'expense')
                  .slice(0, 4)
                  .map(t => ({
                    label: t.description.substring(0, 12),
                    value: t.amount,
                  })) || []
              }
            />
          </GlassCard>
        </motion.div>

        {/* Curiosity Widgets - Insights that reveal gradually */}
        {insights?.insights && insights.insights.length > 0 && (
          <motion.div
            className="space-y-3 sm:space-y-4"
            variants={itemVariants}
          >
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              💡 Insights & Discoveries
            </h3>
            {insights.insights.slice(0, 3).map((insight, i) => (
              <CuriosityWidget
                key={i}
                title={insight.title || 'Financial Insight'}
                message={insight.message}
                detail={insight.detail || `${insight.message} — This insight can help you make better financial decisions.`}
                type={
                  insight.type === 'alert'
                    ? 'suggestion'
                    : insight.type === 'warning'
                      ? 'discovery'
                      : 'insight'
                }
                initialExpanded={i === 0}
              />
            ))}
          </motion.div>
        )}

        {/* Milestone Celebrations - if user reached goals */}
        {completedGoals > 0 && (
          <motion.div variants={itemVariants}>
            <MilestoneCard
              title={`${completedGoals} Goal${completedGoals > 1 ? 's' : ''} Completed!`}
              description="You've achieved your financial milestones"
              achievement={`🎉 You completed ${completedGoals} goal${completedGoals > 1 ? 's' : ''}!`}
              icon="🎯"
              progress={100}
              details={[
                { label: 'Total Savings', value: `₹${totals.savings.toLocaleString()}` },
                { label: 'Savings Rate', value: `${heartbeat.metrics.savingsRate}%` },
              ]}
            />
          </motion.div>
        )}

        {/* Recent Activity - Emotionally engaging transaction history */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <span>📋</span> <span className="hidden sm:inline">Recent Activity</span>
              <span className="sm:hidden">Activity</span>
            </h3>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                {recentTransactions.map((tx, idx) => (
                  <motion.div
                    key={tx._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 rounded-lg transition-all"
                    style={{ background: 'var(--glass-bg)' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ background: 'var(--glass-hover-bg)' }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-lg sm:text-2xl flex-shrink-0">
                        {tx.category === 'income' || tx.type === 'income'
                          ? '💵'
                          : '💳'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <motion.span
                      className="font-bold text-sm sm:text-base flex-shrink-0"
                      style={{
                        color:
                          tx.type === 'income'
                            ? '#34D399'
                            : '#EF4444',
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 + 0.2 }}
                    >
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 sm:py-8 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                No transactions yet. Start tracking your finances!
              </p>
            )}
          </GlassCard>
        </motion.div>

        {/* Budget Overview - Progress visualization */}
        {budgets && budgets.Needs && Object.keys(budgets).length > 0 && (
          <motion.div variants={itemVariants}>
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <span>💰</span> <span className="hidden sm:inline">Budget</span>
              </h3>
              <div className="space-y-4 sm:space-y-5">
                {['Needs', 'Wants', 'Savings & Investment'].map((cat, idx) => {
                  const budgetVal = budgets[cat] || 0;
                  const total = (budgets['Needs'] || 0) + (budgets['Wants'] || 0) + (budgets['Savings & Investment'] || 0);
                  const percentage = total > 0 ? (budgetVal / total) * 100 : 0;

                  return (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ProgressAnimation
                        label={cat.replace(' & Investment', '')}
                        value={percentage}
                        max={100}
                        variant="growth"
                        showGlow={true}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
