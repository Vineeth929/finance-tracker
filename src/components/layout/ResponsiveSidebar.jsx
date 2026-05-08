import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, BarChart3, TrendingUp, Wallet, Target, Newspaper, Settings, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3, id: 'dashboard' },
  { path: '/markets', label: 'Markets', icon: TrendingUp, id: 'markets' },
  { path: '/transactions', label: 'Transactions', icon: Wallet, id: 'transactions' },
  { path: '/budget', label: 'Budget', icon: BarChart3, id: 'budget' },
  { path: '/goals', label: 'Goals', icon: Target, id: 'goals' },
  { path: '/news', label: 'News', icon: Newspaper, id: 'news' },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp, id: 'analytics' },
];

export default function ResponsiveSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  // Desktop sidebar
  const desktopSidebar = (
    <motion.div
      animate={{ width: sidebarCollapsed ? 80 : 256 }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen glass border-r border-white/10 bg-black/40 backdrop-blur-xl z-30 pt-6"
    >
      {/* Logo */}
      <motion.div
        animate={{ marginX: sidebarCollapsed ? 'auto' : 0 }}
        className="px-4 mb-8 text-center"
      >
        <p className="text-2xl font-bold gradient-text">💰</p>
        {!sidebarCollapsed && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Finance Tracker</p>
        )}
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              style={active ? { background: 'rgba(99, 102, 241, 0.15)' } : {}}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {active && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
        >
          <User size={20} />
          {!sidebarCollapsed && <span className="text-sm font-medium">Profile</span>}
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Settings size={20} />
          {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="mx-3 mb-4 p-2 rounded-lg glass hover:bg-white/10 transition-colors"
      >
        {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
      </motion.button>
    </motion.div>
  );

  // Mobile sidebar (drawer)
  const mobileSidebar = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            className="fixed left-0 top-0 w-64 h-screen glass bg-black/40 backdrop-blur-xl z-50 flex flex-col pt-6"
          >
            {/* Header */}
            <div className="px-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold gradient-text">💰</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Finance Tracker</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active ? 'text-white' : 'text-gray-400'
                      }`}
                      style={active ? { background: 'rgba(99, 102, 241, 0.15)' } : {}}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-white/10 px-3 py-4 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200"
              >
                <User size={20} />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200"
              >
                <Settings size={20} />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:text-rose-300"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Mobile header
  const mobileHeader = (
    <motion.div
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 md:hidden glass border-b border-white/10 px-4 py-4 z-30 flex items-center justify-between"
    >
      <p className="text-lg font-bold gradient-text">💰 Finance</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2 rounded-lg hover:bg-white/10"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>
    </motion.div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileHeader}
      {mobileSidebar}
    </>
  );
}
