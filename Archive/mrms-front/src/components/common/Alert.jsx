import React from 'react';
import {
    ExclamationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const VARIANTS = {
    info: {
        icon: InformationCircleIcon,
        className: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    success: {
        icon: CheckCircleIcon,
        className: 'bg-green-50 text-green-800 border-green-200'
    },
    warning: {
        icon: ExclamationTriangleIcon,
        className: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    },
    error: {
        icon: ExclamationCircleIcon,
        className: 'bg-red-50 text-red-800 border-red-200'
    }
};

export default function Alert({
                                  variant = 'info',
                                  title,
                                  message,
                                  onClose,
                                  icon,
                                  showIcon = true,
                                  className = '',
                                  closable = false,
                                  action,
                                  bordered = true,
                                  children,
                                  ...props
                              }) {
    const variantConfig = VARIANTS[variant] || VARIANTS.info;
    const Icon = icon || variantConfig.icon;

    const alertClasses = `p-4 rounded-md ${bordered ? 'border' : ''} ${variantConfig.className} ${className}`;

    return (
        <div className={alertClasses} role="alert" {...props}>
            <div className="flex">
                {showIcon && (
                    <div className="flex-shrink-0">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                )}

                <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
                    {title && (
                        <h3 className="text-sm font-medium">
                            {title}
                        </h3>
                    )}

                    {message && (
                        <div className={`${title ? 'mt-2' : ''} text-sm`}>
                            <p>{message}</p>
                        </div>
                    )}

                    {children}

                    {action && (
                        <div className="mt-4">
                            {action}
                        </div>
                    )}
                </div>

                {closable && onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex rounded-md p-1.5 ${
                                    variant === 'error'
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                        : variant === 'warning'
                                            ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100'
                                            : variant === 'success'
                                                ? 'bg-green-50 text-green-500 hover:bg-green-100'
                                                : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    variant === 'error'
                                        ? 'focus:ring-red-500'
                                        : variant === 'warning'
                                            ? 'focus:ring-yellow-500'
                                            : variant === 'success'
                                                ? 'focus:ring-green-500'
                                                : 'focus:ring-blue-500'
                                }`}
                            >
                                <span className="sr-only">Fermer</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}