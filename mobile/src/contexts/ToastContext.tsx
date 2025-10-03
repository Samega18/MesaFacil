import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../components';

interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextData {
  showToast: (config: ToastConfig) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

interface ToastProviderProps {
  children: ReactNode;
}

// Context Provider para Toast
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastConfig, setToastConfig] = useState<ToastConfig & { visible: boolean }>({
    visible: false,
    message: '',
    type: 'success',
    duration: 3000,
  });

  const showToast = useCallback((config: ToastConfig) => {
    setToastConfig({
      visible: true,
      message: config.message,
      type: config.type || 'success',
      duration: config.duration || 3000,
    });
  }, []);

  const showSuccess = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const showError = useCallback((message: string, duration = 4000) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
      }}
    >
      {children}
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        type={toastConfig.type}
        duration={toastConfig.duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  
  return context;
};