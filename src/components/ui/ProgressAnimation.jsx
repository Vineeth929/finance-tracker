import React from 'react';
import { motion } from 'framer-motion';

/**
 * Emotionally rewarding progress indicator
 * Creates satisfying visual feedback for financial growth
 */
export default function ProgressAnimation({
  value = 0,
  max = 100,
  label = "Progress",
  showGlow = true,
  variant = "default" // default, success, growth
}) {
  const percentage = Math.min((value / max) * 100, 100);

  const getVariantColor = () => {
    if (variant === 'success') return '#34D399';
    if (variant === 'growth') return '#A855F7';
    return '#3B82F6';
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
          <motion.span
            key={percentage}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold"
            style={{ color: getVariantColor() }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}

      {/* Background track */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-level-3)' }}
      >
        {/* Animated progress fill */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${percentage}%`, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.34, 1.56, 0.64, 1] // cubic-bezier bounce
          }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${getVariantColor()}, ${getVariantColor()}dd)`,
            boxShadow: showGlow ? `0 0 12px ${getVariantColor()}44` : 'none',
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
