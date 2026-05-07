import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// v2.0 - Premium fintech dashboard

// Layout
import Sidebar from './components/layout/Sidebar';

// Auth Pages
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

// Pages
import DashboardPage from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import BudgetPage from './pages/Budget';
import GoalsPage from './pages/Goals';
import MarketsPage from './pages/Markets';
import NewsPage from './pages/News';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Profile from './components/Profile';

function ProtectedLayout({ children }) {
  const { darkMode } = useApp();
  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100'
        : 'bg-gradient-to-br from-white via-blue-50 to-white text-gray-900'
    }`}>
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { darkMode } = useApp();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-white via-blue-50 to-white'
      }`}>
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/transactions" element={<ProtectedLayout><TransactionsPage /></ProtectedLayout>} />
          <Route path="/budget" element={<ProtectedLayout><BudgetPage /></ProtectedLayout>} />
          <Route path="/goals" element={<ProtectedLayout><GoalsPage /></ProtectedLayout>} />
          <Route path="/markets" element={<ProtectedLayout><MarketsPage /></ProtectedLayout>} />
          <Route path="/news" element={<ProtectedLayout><NewsPage /></ProtectedLayout>} />
          <Route path="/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
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
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
