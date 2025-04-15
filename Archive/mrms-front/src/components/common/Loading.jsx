import React from 'react';

export default function Loading({
                                    size = 'md',
                                    color = 'primary',
                                    className = '',
                                    fullScreen = false,
                                    text,
                                    ...props
                                }) {
    // Définir les tailles du spinner
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    // Définir les couleurs
    const colorClasses = {
        primary: 'border-[#5CB1B1]',
        secondary: 'border-gray-600',
        white: 'border-white',
        gray: 'border-gray-300',
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        yellow: 'border-yellow-500',
        purple: 'border-purple-500'
    };

    const spinnerSizeClass = sizeClasses[size] || sizeClasses.md;
    const spinnerColorClass = colorClasses[color] || colorClasses.primary;

    // Si plein écran, afficher un spinner centré dans la page
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="text-center">
                    <div
                        className={`animate-spin rounded-full ${spinnerSizeClass} border-t-2 border-b-2 ${spinnerColorClass} mx-auto`}
                        {...props}
                    />
                    {text && (
                        <p className="mt-4 text-gray-600 font-medium">{text}</p>
                    )}
                </div>
            </div>
        );
    }

    // Sinon, afficher simplement le spinner
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full ${spinnerSizeClass} border-t-2 border-b-2 ${spinnerColorClass}`}
                    {...props}
                />
                {text && (
                    <p className="mt-2 text-gray-600 text-sm">{text}</p>
                )}
            </div>
        </div>
    );
}