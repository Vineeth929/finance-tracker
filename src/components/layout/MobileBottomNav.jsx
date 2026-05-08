import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Wallet, Target, Newspaper, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: Home, label: 'Home', id: 'dashboard' },
    { path: '/markets', icon: TrendingUp, label: 'Markets', id: 'markets' },
    { path: '/transactions', icon: Wallet, label: 'Wallet', id: 'transactions' },
    { path: '/goals', icon: Target, label: 'Goals', id: 'goals' },
    { path: '/news', icon: Newspaper, label: 'News', id: 'news' },
    { path: '/settings', icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-white/10 px-2 py-3 z-40"
    >
      <div className="flex justify-around items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                active
                  ? 'text-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={20} className="mb-0.5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="activeBg"
                  className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
