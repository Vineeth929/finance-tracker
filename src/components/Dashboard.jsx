import React from 'react';
import { PieChart } from './Charts';

export default function Dashboard({ totals }) {
  const savingsPercent = totals.income > 0 ? ((totals.savings / totals.income) * 100).toFixed(1) : 0;
  const expensePercent = totals.income > 0 ? ((totals.expenses / totals.income) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-green-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totals.income.toFixed(2)}</p>
        </div>

        <div className="card border-l-4 border-red-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{totals.expenses.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{expensePercent}% of income</p>
        </div>

        <div className="card border-l-4 border-blue-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Savings</p>
          <p className={`text-3xl font-bold mt-2 ${totals.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{totals.savings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{savingsPercent}% of income</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Income vs Expenses</h2>
        <PieChart totals={totals} />
      </div>
    </div>
  );
}
