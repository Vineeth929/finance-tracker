import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Curiosity Widget
 *
 * Reveals insights gradually, creating discovery moments
 * Users feel compelled to explore and understand their finances
 * NOT a notification - contextual, elegant, earned discovery
 */
export default function CuriosityWidget({
  title = 'Insight',
  message = '',
  detail = '',
  icon = '💡',
  type = 'insight', // 'insight', 'discovery', 'achievement', 'suggestion'
  action = null, // { label: 'View', onClick: fn }
  initialExpanded = false,
  persistDismissal = true, // Persist dismissal to localStorage
}) {
  const dismissalKey = `curiosity-dismissed-${title}`;

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (!persistDismissal) return false;
    try {
      return localStorage.getItem(dismissalKey) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    if (persistDismissal) {
      try {
        localStorage.setItem(dismissalKey, 'true');
      } catch (err) {
        console.error('Failed to persist dismissal:', err);
      }
    }
  };

  if (isDismissed) return null;

  const getTypeStyles = () => {
    const styles = {
      insight: {
        bg: 'rgba(59, 130, 246, 0.08)',
        border: 'rgba(59, 130, 246, 0.2)',
        accent: '#3B82F6',
        icon: '💡',
      },
      discovery: {
        bg: 'rgba(168, 85, 247, 0.08)',
        border: 'rgba(168, 85, 247, 0.2)',
        accent: '#A855F7',
        icon: '✨',
      },
      achievement: {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.2)',
        accent: '#34D399',
        icon: '🎉',
      },
      suggestion: {
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'rgba(245, 158, 11, 0.2)',
        accent: '#F59E0B',
        icon: '💪',
      },
    };
    return styles[type] || styles.insight;
  };

  const typeStyle = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <motion.div
        className="rounded-lg p-4 sm:p-5 cursor-pointer transition-all duration-200 group"
        style={{
          background: typeStyle.bg,
          border: `1.5px solid ${typeStyle.border}`,
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{
          background: typeStyle.bg,
          borderColor: typeStyle.accent,
          transition: { duration: 0.2 },
        }}
      >
        {/* Animated accent bar */}
        <motion.div
          className="absolute top-0 left-0 h-1"
          initial={{ width: 0 }}
          animate={{ width: isExpanded ? '100%' : '32px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ background: typeStyle.accent }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <motion.span
              className="text-xl flex-shrink-0"
              animate={isExpanded ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {icon}
            </motion.span>

            <div className="flex-1 min-w-0">
              <motion.h4
                className="font-bold text-sm sm:text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </motion.h4>

              {!isExpanded && message && (
                <motion.p
                  className="text-xs sm:text-sm mt-1 line-clamp-2"
                  style={{ color: 'var(--text-secondary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {message}
                </motion.p>
              )}
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
              style={{ color: typeStyle.accent }}
            >
              ▼
            </motion.div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && detail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="pt-3 border-t rounded-lg"
                  style={{ borderColor: typeStyle.border, paddingLeft: '2.5rem' }}
                >
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {detail}
                  </p>

                  {action && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                      }}
                      className="mt-3 px-3 py-1.5 rounded text-xs font-semibold transition-all"
                      style={{
                        background: typeStyle.accent,
                        color: 'white',
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: `0 0 12px ${typeStyle.accent}66`,
                      }}
                    >
                      {action.label}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dismiss button */}
        <motion.button
          className="absolute top-3 right-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
          style={{ color: 'var(--text-secondary)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          whileHover={{ scale: 1.1 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
