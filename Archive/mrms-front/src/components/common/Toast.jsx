import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', visible = true, onClose }) {
    const [isVisible, setIsVisible] = useState(visible);

    // Handle visibility changes
    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    // Styles based on toast type
    const typeStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-800',
            icon: CheckCircleIcon,
            iconColor: 'text-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800',
            icon: ExclamationCircleIcon,
            iconColor: 'text-red-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-800',
            icon: ExclamationCircleIcon,
            iconColor: 'text-yellow-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: InformationCircleIcon,
            iconColor: 'text-blue-500'
        }
    };

    const style = typeStyles[type] || typeStyles.info;
    const Icon = style.icon;

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } max-w-sm w-full ${style.bg} border-l-4 ${style.border} p-4 rounded shadow-md`}
            role="alert"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${style.iconColor}`} />
                </div>
                <div className={`ml-3 flex-1 ${style.text}`}>
                    <p className="text-sm">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className={`ml-auto -mx-1.5 -my-1.5 ${style.bg} ${style.text} rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex h-8 w-8 hover:bg-gray-200`}
                >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}