import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useFinancialHeartbeat } from '../hooks/useFinancialHeartbeat';
import GlassCard from '../components/ui/GlassCard';
import BudgetPlanner from '../components/BudgetPlanner';
import ProgressAnimation from '../components/ui/ProgressAnimation';
import CuriosityWidget from '../components/ui/CuriosityWidget';
import NarrativeChart from '../components/ui/NarrativeChart';

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

export default function BudgetPage() {
  const { transactions, budgets, updateBudget } = useApp();
  const heartbeat = useFinancialHeartbeat();

  // Calculate budget utilization
  const totalBudget =
    (budgets?.Needs || 0) +
    (budgets?.Wants || 0) +
    (budgets?.['Savings & Investment'] || 0);

  // Calculate spending by category
  const spendingByCategory = {
    Needs: 0,
    Wants: 0,
    'Savings & Investment': 0,
  };

  if (transactions && transactions.length > 0) {
    transactions.forEach(tx => {
      if (tx?.type === 'expense') {
        const category = tx.category || 'Wants';
        if (category in spendingByCategory) {
          spendingByCategory[category] += tx.amount || 0;
        } else {
          spendingByCategory['Wants'] += tx.amount || 0;
        }
      }
    });
  }

  // Calculate budget adherence
  const budgetAdherence = {
    Needs: totalBudget > 0 ? Math.min((spendingByCategory.Needs / (budgets?.Needs || 1)) * 100, 100) : 0,
    Wants: totalBudget > 0 ? Math.min((spendingByCategory.Wants / (budgets?.Wants || 1)) * 100, 100) : 0,
    'Savings & Investment': totalBudget > 0 ? Math.min((spendingByCategory['Savings & Investment'] / (budgets?.['Savings & Investment'] || 1)) * 100, 100) : 0,
  };

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
          Budget Planning 💰
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Plan and track your spending toward financial wellness
        </p>
      </motion.div>

      {/* Budget Status */}
      {totalBudget > 0 && (
        <motion.div className="space-y-3 sm:space-y-4" variants={itemVariants}>
          <h2 className="text-lg font-bold">Your Budget Allocation</h2>

          {['Needs', 'Wants', 'Savings & Investment'].map((category, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">
                        {category === 'Needs'
                          ? '🏠 Essential Needs'
                          : category === 'Wants'
                            ? '🎯 Wants & Lifestyle'
                            : '📈 Savings & Investment'}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Budget: ₹{(budgets?.[category] || 0).toLocaleString()} • Spent: ₹{spendingByCategory[category].toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <ProgressAnimation
                    label={`${Math.round(budgetAdherence[category])}% of budget used`}
                    value={budgetAdherence[category]}
                    max={100}
                    variant={
                      budgetAdherence[category] <= 80
                        ? 'success'
                        : budgetAdherence[category] <= 100
                          ? 'growth'
                          : 'default'
                    }
                    showGlow={true}
                  />

                  {budgetAdherence[category] > 100 && (
                    <motion.p
                      className="text-xs font-semibold"
                      style={{ color: '#F59E0B' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ⚠️ Over budget by ₹{Math.round(spendingByCategory[category] - (budgets?.[category] || 0)).toLocaleString()}
                    </motion.p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Spending Insights */}
      {transactions && transactions.filter(t => t?.type === 'expense').length > 0 && (
        <motion.div variants={itemVariants}>
          <CuriosityWidget
            title="Spending Insight"
            message="Your spending patterns reveal opportunities for optimization"
            detail={`You've spent ₹${spendingByCategory.Wants.toLocaleString()} on wants and ₹${spendingByCategory.Needs.toLocaleString()} on needs. Consider adjusting your budget allocation to match your actual spending.`}
            type="discovery"
            initialExpanded={false}
          />
        </motion.div>
      )}

      {/* Budget Planner Card */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Adjust Your Budget</h2>
          <BudgetPlanner
            transactions={transactions}
            budgets={budgets}
            onBudgetChange={updateBudget}
          />
        </GlassCard>
      </motion.div>

      {/* Spending visualization */}
      {transactions && transactions.filter(t => t?.type === 'expense').length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <NarrativeChart
              type="spending"
              title="Your Spending Story"
              icon="💳"
              data={['Needs', 'Wants', 'Savings & Investment'].map(cat => ({
                label: cat.replace(' & Investment', ''),
                value: spendingByCategory[cat],
              }))}
            />
          </GlassCard>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div className="space-y-3" variants={itemVariants}>
        <h2 className="text-lg font-bold">Smart Recommendations</h2>

        <CuriosityWidget
          title="50/30/20 Rule"
          message="A proven budget framework for financial health"
          detail="Allocate 50% for needs, 30% for wants, and 20% for savings. This balanced approach helps build wealth while maintaining lifestyle satisfaction."
          type="insight"
          initialExpanded={false}
        />

        {budgetAdherence.Wants > budgetAdherence.Needs && (
          <CuriosityWidget
            title="Lifestyle Check"
            message="Your wants spending exceeds your needs"
            detail="Consider if you can optimize lifestyle spending. Small reductions in discretionary spending can significantly increase your savings rate."
            type="suggestion"
            initialExpanded={false}
          />
        )}

        {budgetAdherence['Savings & Investment'] < 20 && (
          <CuriosityWidget
            title="Savings Opportunity"
            message="You have room to increase savings allocation"
            detail={`Increasing your savings rate from current levels to 20% could help you build financial security. Start with small, consistent contributions.`}
            type="suggestion"
            initialExpanded={false}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
