import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Analytics from '../components/Analytics';

export default function AnalyticsPage() {
  const { transactions } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
      <GlassCard>
        <Analytics transactions={transactions} />
      </GlassCard>
    </div>
  );
}
