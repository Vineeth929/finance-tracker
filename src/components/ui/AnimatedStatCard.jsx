import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Emotionally engaging stat card with satisfying interactions
 * Numbers animate in, surfaces respond to hover, glow pulses subtly
 */
export default function AnimatedStatCard({
  label = "Balance",
  value = 0,
  trend = null, // { direction: 'up'|'down', percentage: 10 }
  icon = "💰",
  onHover = null,
  isGrowing = false, // If true, emphasize growth with special colors
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatValue = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const trendColor = trend?.direction === 'up' ? '#34D399' : '#F87171';

  return (
    <motion.div
      onHoverStart={() => {
        setIsHovered(true);
        onHover?.(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHover?.(false);
      }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-xl p-6"
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, var(--bg-surface-3), var(--bg-surface-2))'
          : 'var(--bg-surface-3)',
        border: '1px solid var(--border-normal)',
        boxShadow: isHovered
          ? '0 12px 32px rgba(168, 85, 247, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Ambient glow background */}
      <motion.div
        className="absolute -inset-full"
        style={{
          background: isGrowing
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          opacity: isHovered ? 1 : 0.5,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Shimmer accent on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div className="relative z-10 space-y-3">
        {/* Header with icon */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
          <motion.span
            animate={isHovered ? { scale: 1.2, rotate: 12 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-2xl"
          >
            {icon}
          </motion.span>
        </div>

        {/* Animated value */}
        <div>
          <motion.h3
            key={value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-bold"
            style={{
              background: isGrowing
                ? 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)'
                : 'var(--text-primary)',
              WebkitBackgroundClip: isGrowing ? 'text' : 'unset',
              WebkitTextFillColor: isGrowing ? 'transparent' : 'unset',
            }}
          >
            {formatValue(value)}
          </motion.h3>
        </div>

        {/* Trend indicator */}
        {trend && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: trendColor }}
          >
            <span>{trend.direction === 'up' ? '📈' : '📉'}</span>
            <span>{trend.direction === 'up' ? '+' : '-'}{trend.percentage.toFixed(1)}%</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
