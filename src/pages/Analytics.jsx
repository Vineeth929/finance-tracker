import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Analytics from '../components/Analytics';
import NarrativeChart from '../components/ui/NarrativeChart';
import CuriosityWidget from '../components/ui/CuriosityWidget';
import { useFinancialHeartbeat } from '../hooks/useFinancialHeartbeat';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export default function AnalyticsPage() {
  const { transactions } = useApp();
  const heartbeat = useFinancialHeartbeat();

  // Calculate trends
  const monthlyData = {};
  transactions?.forEach(tx => {
    const date = new Date(tx.date);
    const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    if (tx?.type === 'income') {
      monthlyData[monthKey].income += tx.amount || 0;
    } else {
      monthlyData[monthKey].expenses += tx.amount || 0;
    }
  });

  const monthlyTrends = Object.entries(monthlyData)
    .sort()
    .map(([month, data]) => ({
      label: month,
      value: data.income - data.expenses,
    }));

  const avgMonthlyIncome = monthlyData ? Object.values(monthlyData).reduce((sum, m) => sum + m.income, 0) / Object.keys(monthlyData).length : 0;
  const avgMonthlyExpense = monthlyData ? Object.values(monthlyData).reduce((sum, m) => sum + m.expenses, 0) / Object.keys(monthlyData).length : 0;

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 animate-fadeIn"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="space-y-2 sm:space-y-3" variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
          Analytics & Insights 📈
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your financial story told through beautiful data
        </p>
      </motion.div>

      {/* Key Metrics */}
      {Object.keys(monthlyData).length > 0 && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          variants={itemVariants}
        >
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Monthly Income</p>
            <p className="text-lg sm:text-xl font-bold mt-2" style={{ color: '#34D399' }}>
              ₹{Math.round(avgMonthlyIncome).toLocaleString()}
            </p>
          </GlassCard>
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Monthly Expense</p>
            <p className="text-lg sm:text-xl font-bold mt-2" style={{ color: '#EF4444' }}>
              ₹{Math.round(avgMonthlyExpense).toLocaleString()}
            </p>
          </GlassCard>
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Monthly Savings</p>
            <p className="text-lg sm:text-xl font-bold mt-2" style={{ color: '#A855F7' }}>
              ₹{Math.round(avgMonthlyIncome - avgMonthlyExpense).toLocaleString()}
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Monthly Trend Story */}
      {monthlyTrends.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <NarrativeChart
              type="progress"
              title="Your Savings Trajectory"
              icon="📈"
              data={monthlyTrends}
              trend={
                monthlyTrends.length > 1
                  ? {
                      direction:
                        monthlyTrends[monthlyTrends.length - 1].value >
                        monthlyTrends[0].value
                          ? 'up'
                          : 'down',
                      percentage:
                        ((monthlyTrends[monthlyTrends.length - 1].value -
                          monthlyTrends[0].value) /
                          Math.abs(monthlyTrends[0].value)) *
                        100,
                    }
                  : null
              }
            />
          </GlassCard>
        </motion.div>
      )}

      {/* Insights */}
      {transactions && transactions.length > 0 && (
        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={itemVariants}
        >
          <h2 className="text-lg font-bold">Your Financial Story</h2>

          {heartbeat.state === 'thriving' ? (
            <CuriosityWidget
              title="🚀 You're Thriving!"
              message="Your financial momentum is exceptional"
              detail={`Your ${heartbeat.metrics.savingsRate}% savings rate is excellent. You're building wealth consistently and should feel proud of your discipline.`}
              type="achievement"
              initialExpanded={true}
            />
          ) : heartbeat.state === 'growing' ? (
            <CuriosityWidget
              title="📈 Growth Mode Active"
              message="Your savings are growing beautifully"
              detail={`Your ${heartbeat.metrics.savingsRate}% savings rate shows positive momentum. Keep maintaining this trajectory.`}
              type="discovery"
              initialExpanded={true}
            />
          ) : heartbeat.state === 'stable' ? (
            <CuriosityWidget
              title="💙 Balanced & Stable"
              message="Your finances are well-balanced"
              detail={`Your ${heartbeat.metrics.savingsRate}% savings rate is healthy. Consider looking for opportunities to increase this.`}
              type="insight"
              initialExpanded={true}
            />
          ) : heartbeat.state === 'cautious' ? (
            <CuriosityWidget
              title="💪 Opportunity to Optimize"
              message="Small changes can make a big difference"
              detail={`Your current savings rate is ${heartbeat.metrics.savingsRate}%. Identifying just one area to optimize could significantly improve your financial trajectory.`}
              type="suggestion"
              initialExpanded={true}
            />
          ) : (
            <CuriosityWidget
              title="🎯 Focus Time"
              message="Your finances need attention"
              detail={`Let's focus on expense reduction to turn this around. Small, consistent improvements will build momentum over time.`}
              type="suggestion"
              initialExpanded={true}
            />
          )}

          {monthlyTrends.length > 1 && (
            <CuriosityWidget
              title="📊 Trend Analysis"
              message={`You have ${monthlyTrends.length} months of financial data`}
              detail={`This gives us enough data to see patterns in your spending and saving habits. Use these insights to make smarter financial decisions.`}
              type="insight"
              initialExpanded={false}
            />
          )}
        </motion.div>
      )}

      {/* Full Analytics Card */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Detailed Analytics</h2>
          <Analytics transactions={transactions} />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
