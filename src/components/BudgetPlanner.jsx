import React, { useState } from 'react';
import { calculateBudgetStatus } from '../utils/calculations';
import { useModals } from '../context/ModalContext';

const CATEGORIES = ['Needs', 'Wants', 'Savings & Investment'];

export default function BudgetPlanner({ transactions, budgets, onBudgetChange, selectedMonth }) {
  const { showToast, showModal } = useModals();
  const [editingCategory, setEditingCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [pendingBudgetUpdate, setPendingBudgetUpdate] = useState(null);

  const safeBudgets = budgets || { Needs: 0, Wants: 0, 'Savings & Investment': 0 };
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const budgetStatus = calculateBudgetStatus(safeTransactions, safeBudgets, selectedMonth);

  const handleEditClick = (category, currentAmount) => {
    setEditingCategory(category);
    setInputValue(currentAmount.toString());
  };

  const handleSaveBudget = (category) => {
    const amount = parseFloat(inputValue) || 0;
    setPendingBudgetUpdate({ category, newAmount: amount });

    showModal({
      type: 'confirm',
      title: `Update ${category} Budget`,
      message: `Set ${category} budget to ₹${amount.toLocaleString('en-IN')}?`,
      details: `Current budget: ₹${(safeBudgets[category] || 0).toLocaleString('en-IN')}`,
      confirmText: 'Update Budget',
      cancelText: 'Cancel',
      isDangerous: false,
      onConfirm: handleConfirmBudget,
      onCancel: () => {
        setPendingBudgetUpdate(null);
      }
    });
  };

  const handleConfirmBudget = async () => {
    if (!pendingBudgetUpdate) return;

    try {
      const { category, newAmount } = pendingBudgetUpdate;
      await onBudgetChange({ ...safeBudgets, [category]: newAmount });
      showToast(`${category} budget updated to ₹${newAmount.toLocaleString('en-IN')}`, 'success');
      setEditingCategory(null);
      setPendingBudgetUpdate(null);
    } catch (err) {
      showToast(`Failed to update budget: ${err.message}`, 'error');
      console.error('Failed to update budget:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">💰 Budget Planner</h2>
      <div className="space-y-4">
        {CATEGORIES.map(category => {
          const status = budgetStatus.find(s => s.category === category);
          const isEditing = editingCategory === category;

          return (
            <div key={category} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{category}</h3>
                {status && status.budget > 0 && (
                  <span className={`text-sm px-2 py-1 rounded ${status.isOverBudget ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'}`}>
                    {status.isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
                  </span>
                )}
              </div>
              <div className="space-y-2 mb-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input flex-1" placeholder="0.00" step="0.01" min="0" />
                    <button onClick={() => handleSaveBudget(category)} className="btn btn-primary">Save</button>
                    <button onClick={() => setEditingCategory(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                ) : (
                  <div onClick={() => handleEditClick(category, safeBudgets[category] || 0)} className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget: ₹{(safeBudgets[category] || 0).toFixed(2)}</p>
                  </div>
                )}
              </div>
              {status && status.budget > 0 && (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className={`h-full transition-all ${status.isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${status.percent}%` }} />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Spent: ₹{status.spent.toFixed(2)}</span>
                    <span className={status.isOverBudget ? 'text-red-600' : 'text-green-600'}>{status.isOverBudget ? '-' : '+'}₹{Math.abs(status.remaining).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
