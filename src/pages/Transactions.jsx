import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import AddIncome from '../components/AddIncome';
import AddExpense from '../components/AddExpense';
import TransactionList from '../components/TransactionList';

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useApp();
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const handleAddTransaction = async (tx) => {
    await addTransaction(tx);
    setShowAddIncome(false);
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Transactions</h1>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddIncome(true)}
            className="btn btn-primary btn-sm sm:btn-base flex-1 sm:flex-none"
          >
            + <span className="hidden sm:inline">Income</span><span className="sm:hidden">In</span>
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn btn-secondary btn-sm sm:btn-base flex-1 sm:flex-none"
          >
            + <span className="hidden sm:inline">Expense</span><span className="sm:hidden">Out</span>
          </button>
        </div>
      </div>

      {/* Add Income Form */}
      {showAddIncome && (
        <GlassCard className="p-4 sm:p-6">
          <AddIncome onAddIncome={handleAddTransaction} />
        </GlassCard>
      )}

      {/* Add Expense Form */}
      {showAddExpense && (
        <GlassCard className="p-4 sm:p-6">
          <AddExpense onAddExpense={handleAddTransaction} />
        </GlassCard>
      )}

      {/* Transactions List */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">All Transactions</h2>
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </GlassCard>
    </div>
  );
}
