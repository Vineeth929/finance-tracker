import React from 'react';
import { motion } from 'framer-motion';

/**
 * Milestone Card
 *
 * Celebrates achievements in calm, elegant ways
 * Creates emotional reward without manipulation
 * When users reach savings goals, this creates the celebration moment
 */
export default function MilestoneCard({
  title = 'Milestone Reached!',
  description = '',
  achievement = 'You reached a goal',
  icon = '🎯',
  progress = 100,
  details = [],
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full relative overflow-hidden rounded-lg"
      style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.3)',
      }}
    >
      {/* Celebration particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            opacity: 1,
            y: 0,
            x: Math.random() * 100 - 50,
          }}
          animate={{
            opacity: 0,
            y: -100,
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: ['#A855F7', '#34D399', '#3B82F6', '#F59E0B'][i],
            left: `${25 + i * 20}%`,
            bottom: '0%',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="text-4xl sm:text-5xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            {icon}
          </motion.div>

          <div>
            <motion.h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>

            {description && (
              <motion.p
                className="text-xs sm:text-sm mt-1"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>

        {/* Achievement message */}
        <motion.div
          className="rounded-lg p-3 sm:p-4"
          style={{ background: 'var(--glass-bg)' }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="text-sm sm:text-base font-semibold"
            style={{ color: '#34D399' }}
          >
            ✨ {achievement}
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Progress</span>
            <motion.span
              className="text-xs font-bold"
              style={{ color: '#A855F7' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>

          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--glass-bg)' }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                background: 'linear-gradient(90deg, #A855F7 0%, #34D399 100%)',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
              }}
            />
          </div>
        </div>

        {/* Details */}
        {details.length > 0 && (
          <motion.div
            className="space-y-2 pt-2 border-t"
            style={{ borderColor: 'var(--border-normal)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {details.map((detail, idx) => (
              <motion.div
                key={idx}
                className="flex justify-between items-center text-xs sm:text-sm"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{detail.label}</span>
                <span
                  className="font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {detail.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
