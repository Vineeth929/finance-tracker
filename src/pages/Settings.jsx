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
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-400">Easier on the eyes</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
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
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="font-medium mb-2">Export Your Data</p>
            <p className="text-sm text-gray-400 mb-4">Download all your transactions and budgets as a JSON file</p>
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
        <div className="space-y-3 text-sm text-gray-400">
          <p>💰 Finance Tracker v2.0</p>
          <p>A modern, intelligent fintech dashboard for personal finance management</p>
          <p className="pt-3 border-t border-white/10">
            Powered by React, Node.js, MongoDB, and free APIs (CoinGecko, RSS)
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
