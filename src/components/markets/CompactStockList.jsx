import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CompactStockList({ title, stocks, type = 'gainers', icon: Icon }) {
  const isGainer = type === 'gainers';
  const color = isGainer ? 'text-emerald-400' : 'text-rose-400';
  const bgColor = isGainer ? 'from-emerald-500/10' : 'from-rose-500/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl bg-gradient-to-br ${bgColor} to-transparent`}
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className={color} size={20} />}
        <h3 className="font-bold gradient-text">{title}</h3>
      </div>

      <div className="space-y-2">
        {stocks && stocks.length > 0 ? (
          stocks.map((stock, idx) => (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all"
            >
              <div>
                <p className="font-semibold text-sm">{stock.symbol}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  ₹{Math.round(stock.currentPrice).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${color}`}>
                  {isGainer ? '+' : ''}{stock.change24h.toFixed(2)}%
                </p>
                <p className={`text-xs ${color}`}>
                  ₹{Math.abs(stock.previousClose * (stock.change24h / 100)).toFixed(0)}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
