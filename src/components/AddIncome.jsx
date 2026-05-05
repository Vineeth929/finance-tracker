import React, { useState } from 'react';

export default function AddIncome({ onAddIncome }) {
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0]
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onAddIncome({
      type: 'income',
      amount: formData.amount,
      source: formData.source,
      date: formData.date,
      category: null
    });

    setFormData({
      amount: '',
      source: 'Salary',
      date: new Date().toISOString().split('T')[0]
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Income</h2>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-100 rounded-lg">
          ✅ Income added successfully!
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
          <label className="block text-sm font-medium mb-2">Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="select"
          >
            <option>Salary</option>
            <option>Freelance</option>
            <option>Investment Returns</option>
            <option>Bonus</option>
            <option>Gift</option>
            <option>Other</option>
          </select>
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
          ✅ Add Income
        </button>
      </form>
    </div>
  );
}
