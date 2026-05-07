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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowAddIncome(true)} className="btn btn-primary">
            + Income
          </button>
          <button onClick={() => setShowAddExpense(true)} className="btn btn-secondary">
            + Expense
          </button>
        </div>
      </div>

      {showAddIncome && (
        <GlassCard>
          <AddIncome onAddIncome={handleAddTransaction} />
        </GlassCard>
      )}

      {showAddExpense && (
        <GlassCard>
          <AddExpense onAddExpense={handleAddTransaction} />
        </GlassCard>
      )}

      <GlassCard>
        <h2 className="text-xl font-bold mb-4">All Transactions</h2>
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </GlassCard>
    </div>
  );
}
