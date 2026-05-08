import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MarketInsights() {
  const [fearGreed, setFearGreed] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setFearGreed((prev) => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSentiment = (value) => {
    if (value > 80) return 'Extreme Greed';
    if (value > 60) return 'Bullish';
    if (value > 40) return 'Neutral';
    if (value > 20) return 'Bearish';
    return 'Extreme Fear';
  };

  const getSentimentColor = (value) => {
    if (value > 80) return 'text-orange-400';
    if (value > 60) return 'text-emerald-400';
    if (value > 40) return 'text-blue-400';
    if (value > 20) return 'text-amber-400';
    return 'text-rose-400';
  };

  const indicators = [
    { label: 'RSI (14)', value: 65, status: 'Overbought' },
    { label: 'MACD', value: 'Bullish', status: 'Positive' },
    { label: 'Bollinger', value: 'Upper Band', status: 'Strong' },
  ];

  return (
    <div className="space-y-4">
      {/* Fear & Greed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="mb-4">
          <h3 className="font-bold gradient-text">Market Sentiment</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Fear & Greed Index</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Index</span>
              <motion.span
                key={Math.floor(fearGreed)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-lg font-bold ${getSentimentColor(fearGreed)}`}
              >
                {Math.round(fearGreed)}
              </motion.span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <motion.div
                animate={{ width: `${fearGreed}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full bg-gradient-to-r ${
                  fearGreed > 60
                    ? 'from-emerald-500 to-teal-500'
                    : fearGreed > 40
                    ? 'from-blue-500 to-cyan-500'
                    : 'from-rose-500 to-orange-500'
                }`}
              />
            </div>
          </div>

          <p className={`text-sm font-semibold ${getSentimentColor(fearGreed)}`}>
            {getSentiment(fearGreed)}
          </p>
        </div>
      </motion.div>

      {/* Technical Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="mb-4">
          <h3 className="font-bold gradient-text">Technical Signals</h3>
        </div>

        <div className="space-y-2">
          {indicators.map((ind) => (
            <div
              key={ind.label}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'var(--glass-bg)' }}
            >
              <span className="text-sm font-medium">{ind.label}</span>
              <div className="text-right">
                <p className="text-sm font-bold">{ind.value}</p>
                <p className="text-xs text-emerald-400">{ind.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-2xl"
      >
        <h3 className="font-bold gradient-text mb-4">Market Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Gainers</span>
            <span className="text-emerald-400 font-semibold">18 stocks</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Losers</span>
            <span className="text-rose-400 font-semibold">7 stocks</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Unchanged</span>
            <span className="text-blue-400 font-semibold">5 stocks</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
