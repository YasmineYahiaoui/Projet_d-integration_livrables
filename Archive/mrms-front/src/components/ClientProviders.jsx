'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { UIProvider } from '@/contexts/UIContext';

// Simple wrapper for client components
export default function ClientProviders({ children }) {
    return (
        <AuthProvider>
            <UIProvider>
                {children}
            </UIProvider>
        </AuthProvider>
    );
}