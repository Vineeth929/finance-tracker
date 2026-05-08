import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Star, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumStockCardV2({ stock, index }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isPositive = stock.change24h >= 0;

  const sparklineData = Array.from({ length: 15 }, (_, i) => ({
    value: stock.currentPrice * (1 + (Math.random() - 0.5) * 0.03)
  }));

  const marketCap = Math.floor(Math.random() * 500000);
  const volume = Math.floor(Math.random() * 100000000);
  const pe = (Math.random() * 30 + 10).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${
          isPositive
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20'
            : 'bg-gradient-to-r from-rose-500/20 to-pink-500/20'
        }`}
      />

      <div className="relative glass p-5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                isPositive ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-pink-600'
              } flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-lg font-bold text-white">{stock.symbol.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-white">{stock.symbol}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>NSE • Market Cap</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.15 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: isFavorite ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
              }}
            >
              <Star
                size={16}
                className={isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </motion.button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <p className="text-2xl font-bold gradient-text">₹{Math.round(stock.currentPrice).toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-1">
            {isPositive ? (
              <TrendingUp size={16} className="text-emerald-400" />
            ) : (
              <TrendingDown size={16} className="text-rose-400" />
            )}
            <span className={`font-semibold text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{stock.change24h.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              (₹{Math.abs(stock.previousClose * (stock.change24h / 100)).toFixed(0)})
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-12 -mx-5 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>High</p>
            <p className="text-sm font-bold">₹{Math.round(stock.dayHigh).toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Low</p>
            <p className="text-sm font-bold">₹{Math.round(stock.dayLow).toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>PE</p>
            <p className="text-sm font-bold">{pe}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-1 mb-4 pb-4 border-b border-white/5">
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Market Cap</span>
            <span className="text-white font-semibold">₹{(marketCap / 1000).toFixed(0)}B</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Volume</span>
            <span className="text-white font-semibold">{(volume / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary btn-sm justify-center text-xs"
          >
            Buy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-secondary btn-sm justify-center text-xs"
          >
            Sell
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
