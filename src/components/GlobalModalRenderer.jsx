/**
 * Global Modal Renderer
 * Renders all modals from the global ModalContext
 * Manages modal stack and z-index automatically
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModals } from '../context/ModalContext';
import ConfirmDialog from './ui/ConfirmDialog';

export default function GlobalModalRenderer() {
  const { modals, closeModal, updateModal } = useModals();
  const bodyRef = useRef(document.body);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (modals.length > 0) {
      const body = bodyRef.current;
      const originalOverflow = body.style.overflow;
      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = originalOverflow;
      };
    }
  }, [modals.length]);

  const handleConfirm = async (modalId, modal) => {
    if (modal.onConfirm) {
      updateModal(modalId, { isLoading: true });
      try {
        await modal.onConfirm();
      } catch (err) {
        console.error('Modal confirm error:', err);
      } finally {
        updateModal(modalId, { isLoading: false });
        closeModal(modalId);
      }
    } else {
      closeModal(modalId);
    }
  };

  const handleCancel = (modalId, modal) => {
    if (modal.onCancel) {
      modal.onCancel();
    }
    closeModal(modalId);
  };

  return (
    <AnimatePresence>
      {modals.map((modal, index) => (
        <div key={modal.id}>
          {/* Backdrop with increasing opacity for stacked modals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            style={{
              zIndex: 40 + index * 2,
            }}
            onClick={() => handleCancel(modal.id, modal)}
          />

          {/* Modal dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              zIndex: 41 + index * 2,
            }}
          >
            <ConfirmDialog
              isOpen={true}
              title={modal.title}
              message={modal.message}
              details={modal.details}
              confirmText={modal.confirmText}
              cancelText={modal.cancelText}
              isDangerous={modal.isDangerous}
              isLoading={modal.isLoading}
              onConfirm={() => handleConfirm(modal.id, modal)}
              onCancel={() => handleCancel(modal.id, modal)}
            />
          </motion.div>
        </div>
      ))}
    </AnimatePresence>
  );
}
