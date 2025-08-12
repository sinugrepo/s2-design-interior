import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const showAlert = (type, title, message, onConfirm = null) => {
    setModal({
      type,
      title,
      message,
      onConfirm,
      showCancel: onConfirm !== null
    });
  };

  const showSuccess = (title, message) => {
    showAlert('success', title, message);
  };

  const showError = (title, message) => {
    showAlert('error', title, message);
  };

  const showWarning = (title, message) => {
    showAlert('warning', title, message);
  };

  const showConfirm = (title, message, onConfirm) => {
    showAlert('confirm', title, message, onConfirm);
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleConfirm = () => {
    if (modal?.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-12 h-12 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-12 h-12 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-12 h-12 text-yellow-600" />;
      case 'confirm':
        return <ExclamationTriangleIcon className="w-12 h-12 text-orange-600" />;
      default:
        return <InformationCircleIcon className="w-12 h-12 text-blue-600" />;
    }
  };

  const getButtonColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'confirm':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const value = {
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    closeModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-6 text-center">
                <div className="mx-auto flex items-center justify-center mb-4">
                  {getIcon(modal.type)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {modal.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {modal.message}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                {modal.showCancel && (
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </button>
                )}
                <button
                  onClick={modal.showCancel ? handleConfirm : closeModal}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${getButtonColor(modal.type)}`}
                >
                  {modal.showCancel ? 'Ya, Lanjutkan' : 'OK'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}; 