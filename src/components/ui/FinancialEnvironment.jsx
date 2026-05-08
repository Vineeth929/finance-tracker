import React from 'react';
import { motion } from 'framer-motion';
import { useFinancialHeartbeat } from '../../hooks/useFinancialHeartbeat';

/**
 * Financial Environment Wrapper
 *
 * Wraps sections of the app and changes the atmosphere based on financial state
 * Creates the feeling that the interface is emotionally aware of their finances
 */
export default function FinancialEnvironment({
  children,
  showAmbient = true,
  responsive = true,
}) {
  const heartbeat = useFinancialHeartbeat();

  // Get emotion color and glow based on state
  const getEnvironmentStyle = () => {
    const styles = {
      thriving: {
        glow: 'rgba(168, 85, 247, 0.1)',
        accent: 'rgba(168, 85, 247, 0.05)',
        gradient:
          'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.02) 100%)',
      },
      growing: {
        glow: 'rgba(16, 185, 129, 0.1)',
        accent: 'rgba(16, 185, 129, 0.05)',
        gradient:
          'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)',
      },
      stable: {
        glow: 'rgba(59, 130, 246, 0.1)',
        accent: 'rgba(59, 130, 246, 0.05)',
        gradient:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
      },
      cautious: {
        glow: 'rgba(245, 158, 11, 0.1)',
        accent: 'rgba(245, 158, 11, 0.05)',
        gradient:
          'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
      },
      struggling: {
        glow: 'rgba(239, 68, 68, 0.08)',
        accent: 'rgba(239, 68, 68, 0.03)',
        gradient:
          'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(239, 68, 68, 0.01) 100%)',
      },
    };
    return styles[heartbeat.state] || styles.stable;
  };

  const style = getEnvironmentStyle();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated environment background */}
      {showAmbient && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: style.gradient,
            opacity: heartbeat.intensity * 0.5,
          }}
          animate={{
            opacity: [heartbeat.intensity * 0.4, heartbeat.intensity * 0.6, heartbeat.intensity * 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
