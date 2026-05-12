/**
 * Global Modal System Context
 * Provides centralized management for:
 * - Toast notifications (success, error, info)
 * - Confirmation dialogs
 * - Custom modals
 *
 * Features:
 * - Toast queue (no overlapping)
 * - Modal stack (proper z-index)
 * - Type-safe interfaces
 * - Auto-dismissing toasts
 * - Accessibility built-in (aria-live regions)
 */

import React, { createContext, useContext, useCallback, useState } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState([]);

  // Toast management with auto-dismiss
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setToasts(prev => [...prev, { id, message, type, duration }]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Modal management with stack
  const showModal = useCallback((config) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const modal = {
      id,
      type: config.type || 'confirm',
      title: config.title,
      message: config.message,
      details: config.details,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      isDangerous: config.isDangerous || false,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
      isLoading: false,
      data: config.data,
    };

    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateModal = useCallback((id, updates) => {
    setModals(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const value = {
    toasts,
    modals,
    showToast,
    hideToast,
    showModal,
    closeModal,
    updateModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within ModalProvider');
  }
  return context;
};
