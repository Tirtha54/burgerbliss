import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

// ✅ This is the hook CartPage imports
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'error'
                ? 'rgba(160,40,30,0.92)'
                : toast.type === 'info'
                  ? 'rgba(30,80,140,0.92)'
                  : 'rgba(30,60,25,0.92)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${
                toast.type === 'error' ? 'rgba(200,60,50,0.4)'
                : toast.type === 'info'  ? 'rgba(60,120,200,0.4)'
                : 'rgba(80,120,50,0.4)'
              }`,
              borderRadius: 14,
              padding: '13px 20px',
              color: '#f0e8d8',
              fontSize: '0.88rem',
              fontFamily: 'Poppins, sans-serif',
              maxWidth: 360,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              animation: 'toastSlide 0.3s ease',
              pointerEvents: 'auto',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;