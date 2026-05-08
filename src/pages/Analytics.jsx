import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Analytics from '../components/Analytics';

export default function AnalyticsPage() {
  const { transactions } = useApp();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Analytics</h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Visualize your spending patterns and financial insights
        </p>
      </div>

      {/* Analytics Card */}
      <GlassCard className="p-4 sm:p-6">
        <Analytics transactions={transactions} />
      </GlassCard>
    </div>
  );
}
