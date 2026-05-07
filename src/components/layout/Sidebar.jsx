import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'transactions', label: 'Transactions', icon: '💳', path: '/transactions' },
  { id: 'budget', label: 'Budget', icon: '💰', path: '/budget' },
  { id: 'goals', label: 'Goals', icon: '🎯', path: '/goals' },
  { id: 'markets', label: 'Markets', icon: '📈', path: '/markets' },
  { id: 'news', label: 'News', icon: '📰', path: '/news' },
  { id: 'analytics', label: 'Analytics', icon: '📉', path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`glass fixed left-0 top-0 h-screen transition-all duration-300 z-40 flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ borderColor: 'var(--glass-border)' }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
        {!sidebarCollapsed && <h1 className="text-xl font-bold gradient-text">💰 Finance</h1>}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {sidebarCollapsed ? '▶️' : '◀️'}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'gradient-brand text-white shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                  style={{ color: isActive ? 'white' : 'var(--text-secondary)' }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--glass-border)' }}>
        {!sidebarCollapsed && user && (
          <div className="text-xs">
            <p style={{ color: 'var(--text-secondary)' }}>Logged in as</p>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold truncate">{user.fullName || user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full btn btn-secondary btn-sm justify-center"
        >
          {sidebarCollapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
