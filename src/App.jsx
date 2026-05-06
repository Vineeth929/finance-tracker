import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';

// Auth Components
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Components
import Dashboard from './components/Dashboard';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import SmartSuggestions from './components/SmartSuggestions';
import TransactionList from './components/TransactionList';
import BudgetPlanner from './components/BudgetPlanner';
import Analytics from './components/Analytics';
import SearchFilter from './components/SearchFilter';
import NavBar from './components/NavBar';

// Utilities
import {
  calculateTotals,
  getSuggestions,
  filterByMonth,
  getAvailableMonths,
  searchTransactions
} from './utils/calculations';
import { api } from './hooks/useApi';

const TABS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'income', icon: '💵', label: 'Add Income' },
  { id: 'expense', icon: '💳', label: 'Add Expense' },
  { id: 'search', icon: '🔍', label: 'Search' },
  { id: 'budget', icon: '💰', label: 'Budget' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'transactions', icon: '📋', label: 'History' }
];

function DashboardLayout() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({
    'Needs': 0,
    'Wants': 0,
    'Savings & Investment': 0
  });
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fetch data on mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, budgetData] = await Promise.all([
        api.getTransactions(),
        api.getBudgets()
      ]);
      setTransactions(txData.map(t => ({ ...t, id: t._id })));
      setBudgets(budgetData);
    } catch (err) {
      const localTx = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
      const localBudgets = JSON.parse(localStorage.getItem('budgets') || '{}');
      if (localTx.length > 0 || Object.keys(localBudgets).length > 0) {
        setTransactions(localTx);
        setBudgets(localBudgets);
        setError('Using offline data. Backend unavailable.');
      } else {
        setError('Could not connect to server. Check if backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const availableMonths = getAvailableMonths(transactions);
  const filteredTransactions = filterByMonth(transactions, selectedMonth);
  const displayTransactions = searchResults !== null ? searchResults : filteredTransactions;
  const totals = calculateTotals(filteredTransactions);
  const suggestions = getSuggestions(transactions, selectedMonth);

  const addTransaction = async (transaction) => {
    try {
      const saved = await api.addTransaction(transaction);
      setTransactions(prev => [{ ...saved, id: saved._id }, ...prev]);
    } catch {
      const tx = { ...transaction, id: Date.now() };
      setTransactions(prev => [tx, ...prev]);
      localStorage.setItem('financeTransactions', JSON.stringify([tx, ...transactions]));
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (searchResults) setSearchResults(prev => prev.filter(t => t.id !== id));
    } catch {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('financeTransactions', JSON.stringify(updated));
      if (searchResults) setSearchResults(prev => prev.filter(t => t.id !== id));
    }
  };

  const editTransaction = async (id, updatedData) => {
    try {
      const updated = await api.updateTransaction(id, updatedData);
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...updated, id: updated._id } : t))
      );
    } catch {
      const updated = { ...updatedData, id };
      setTransactions(prev => prev.map(t => (t.id === id ? updated : t)));
      localStorage.setItem(
        'financeTransactions',
        JSON.stringify(transactions.map(t => (t.id === id ? updated : t)))
      );
    }
  };

  const handleBudgetChange = async (newBudgets) => {
    try {
      const saved = await api.updateBudgets(newBudgets);
      setBudgets(saved);
    } catch {
      alert('Failed to save budget. Try again.');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ transactions, budgets }, null, 2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr)
    );
    element.setAttribute(
      'download',
      `finance-data-${new Date().toISOString().split('T')[0]}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <NavBar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />

        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-200 rounded-lg flex justify-between items-center">
              <span>⚠️ {error}</span>
              <button onClick={fetchData} className="btn btn-secondary text-sm ml-4">
                Retry
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base transition-colors flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Month Filter */}
          {activeTab !== 'search' && (
            <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <label className="font-medium whitespace-nowrap">Filter by Month:</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="select max-w-xs text-sm sm:text-base"
              >
                <option value="">All Time</option>
                {availableMonths.map(month => {
                  const [year, monthNum] = month.split('-');
                  const date = new Date(year, parseInt(monthNum) - 1);
                  return (
                    <option key={month} value={month}>
                      {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="card text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">⏳ Loading your data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <Dashboard totals={totals} />
                  <SmartSuggestions suggestions={suggestions} />
                </div>
              )}
              {activeTab === 'income' && <AddIncome onAddIncome={addTransaction} />}
              {activeTab === 'expense' && <AddExpense onAddExpense={addTransaction} />}
              {activeTab === 'search' && (
                <div className="space-y-6">
                  <SearchFilter
                    transactions={filteredTransactions}
                    onSearchChange={setSearchResults}
                  />
                  {searchResults && (
                    <TransactionList
                      transactions={searchResults}
                      onDelete={deleteTransaction}
                      onEdit={editTransaction}
                    />
                  )}
                </div>
              )}
              {activeTab === 'budget' && (
                <BudgetPlanner
                  transactions={transactions}
                  budgets={budgets}
                  onBudgetChange={handleBudgetChange}
                  selectedMonth={selectedMonth}
                />
              )}
              {activeTab === 'analytics' && (
                <Analytics transactions={transactions} selectedMonth={selectedMonth} />
              )}
              {activeTab === 'transactions' && (
                <TransactionList
                  transactions={displayTransactions}
                  onDelete={deleteTransaction}
                  onEdit={editTransaction}
                />
              )}
            </>
          )}

          <div className="mt-12 flex gap-4 justify-center">
            <button onClick={exportData} className="btn btn-primary text-sm sm:text-base">
              📥 Export Data
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Auth Routes */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="dark:bg-gray-900">
                  <NavBar darkMode={false} onDarkModeToggle={() => {}} />
                  <Profile />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
