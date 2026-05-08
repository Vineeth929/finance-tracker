import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Download, Info, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { darkMode, setDarkMode, transactions, budgets } = useApp();
  const [exportLoading, setExportLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    try {
      setExportLoading(true);
      const dataStr = JSON.stringify({ transactions, budgets }, null, 2);
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr)
      );
      element.setAttribute(
        'download',
        `finance-data-${new Date().toISOString().split('T')[0]}.json`
      );
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } finally {
      setExportLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-display gradient-text">Settings</h1>
        <p className="text-lg text-secondary">
          Customize your Financial environment and manage your data
        </p>
      </motion.div>

      {/* Display Preferences */}
      <motion.div variants={itemVariants} className="surface-card">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--emotion-analytics-bg)' }}
          >
            <Palette size={24} style={{ color: 'var(--emotion-analytics)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-heading">Display Preferences</h2>
            <p className="text-sm text-secondary">Personalize your visual experience</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-xl surface-interactive"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'var(--surface-level-3)' }}>
                {darkMode ? (
                  <Moon size={20} style={{ color: 'var(--emotion-analytics)' }} />
                ) : (
                  <Sun size={20} style={{ color: 'var(--emotion-goals)' }} />
                )}
              </div>
              <div>
                <p className="font-heading text-base">Theme Mode</p>
                <p className="text-sm text-secondary">
                  {darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-16 h-8 rounded-full transition-all"
              style={{
                background: darkMode ? 'var(--emotion-investments)' : 'var(--emotion-goals)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full"
                animate={{ x: darkMode ? 32 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={itemVariants} className="surface-card">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--emotion-savings-bg)' }}
          >
            <Download size={24} style={{ color: 'var(--emotion-savings)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-heading">Data Management</h2>
            <p className="text-sm text-secondary">Export and manage your financial records</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Export Data Section */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-6 rounded-xl surface-interactive"
          >
            <div className="mb-4">
              <p className="font-heading text-lg mb-1">Export Your Financial Data</p>
              <p className="text-sm text-secondary">
                Download a complete snapshot of all your transactions and budgets as a JSON file
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleExportData}
                disabled={exportLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2 rounded-lg font-heading flex items-center gap-2 transition-all ${
                  exportLoading
                    ? 'opacity-75 cursor-not-allowed'
                    : 'btn btn-primary'
                }`}
              >
                {exportLoading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      ⏳
                    </motion.span>
                    Exporting...
                  </>
                ) : (
                  <>
                    📥 Export Data
                  </>
                )}
              </motion.button>
              {exportSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: 'var(--emotion-savings)' }}
                >
                  ✓ Downloaded successfully
                </motion.div>
              )}
            </div>
            <p className="text-xs text-muted mt-3">
              {transactions?.length || 0} transactions • {Object.keys(budgets || {}).length || 0} budgets
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div variants={itemVariants} className="surface-card">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--emotion-savings-bg)' }}
          >
            <Info size={24} style={{ color: 'var(--emotion-savings)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-heading">About</h2>
            <p className="text-sm text-secondary">Learn more about this application</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Application Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg"
            style={{ background: 'var(--surface-level-2)' }}
          >
            <p className="text-lg font-heading gradient-text mb-2">💰 Finance Tracker 2.0</p>
            <p className="text-base text-secondary mb-4">
              Your emotionally intelligent financial companion designed to transform how you manage money
            </p>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-tertiary)' }}>
              <p>✓ Real-time financial heartbeat monitoring</p>
              <p>✓ Emotional design that celebrates your progress</p>
              <p>✓ Beautiful data visualization and insights</p>
              <p>✓ Completely non-manipulative and authentic</p>
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg border-t-2"
            style={{
              background: 'var(--bg-surface-2)',
              borderColor: 'var(--emotion-analytics)',
            }}
          >
            <p className="font-heading text-sm mb-3" style={{ color: 'var(--emotion-analytics)' }}>
              POWERED BY
            </p>
            <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>Frontend: React, Framer Motion, Tailwind CSS</p>
              <p>Backend: Node.js, Express, MongoDB</p>
              <p>APIs: CoinGecko, Financial RSS Feeds</p>
              <p>Design: Glassmorphism, Premium Fintech</p>
            </div>
          </motion.div>

          {/* Version Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg"
            style={{ background: 'var(--surface-level-2)' }}
          >
            <p className="text-xs text-muted">Version 2.0 • Emotional Design System • © 2026</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Fun Message */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, var(--emotion-savings-bg) 0%, var(--emotion-goals-bg) 100%)',
          border: '1px solid var(--emotion-savings-border)',
        }}
      >
        <p className="text-center text-base font-heading">
          ✨ You're using the most emotionally intelligent financial app in existence
        </p>
      </motion.div>
    </motion.div>
  );
}
