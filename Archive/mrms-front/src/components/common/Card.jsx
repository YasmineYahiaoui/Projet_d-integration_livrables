import React from 'react';

export default function Card({
                                 children,
                                 title,
                                 subtitle,
                                 footer,
                                 headerActions,
                                 className = '',
                                 bodyClassName = '',
                                 headerClassName = '',
                                 footerClassName = '',
                                 noPadding = false,
                                 ...props
                             }) {
    return (
        <div
            className={`bg-white rounded-lg shadow overflow-hidden ${className}`}
            {...props}
        >
            {(title || headerActions) && (
                <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
                    <div>
                        {title && (
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {headerActions && (
                        <div className="flex space-x-3">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}

            <div className={`${noPadding ? '' : 'p-6'} ${bodyClassName}`}>
                {children}
            </div>

            {footer && (
                <div className={`px-6 py-4 border-t border-gray-200 ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
}

// Sous-composants optionnels
Card.Header = function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.Body = function CardBody({ children, className = '', noPadding = false, ...props }) {
    return (
        <div className={`${noPadding ? '' : 'p-6'} ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
            {children}
        </div>
    );
};