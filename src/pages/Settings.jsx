import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';

export default function SettingsPage() {
  const { darkMode, setDarkMode, transactions, budgets } = useApp();
  const [exportLoading, setExportLoading] = useState(false);

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
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold gradient-text">Settings</h1>

      {/* Preferences */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-6">Display Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Easier on the eyes</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-14 h-8 rounded-full transition-colors"
              style={{ background: darkMode ? 'var(--color-brand-primary)' : 'var(--glass-border)' }}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Data Management */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-6">Data Management</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <p className="font-medium mb-2">Export Your Data</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Download all your transactions and budgets as a JSON file</p>
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="btn btn-primary"
            >
              {exportLoading ? '⏳ Exporting...' : '📥 Export Data'}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* About */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-6">About</h2>
        <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>💰 Finance Tracker v2.0</p>
          <p>A modern, intelligent fintech dashboard for personal finance management</p>
          <p className="pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            Powered by React, Node.js, MongoDB, and free APIs (CoinGecko, RSS)
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
