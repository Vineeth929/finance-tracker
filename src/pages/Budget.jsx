import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import BudgetPlanner from '../components/BudgetPlanner';

export default function BudgetPage() {
  const { transactions, budgets, updateBudget } = useApp();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Budget Planning</h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Plan and track your monthly budget allocation
        </p>
      </div>

      {/* Budget Planner Card */}
      <GlassCard className="p-4 sm:p-6">
        <BudgetPlanner
          transactions={transactions}
          budgets={budgets}
          onBudgetChange={updateBudget}
        />
      </GlassCard>
    </div>
  );
}
