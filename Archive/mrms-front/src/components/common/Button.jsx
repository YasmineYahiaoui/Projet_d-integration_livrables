import React from 'react';
import Link from 'next/link';

const variantStyles = {
    primary: 'bg-[#5CB1B1] text-white hover:bg-[#4A9494]',
    secondary: 'border border-[#5CB1B1] text-[#5CB1B1] hover:bg-[#5CB1B1]/10',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    dangerOutline: 'border border-red-300 text-red-700 hover:bg-red-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
};

const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl'
};

export default function Button({
                                   children,
                                   className = '',
                                   disabled = false,
                                   href,
                                   size = 'md',
                                   variant = 'primary',
                                   onClick,
                                   type = 'button',
                                   fullWidth = false,
                                   icon,
                                   ...props
                               }) {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const classes = `${baseClasses} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${fullWidth ? 'w-full' : ''} ${className}`;

    // Si un href est fourni, retourner un lien
    if (href) {
        return (
            <Link
                href={href}
                className={classes}
                {...props}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {children}
            </Link>
        );
    }

    // Sinon, retourner un bouton
    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
}