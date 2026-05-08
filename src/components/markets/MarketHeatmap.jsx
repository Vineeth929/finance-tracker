import React from 'react';
import { motion } from 'framer-motion';

export default function MarketHeatmap() {
  const sectors = [
    { name: 'IT', change: 2.5, cap: 25 },
    { name: 'Banking', change: 1.8, cap: 28 },
    { name: 'Auto', change: -0.5, cap: 18 },
    { name: 'Pharma', change: 3.2, cap: 15 },
    { name: 'Energy', change: -1.2, cap: 20 },
    { name: 'Metal', change: 2.1, cap: 16 },
    { name: 'Realty', change: 0.8, cap: 12 },
    { name: 'FMCG', change: 1.5, cap: 14 },
  ];

  const getHeatmapColor = (change) => {
    if (change > 2) return 'from-emerald-500 to-emerald-600';
    if (change > 0) return 'from-emerald-500/70 to-emerald-600/70';
    if (change > -1) return 'from-rose-500/70 to-rose-600/70';
    return 'from-rose-500 to-rose-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass p-6 rounded-2xl col-span-full"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold gradient-text">Market Heatmap</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sector performance overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectors.map((sector) => (
          <motion.div
            key={sector.name}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${getHeatmapColor(sector.change)} p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg`}
            style={{ minHeight: `${50 + sector.cap}px` }}
          >
            <div className="flex flex-col justify-between h-full">
              <p className="font-bold text-white text-sm">{sector.name}</p>
              <div className="mt-2">
                <p className="text-xl font-bold text-white">{sector.change > 0 ? '+' : ''}{sector.change}%</p>
                <p className="text-xs text-white/80">Market Cap: ${sector.cap}B</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span style={{ color: 'var(--text-secondary)' }}>Gaining</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-rose-500" />
          <span style={{ color: 'var(--text-secondary)' }}>Losing</span>
        </div>
      </div>
    </motion.div>
  );
}
