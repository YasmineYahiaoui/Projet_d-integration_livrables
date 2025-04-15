import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
                                  closeOnOutsideClick = true,
                                  showCloseButton = true,
                                  footer,
                                  className = '',
                                  contentClassName = '',
                                  overlayClassName = '',
                                  ...props
                              }) {
    const modalRef = useRef(null);

    // Fermer le modal lorsque la touche Escape est pressée
    useEffect(() => {
        const handleEscape = (e) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Empêcher le scroll du body lorsque le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Gérer le clic en dehors du modal
    const handleOutsideClick = (e) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Tailles du modal
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full'
    };

    const modalSizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div
            className={`fixed inset-0 z-50 overflow-y-auto ${overlayClassName}`}
            onClick={handleOutsideClick}
            aria-labelledby={title ? 'modal-title' : undefined}
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

                <div
                    ref={modalRef}
                    className={`w-full ${modalSizeClass} bg-white rounded-lg shadow-xl transform transition-all ${className}`}
                    {...props}
                >
                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5CB1B1]"
                            aria-label="Fermer"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-600" />
                        </button>
                    )}

                    {title && (
                        <div className="px-6 pt-4 pb-3 border-b border-gray-200">
                            <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                        </div>
                    )}

                    <div className={`${contentClassName}`}>
                        {children}
                    </div>

                    {footer && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}