import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateTotals, getSuggestions, filterByMonth, getAvailableMonths } from './utils/calculations';
import Dashboard from './components/Dashboard';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import SmartSuggestions from './components/SmartSuggestions';
import TransactionList from './components/TransactionList';

export default function App() {
  const [transactions, setTransactions] = useLocalStorage('financeTransactions', []);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const availableMonths = getAvailableMonths(transactions);
  const filteredTransactions = filterByMonth(transactions, selectedMonth);
  const totals = calculateTotals(filteredTransactions);
  const suggestions = getSuggestions(transactions, selectedMonth);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `finance-data-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">💰 Finance Tracker</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-secondary"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
            {['dashboard', 'income', 'expense', 'transactions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'income' && '💵 Add Income'}
                {tab === 'expense' && '💳 Add Expense'}
                {tab === 'transactions' && '📋 Transactions'}
              </button>
            ))}
          </div>

          {/* Month Filter */}
          <div className="mb-6 flex gap-4 items-center">
            <label className="font-medium">Filter by Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select max-w-xs"
            >
              <option value="">All Time</option>
              {availableMonths.map(month => {
                const [year, monthNum] = month.split('-');
                const date = new Date(year, parseInt(monthNum) - 1);
                const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                return <option key={month} value={month}>{label}</option>;
              })}
            </select>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <Dashboard totals={totals} />
              <SmartSuggestions suggestions={suggestions} />
            </div>
          )}

          {/* Add Income Tab */}
          {activeTab === 'income' && (
            <AddIncome onAddIncome={addTransaction} />
          )}

          {/* Add Expense Tab */}
          {activeTab === 'expense' && (
            <AddExpense onAddExpense={addTransaction} />
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <TransactionList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
            />
          )}

          {/* Export Button */}
          <div className="mt-12 flex gap-4 justify-center">
            <button
              onClick={exportData}
              className="btn btn-primary"
            >
              📥 Export Data as JSON
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
