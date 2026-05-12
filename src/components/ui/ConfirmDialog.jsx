import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  details,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false, // red styling for delete operations
  children
}) {
  // Handle ESC key to dismiss dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
          >
            <div
              className="rounded-lg p-6 max-w-md w-full shadow-2xl"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-message"
            >
              {/* Title */}
              <h2 id="dialog-title" className="text-xl font-bold mb-3 gradient-text">
                {title}
              </h2>

              {/* Message */}
              <p id="dialog-message" className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                {message}
              </p>

              {/* Details (optional) */}
              {details && (
                <div
                  className="mb-4 p-3 rounded-lg text-sm"
                  style={{ background: 'var(--glass-hover-bg)', color: 'var(--text-secondary)' }}
                >
                  {details}
                </div>
              )}

              {/* Custom children (for additional content) */}
              {children && <div className="mb-4">{children}</div>}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: 'var(--glass-hover-bg)',
                    color: 'var(--text-primary)',
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: isDangerous ? 'var(--emotion-expenses)' : 'var(--emotion-savings)',
                    color: 'white',
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isDangerous ? 'Deleting...' : 'Saving...'}
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
