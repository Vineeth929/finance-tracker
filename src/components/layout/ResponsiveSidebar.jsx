import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, BarChart3, TrendingUp, Wallet, Target, Newspaper, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Primary: Core financial tracking features
const primaryMenu = [
  { path: '/', label: 'Dashboard', icon: BarChart3, id: 'dashboard' },
  { path: '/transactions', label: 'Transactions', icon: Wallet, id: 'transactions' },
  { path: '/budget', label: 'Budget', icon: BarChart3, id: 'budget' },
  { path: '/goals', label: 'Goals', icon: Target, id: 'goals' },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp, id: 'analytics' },
];

// Secondary: Optional features (Markets, News)
const secondaryMenu = [
  { path: '/markets', label: 'Markets', icon: TrendingUp, id: 'markets' },
  { path: '/news', label: 'News', icon: Newspaper, id: 'news' },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  exit: { x: -280, opacity: 0, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ResponsiveSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Desktop sidebar - Premium Design
  const desktopSidebar = (
    <motion.div
      animate={{ width: sidebarCollapsed ? 80 : 256 }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-30 pt-6"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '1px solid var(--glass-border)',
      }}
    >
      {/* Logo */}
      <motion.div
        animate={{ marginX: sidebarCollapsed ? 'auto' : 0 }}
        className="px-4 mb-10 text-center transition-all duration-300"
      >
        <p className="text-3xl font-bold gradient-text">💰</p>
        {!sidebarCollapsed && (
          <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Finance Tracker</p>
        )}
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scroll-smooth">
        {/* Primary Menu - Core Financial Features */}
        <div>
          {primaryMenu.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className="relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--glass-active-bg)' : 'transparent',
                  borderColor: active ? 'var(--glass-active-border)' : 'transparent',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--glass-hover-bg)';
                    e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} className="flex-shrink-0 transition-colors duration-200" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium transition-colors duration-200">{item.label}</span>
                )}
                {active && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Menu - Optional Features (Collapsible) */}
        {!sidebarCollapsed && (
          <div className="pt-4 mt-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <span>MORE</span>
              <motion.div
                animate={{ rotate: showSecondary ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>

            <AnimatePresence>
              {showSecondary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 mt-2 overflow-hidden"
                >
                  {secondaryMenu.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="relative flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all duration-200"
                        style={{
                          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: active ? 'var(--glass-active-bg)' : 'transparent',
                          borderColor: active ? 'var(--glass-active-border)' : 'transparent',
                          border: '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'var(--glass-hover-bg)';
                            e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <Icon size={16} className="flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="px-3 py-4 space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--glass-hover-bg)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <User size={20} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Profile</span>}
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--glass-hover-bg)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Settings size={20} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={{ color: 'var(--color-danger)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--glass-hover-bg)';
              e.currentTarget.style.color = 'var(--color-danger-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-danger)';
            }}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="mx-3 mb-4 p-2.5 rounded-lg transition-all duration-200"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--glass-hover-bg)';
          e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--glass-bg)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
      </motion.button>
    </motion.div>
  );

  // Mobile sidebar (drawer) - Premium Glassmorphism
  const mobileSidebar = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Premium Dark Overlay */}
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background: 'var(--overlay-dark)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Premium Drawer */}
          <motion.div
            key="drawer"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 w-72 h-screen z-50 flex flex-col pt-6"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur-strong)',
              WebkitBackdropFilter: 'var(--glass-blur-strong)',
              borderRight: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-2xl)',
            }}
          >
            {/* Header */}
            <div className="px-6 mb-8 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold gradient-text">💰</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>Finance Tracker</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass-hover-bg)';
                  e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--glass-bg)';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scroll-smooth">
              {/* Primary Menu */}
              {primaryMenu.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200"
                      style={{
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: active ? 'var(--glass-active-bg)' : 'transparent',
                        border: `1px solid ${active ? 'var(--glass-active-border)' : 'transparent'}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'var(--glass-hover-bg)';
                          e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          className="ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-purple-400" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Secondary Menu */}
              <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <button
                  onClick={() => setShowSecondary(!showSecondary)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <span>MORE</span>
                  <motion.div
                    animate={{ rotate: showSecondary ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showSecondary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 mt-2 overflow-hidden"
                    >
                      {secondaryMenu.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
                            style={{
                              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                              background: active ? 'var(--glass-active-bg)' : 'transparent',
                              border: `1px solid ${active ? 'var(--glass-active-border)' : 'transparent'}`,
                            }}
                            onMouseEnter={(e) => {
                              if (!active) {
                                e.currentTarget.style.background = 'var(--glass-hover-bg)';
                                e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!active) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'transparent';
                              }
                            }}
                          >
                            <Icon size={16} className="flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Bottom Actions */}
            <div style={{ borderTop: '1px solid var(--glass-border)' }}>
              <div className="px-4 py-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--glass-hover-bg)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <User size={20} />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--glass-hover-bg)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Settings size={20} />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--color-danger)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--glass-hover-bg)';
                    e.currentTarget.style.color = 'var(--color-danger-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-danger)';
                  }}
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Mobile header - Premium Design
  const mobileHeader = (
    <motion.div
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 md:hidden z-30 px-4 py-3"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div className="flex items-center justify-between h-14">
        <p className="text-lg font-bold gradient-text">💰 Finance</p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-lg transition-all duration-200"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--glass-hover-bg)';
            e.currentTarget.style.borderColor = 'var(--glass-hover-border)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass-bg)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>
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
