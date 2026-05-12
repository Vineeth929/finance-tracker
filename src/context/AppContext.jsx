import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({ Needs: 0, Wants: 0, 'Savings & Investment': 0 });
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setDarkMode = (value) => {
    setDarkModeState(value);
    localStorage.setItem('darkMode', JSON.stringify(value));
    if (value) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });
    if (!response.ok) {
      let errorMessage = `API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Fall back to statusText if response isn't JSON
      }
      throw new Error(errorMessage);
    }
    return response.json();
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await api('/transactions');
      setTransactions(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await api('/budgets');
      setBudgets(data || { Needs: 0, Wants: 0, 'Savings & Investment': 0 });
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setBudgets({ Needs: 0, Wants: 0, 'Savings & Investment': 0 });
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await api('/goals');
      setGoals(data || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      setError(err.message);
      setGoals([]);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const newTx = await api('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
      setTransactions([newTx, ...transactions]);
      return newTx;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api(`/transactions/${id}`, { method: 'DELETE' });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBudget = async (budget) => {
    try {
      const updated = await api('/budgets', {
        method: 'PUT',
        body: JSON.stringify(budget),
      });
      setBudgets(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addGoal = async (goal) => {
    try {
      const newGoal = await api('/goals', {
        method: 'POST',
        body: JSON.stringify(goal),
      });
      setGoals([...goals, newGoal]);
      return newGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      const updated = await api(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      setGoals(goals.map(g => g._id === id ? updated : g));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addGoalProgress = async (id, amount) => {
    try {
      const updated = await api(`/goals/${id}/add-progress`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
      });
      setGoals(goals.map(g => g._id === id ? updated : g));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api(`/goals/${id}`, { method: 'DELETE' });
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    setBudgets({ Needs: 0, Wants: 0, 'Savings & Investment': 0 });
    setGoals([]);
    setNotifications([]);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchTransactions();
      fetchBudgets();
      fetchGoals();
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const value = {
    user,
    setUser,
    transactions,
    setTransactions,
    budgets,
    setBudgets,
    goals,
    setGoals,
    notifications,
    setNotifications,
    darkMode,
    setDarkMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    loading,
    error,
    api,
    fetchTransactions,
    fetchBudgets,
    fetchGoals,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addGoal,
    updateGoal,
    addGoalProgress,
    deleteGoal,
    logout,
    apiUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
