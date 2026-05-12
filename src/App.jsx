console.log('🚀 [BOOTSTRAP] App.jsx loaded');

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import GlobalToastRenderer from './components/ui/GlobalToastRenderer';
import GlobalModalRenderer from './components/GlobalModalRenderer';
import { useInitializeApp } from './hooks/useInitializeApp';

// v2.0 - Premium fintech dashboard with responsive design

// Layout
import ResponsiveSidebar from './components/layout/ResponsiveSidebar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ResponsiveContainer from './components/layout/ResponsiveContainer';

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
  const { darkMode, sidebarCollapsed } = useApp();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100'
        : 'bg-gradient-to-br from-white via-blue-50 to-white text-gray-900'
    }`}>
      <ResponsiveSidebar />

      {/* Desktop main content */}
      <main className={`hidden md:block transition-all duration-300 pt-6 pb-6 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </main>

      {/* Mobile main content */}
      <main className="md:hidden pt-20 pb-24 px-3 sm:px-4">
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}

function AppContent() {
  const { authLoading } = useInitializeApp();
  const { isAuthenticated } = useAuth();
  const { darkMode } = useApp();

  console.log('🔍 [APPCONTENT] Render - authLoading:', authLoading, 'isAuthenticated:', isAuthenticated);

  if (authLoading) {
    console.log('⏳ [APPCONTENT] Still loading auth, showing spinner...');
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

  console.log('✅ [APPCONTENT] Auth loaded, rendering routes...');

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
  console.log('🚀 [APP] Root App component rendering...');
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ModalProvider>
            <AppProvider>
              <GlobalToastRenderer />
              <GlobalModalRenderer />
              <AppContent />
            </AppProvider>
          </ModalProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
