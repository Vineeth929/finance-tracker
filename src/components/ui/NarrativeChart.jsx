import React from 'react';
import { motion } from 'framer-motion';

/**
 * Narrative Chart Component
 *
 * Transforms financial data into emotionally readable stories
 * Each chart tells a story about financial journey, not just displaying numbers
 */
export default function NarrativeChart({
  type = 'savings', // 'savings', 'spending', 'income', 'progress'
  data = [],
  title = 'Financial Story',
  subtitle = '',
  color = 'indigo',
  icon = '📊',
  trend = null, // { direction: 'up'|'down', percentage: 10 }
  showAnimation = true,
}) {
  // Get color variants based on type
  const getColorScheme = () => {
    const schemes = {
      savings: {
        primary: '#34D399',
        accent: '#10B981',
        bg: 'rgba(16, 185, 129, 0.1)',
        gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      },
      spending: {
        primary: '#F87171',
        accent: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      },
      income: {
        primary: '#60A5FA',
        accent: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.1)',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      },
      progress: {
        primary: '#A855F7',
        accent: '#9333EA',
        bg: 'rgba(168, 85, 247, 0.1)',
        gradient: 'linear-gradient(135deg, #9333EA 0%, #A855F7 100%)',
      },
    };
    return schemes[type] || schemes.savings;
  };

  const scheme = getColorScheme();
  const maxValue = Math.max(...data.map(d => d.value || 0), 1);

  const getStoryMessage = () => {
    if (type === 'savings') {
      return 'Your savings journey';
    } else if (type === 'spending') {
      return 'How you spend';
    } else if (type === 'income') {
      return 'Your income flow';
    } else if (type === 'progress') {
      return 'Progress towards goals';
    }
    return 'Your financial story';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: scheme.primary }}>
            <span>{trend.direction === 'up' ? '📈' : '📉'}</span>
            <span>{trend.direction === 'up' ? '+' : '-'}{trend.percentage.toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Chart Area */}
      {data.length > 0 ? (
        <div className="space-y-4">
          {/* Bars */}
          <div className="flex items-end justify-around gap-2 h-40">
            {data.map((item, idx) => {
              const heightPercent = (item.value / maxValue) * 100;
              const delay = showAnimation ? idx * 0.1 : 0;

              return (
                <motion.div
                  key={item.label}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                  initial={showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.5, ease: 'easeOut' }}
                >
                  {/* Bar */}
                  <motion.div
                    className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-100 opacity-80 relative overflow-hidden"
                    style={{
                      height: `${heightPercent}%`,
                      background: scheme.gradient,
                      boxShadow: `0 0 12px ${scheme.primary}44`,
                    }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${scheme.primary}66` }}
                    initial={showAnimation ? { height: 0 } : { height: `${heightPercent}%` }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {/* Shimmer on bar */}
                    {showAnimation && (
                      <motion.div
                        className="absolute inset-0 opacity-40"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ delay: delay + 0.3, duration: 0.6 }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="text-center w-full">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.label}
                    </p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: scheme.primary }}>
                      {typeof item.value === 'number' ? `₹${Math.round(item.value).toLocaleString()}` : item.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Story message */}
          {data.length > 0 && (
            <motion.p
              className="text-xs text-center italic mt-4"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.5 }}
            >
              {getStoryMessage()}
            </motion.p>
          )}
        </div>
      ) : (
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: 'var(--glass-bg)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>No data yet. Start tracking to see your story unfold.</p>
        </div>
      )}
    </div>
  );
}
