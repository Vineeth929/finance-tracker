import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketHero({ overview }) {
  const [animateNifty, setAnimateNifty] = useState(false);

  useEffect(() => {
    setAnimateNifty(true);
  }, []);

  const metrics = [
    {
      label: 'Nifty 50',
      value: overview?.nifty50 ? `₹${Math.round(overview.nifty50).toLocaleString()}` : '—',
      change: overview?.change24h || 0,
      icon: '📈',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      label: 'Sensex',
      value: overview?.sensex ? `₹${Math.round(overview.sensex).toLocaleString()}` : '—',
      change: overview?.change24h || 0,
      icon: '📊',
      color: 'from-purple-600 to-pink-600'
    },
    {
      label: 'Nifty Bank',
      value: overview?.niftyBank ? `₹${Math.round(overview.niftyBank).toLocaleString()}` : '—',
      change: overview?.change24h || 0,
      icon: '🏦',
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Market Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 rounded-2xl flex items-center justify-between border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span style={{ color: 'var(--text-secondary)' }}>Market Open • Last updated 2:29 PM</span>
        </div>
        <span className="text-sm font-semibold text-emerald-400">LIVE</span>
      </motion.div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden relative group`}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
                  {metric.label}
                </span>
                <span className="text-2xl">{metric.icon}</span>
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mb-3"
              >
                <p className="text-3xl font-bold gradient-text">{metric.value}</p>
              </motion.div>

              <div className={`flex items-center gap-2 ${metric.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metric.change >= 0 ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
                <span className="font-semibold">
                  {Math.abs(metric.change).toFixed(2)}% <span style={{ color: 'var(--text-secondary)' }}>(24h)</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Market Sentiment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Market Sentiment</h3>
          <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Bullish</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
        <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
          65% bullish sentiment • 25 stocks gained today
        </p>
      </motion.div>
    </div>
  );
}
