import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Ambient background that evolves based on financial state
 * Creates emotional connection to financial progress
 *
 * States:
 * - healthy: green/emerald glow
 * - growing: purple glow
 * - warning: amber glow
 * - stable: blue glow
 */
export default function AmbientBackground({ state = 'stable', intensity = 0.5 }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles for ambient effect
    const newParticles = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.3,
    }));
    setParticles(newParticles);
  }, []);

  const getGradientByState = () => {
    switch (state) {
      case 'healthy':
        return 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08), transparent 50%)';
      case 'growing':
        return 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1), transparent 50%)';
      case 'warning':
        return 'radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.06), transparent 50%)';
      case 'stable':
      default:
        return 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05), transparent 70%)';
    }
  };

  return (
    <>
      {/* Primary ambient glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: getGradientByState(),
          opacity: intensity,
        }}
        animate={
          prefersReducedMotion
            ? { opacity: intensity }
            : { opacity: [intensity * 0.8, intensity, intensity * 0.8] }
        }
        transition={{
          duration: prefersReducedMotion ? 0 : 4,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles for subtle movement */}
      {!prefersReducedMotion &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: '300px',
              height: '300px',
              background: getGradientByState(),
              filter: 'blur(80px)',
              opacity: 0.03,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 6 + particle.id * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}

      {/* Pulse effect for state changes */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        style={{
          background: getGradientByState(),
        }}
      />
    </>
  );
}
