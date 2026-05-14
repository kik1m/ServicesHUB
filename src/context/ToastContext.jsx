import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastContext.module.css';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`${styles.toastItem} ${styles[toast.type]}`}
                    >
                        {toast.type === 'success' && <CheckCircle size={20} color="#00C853" />}
                        {toast.type === 'error' && <AlertCircle size={20} color="#FF5252" />}
                        {toast.type === 'info' && <Info size={20} color="var(--primary)" />}
                        
                        <span className={styles.message}>{toast.message}</span>
                        
                        <button 
                            className={styles.closeButton}
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close notification"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
