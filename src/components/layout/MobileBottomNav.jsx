import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Wallet, Target, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Core financial features only - Markets & News in "More" menu
  const tabs = [
    { path: '/', icon: Home, label: 'Home', id: 'dashboard' },
    { path: '/transactions', icon: Wallet, label: 'Money', id: 'transactions' },
    { path: '/budget', icon: BarChart3, label: 'Budget', id: 'budget' },
    { path: '/goals', icon: Target, label: 'Goals', id: 'goals' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics', id: 'analytics' },
    { path: '/settings', icon: Settings, label: 'More', id: 'settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 px-3 py-2.5"
      style={{
        background: 'linear-gradient(180deg, var(--surface-level-2) 0%, var(--surface-level-1) 100%)',
        borderTop: '1.5px solid var(--glass-border)',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="flex justify-around items-center gap-1">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative flex-1"
              style={{
                color: active ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--glass-hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={20} className="mb-0.5 transition-transform duration-200" />
              <span className="text-xs font-semibold transition-colors duration-200">{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="activeBg"
                  className="absolute -bottom-2.5 w-6 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
