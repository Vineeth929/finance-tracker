import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({
  message,
  type = 'success',
  isOpen = true,
  onClose
}) {
  React.useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  const colors = {
    success: { bg: 'var(--emotion-savings)', text: 'white' },
    error: { bg: 'var(--emotion-expenses)', text: 'white' },
    info: { bg: 'var(--emotion-growth)', text: 'white' }
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-50 max-w-sm"
          style={{ background: colors[type].bg, color: colors[type].text }}
          onClick={onClose}
        >
          <div className="p-4 rounded-lg flex items-center gap-3 cursor-pointer shadow-lg">
            <span className="text-lg font-bold">{icons[type]}</span>
            <span className="text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
