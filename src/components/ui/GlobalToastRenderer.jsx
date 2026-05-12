/**
 * Global Toast Renderer
 * Renders all toasts from the global ModalContext
 * Single source for toast rendering prevents overlapping/z-index issues
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModals } from '../../context/ModalContext';

const toastIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const toastColors = {
  success: {
    bg: 'var(--emotion-savings)',
    text: 'white',
  },
  error: {
    bg: 'var(--emotion-expenses)',
    text: 'white',
  },
  info: {
    bg: 'var(--emotion-growth)',
    text: 'white',
  },
};

export default function GlobalToastRenderer() {
  const { toasts, hideToast } = useModals();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <div
              className="p-4 rounded-lg flex items-center gap-3 shadow-lg max-w-sm cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                background: toastColors[toast.type].bg,
                color: toastColors[toast.type].text,
              }}
              onClick={() => hideToast(toast.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  hideToast(toast.id);
                }
              }}
            >
              <span className="text-lg font-bold flex-shrink-0">
                {toastIcons[toast.type]}
              </span>
              <span className="text-sm">{toast.message}</span>
              <button
                className="ml-auto flex-shrink-0 text-lg opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  hideToast(toast.id);
                }}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
