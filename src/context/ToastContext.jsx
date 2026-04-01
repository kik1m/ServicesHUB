import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container" style={{
                position: 'fixed', bottom: '30px', right: '30px', 
                zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast-item ${toast.type}`} style={{
                        background: 'rgba(15, 15, 18, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${toast.type === 'success' ? 'rgba(0, 200, 83, 0.3)' : toast.type === 'error' ? 'rgba(255, 82, 82, 0.3)' : 'rgba(0, 136, 204, 0.3)'}`,
                        padding: '12px 20px',
                        borderRadius: '16px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        animation: 'slideInRight 0.3s ease'
                    }}>
                        {toast.type === 'success' && <CheckCircle size={20} color="#00C853" />}
                        {toast.type === 'error' && <AlertCircle size={20} color="#FF5252" />}
                        {toast.type === 'info' && <Info size={20} color="var(--primary)" />}
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} style={{
                            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
                            cursor: 'pointer', display: 'flex', padding: 0
                        }}>
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .toast-item.success { border-left: 4px solid #00C853; }
                .toast-item.error { border-left: 4px solid #FF5252; }
                .toast-item.info { border-left: 4px solid var(--primary); }
            `}</style>
        </ToastContext.Provider>
    );
};
