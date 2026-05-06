import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ darkMode, onDarkModeToggle }) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => isAuthenticated && navigate('/')}
          className={`text-xl sm:text-2xl font-bold text-blue-600 flex items-center gap-2 ${
            isAuthenticated ? 'cursor-pointer hover:opacity-80 transition' : ''
          }`}
        >
          <span>💰</span>
          <span className="hidden sm:inline">Finance Tracker</span>
        </div>

        {/* Right Section */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={onDarkModeToggle}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium transition text-gray-700 dark:text-gray-300"
            >
              {darkMode ? '☀️' : '🌙'}
              <span className="hidden sm:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition font-bold text-lg"
                title={user?.fullName}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.fullName?.charAt(0).toUpperCase() || '👤'
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <p className="font-bold text-gray-900 dark:text-gray-100 break-words">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    Profile Settings
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-600"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                  >
                    <span>🚪</span>
                    Log Out
                  </button>
                </div>
              )}

              {/* Click outside to close */}
              {showProfileMenu && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
