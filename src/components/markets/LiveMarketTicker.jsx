import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LiveMarketTicker({ stocks = [] }) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const tickerStocks = stocks.length > 0 ? stocks : Array(10).fill(null);

  return (
    <div className="glass p-4 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <p className="text-xs font-semibold text-emerald-400">LIVE TICKER</p>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: -scrollPosition * 2 }}
          transition={{ type: 'linear', duration: 0 }}
        >
          {[...tickerStocks, ...tickerStocks].map((stock, idx) => (
            <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg flex-shrink-0">
              {stock ? (
                <>
                  <span className="font-bold text-white text-sm">{stock.symbol}</span>
                  <span className="text-white font-semibold">₹{Math.round(stock.currentPrice)}</span>
                  <span className={`text-xs font-semibold ${
                    (stock.change24h || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {(stock.change24h || 0) >= 0 ? '+' : ''}{(stock.change24h || 0).toFixed(2)}%
                  </span>
                </>
              ) : (
                <div className="animate-pulse space-y-1">
                  <div className="h-3 w-12 bg-white/10 rounded" />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
