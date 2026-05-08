import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumStockCard({ stock, index }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isPositive = stock.change24h >= 0;

  // Generate mock sparkline data
  const sparklineData = Array.from({ length: 12 }, (_, i) => ({
    value: stock.currentPrice * (1 + (Math.random() - 0.5) * 0.02)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
      className="glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Background gradient glow */}
      <div
        className={`absolute inset-0 ${isPositive ? 'from-emerald-500/10 to-transparent' : 'from-rose-500/10 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative z-10 space-y-3">
        {/* Header: Symbol + Favorite */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isPositive ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-pink-600'} flex items-center justify-center font-bold text-white`}>
              {stock.symbol.substring(0, 2)}
            </div>
            <div>
              <p className="font-bold text-sm">{stock.symbol}</p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">NSE</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-lg transition-all ${
              isFavorite ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Price Section */}
        <div className="space-y-1">
          <motion.p
            key={stock.currentPrice}
            animate={{ scale: 1 }}
            className="text-2xl font-bold gradient-text"
          >
            ₹{Math.round(stock.currentPrice).toLocaleString()}
          </motion.p>
          <div className={`flex items-center gap-2 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-semibold text-sm">
              {isPositive ? '+' : ''}{stock.change24h.toFixed(2)}%
            </span>
            <span style={{ color: 'var(--text-secondary)' }} className="text-xs">
              ({isPositive ? '+' : ''}₹{Math.abs(stock.previousClose * (stock.change24h / 100)).toFixed(0)})
            </span>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                dot={false}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">High</p>
            <p className="text-sm font-semibold">₹{Math.round(stock.dayHigh).toLocaleString()}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Low</p>
            <p className="text-sm font-semibold">₹{Math.round(stock.dayLow).toLocaleString()}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-sm text-xs"
          >
            Buy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary btn-sm text-xs"
          >
            Sell
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
