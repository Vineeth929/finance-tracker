import React, { useState } from 'react';
import { useModals } from '../context/ModalContext';

export default function AddExpense({ onAddExpense }) {
  const { showToast } = useModals();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Needs',
    subcategory: 'Rent',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = {
    Needs: ['Rent', 'Food', 'Utilities', 'Transportation', 'Healthcare'],
    Wants: ['Entertainment', 'Shopping', 'Dining Out', 'Subscriptions', 'Hobbies'],
    'Savings & Investment': ['Savings', 'Investments', 'Insurance']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));

    // Reset subcategory if category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subcategory: categories[value][0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    onAddExpense({
      type: 'expense',
      amount: formData.amount,
      category: formData.category,
      subcategory: formData.subcategory,
      notes: formData.notes,
      date: formData.date
    });

    setFormData({
      amount: '',
      category: 'Needs',
      subcategory: 'Rent',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Expense</h2>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-100 rounded-lg">
          ✅ Expense added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select"
          >
            {Object.keys(categories).map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="select"
          >
            {categories[formData.category].map(subcat => (
              <option key={subcat}>{subcat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes..."
            className="input resize-none h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          ✅ Add Expense
        </button>
      </form>
    </div>
  );
}
