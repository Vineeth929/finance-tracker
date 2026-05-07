import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import BudgetPlanner from '../components/BudgetPlanner';

export default function BudgetPage() {
  const { transactions, budgets, updateBudget } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold gradient-text">Budget Planning</h1>
      <GlassCard>
        <BudgetPlanner
          transactions={transactions}
          budgets={budgets}
          onBudgetChange={updateBudget}
        />
      </GlassCard>
    </div>
  );
}
