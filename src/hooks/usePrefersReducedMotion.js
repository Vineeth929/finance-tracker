import { useState, useEffect } from 'react';

/**
 * Hook to detect and respect prefers-reduced-motion setting
 * Reduces animation intensity for users with motion sensitivity
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Helper to get animation config based on motion preference
 */
export const getAnimationConfig = (prefersReducedMotion) => {
  if (prefersReducedMotion) {
    return {
      // Much shorter or instant animations
      staggerChildren: 0.02,
      delayChildren: 0.05,
      duration: 0.2,
      springConfig: { type: 'spring', stiffness: 500, damping: 40 },
      easing: 'easeOut',
      // Disable continuous/looping animations
      infiniteAnimations: false,
    };
  }

  return {
    staggerChildren: 0.1,
    delayChildren: 0.2,
    duration: 0.5,
    springConfig: { type: 'spring', stiffness: 300, damping: 20 },
    easing: 'easeOut',
    infiniteAnimations: true,
  };
};
