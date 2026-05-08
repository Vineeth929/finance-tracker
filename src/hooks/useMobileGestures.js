import { useState, useRef, useEffect } from 'react';

/**
 * Mobile Gestures Hook
 * Enables swipe, pull-to-refresh, and long-press interactions
 */
export const useMobileGestures = () => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only register if moved more than 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      setTimeout(() => setSwipeDirection(null), 300);
    }
  };

  return {
    swipeDirection,
    handleTouchStart,
    handleTouchEnd,
  };
};

/**
 * Pull-to-Refresh Hook
 */
export const usePullToRefresh = (onRefresh) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (container.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;

      const touchCurrentY = e.touches[0].clientY;
      const distance = Math.max(0, touchCurrentY - touchStartY.current);
      setPullDistance(Math.min(distance, 100));
    };

    const handleTouchEnd = () => {
      if (pullDistance > 80) {
        onRefresh?.();
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, onRefresh]);

  return {
    isPulling,
    pullDistance,
    scrollContainer,
  };
};
