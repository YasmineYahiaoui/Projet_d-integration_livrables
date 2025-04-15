'use client';

import { createContext, useState, useContext } from 'react';

// Create UI context
export const UIContext = createContext(null);

// Toast type definitions
const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

export function UIProvider({ children }) {
    // State for toasts
    const [toasts, setToasts] = useState([]);

    // Function to add a toast
    const addToast = ({ type = TOAST_TYPES.INFO, message, duration = 5000 }) => {
        const id = Date.now();

        // Add new toast to the array
        setToasts(prevToasts => [...prevToasts, { id, type, message }]);

        // Remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    };

    // Function to remove a toast
    const removeToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    // Shorthand functions for different toast types
    const success = (message, duration) => addToast({ type: TOAST_TYPES.SUCCESS, message, duration });
    const error = (message, duration) => addToast({ type: TOAST_TYPES.ERROR, message, duration });
    const info = (message, duration) => addToast({ type: TOAST_TYPES.INFO, message, duration });
    const warning = (message, duration) => addToast({ type: TOAST_TYPES.WARNING, message, duration });

    return (
        <UIContext.Provider
            value={{
                toasts,
                addToast,
                removeToast,
                success,
                error,
                info,
                warning,
                TOAST_TYPES
            }}
        >
            {/* Render children */}
            {children}

            {/* Render toasts */}
            {toasts.length > 0 && (
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={`px-4 py-3 rounded shadow-md ${
                                toast.type === TOAST_TYPES.SUCCESS ? 'bg-green-100 text-green-800' :
                                    toast.type === TOAST_TYPES.ERROR ? 'bg-red-100 text-red-800' :
                                        toast.type === TOAST_TYPES.WARNING ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                            }`}
                        >
                            <div className="flex justify-between">
                                <p>{toast.message}</p>
                                <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-500 hover:text-gray-700">
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </UIContext.Provider>
    );
}

// Hook for easier access
export function useUI() {
    const context = useContext(UIContext);

    if (!context) {
        throw new Error('useUI doit être utilisé à l\'intérieur d\'un UIProvider');
    }

    return context;
}