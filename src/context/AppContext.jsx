import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createAPIClient } from '../api/client';

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

  // Create API client once and memoize
  const apiClient = useMemo(() => createAPIClient(), []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await apiClient.transactions.list();
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
      const data = await apiClient.budgets.list();
      setBudgets(data || { Needs: 0, Wants: 0, 'Savings & Investment': 0 });
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setBudgets({ Needs: 0, Wants: 0, 'Savings & Investment': 0 });
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await apiClient.goals.list();
      setGoals(data || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      setError(err.message);
      setGoals([]);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const newTx = await apiClient.transactions.create(transaction);
      setTransactions([newTx, ...transactions]);
      return newTx;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiClient.transactions.delete(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBudget = async (budget) => {
    try {
      const updated = await apiClient.budgets.update(budget);
      setBudgets(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addGoal = async (goal) => {
    try {
      const newGoal = await apiClient.goals.create(goal);
      setGoals([...goals, newGoal]);
      return newGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      const updated = await apiClient.goals.update(id, updates);
      setGoals(goals.map(g => g._id === id ? updated : g));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addGoalProgress = async (id, amount) => {
    try {
      const updated = await apiClient.goals.addProgress(id, amount);
      setGoals(goals.map(g => g._id === id ? updated : g));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await apiClient.goals.delete(id);
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

  // Data initialization is now handled by useInitializeApp hook
  // This ensures auth is verified before data is fetched (no race condition)

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
