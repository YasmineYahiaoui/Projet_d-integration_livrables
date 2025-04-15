'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PatientNavigation from '@/components/layout/PatientNavigation';
import Loading from '@/components/common/Loading';

export default function PatientLayout({ children }) {
    const { estAuthentifie, chargement, utilisateur } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        console.log("Patient layout rendering", { estAuthentifie, chargement, utilisateur });

        // Skip auth check for login page
        if (typeof window !== 'undefined' && window.location.pathname.includes('connexion')) {
            console.log("On patient login page, skipping auth check");
            setIsChecking(false);
            return;
        }

        // Check auth for dashboard pages
        if (!chargement) {
            setIsChecking(false);

            if (!estAuthentifie) {
                console.log("Not authenticated, redirecting to patient login");
                router.push('/patient/connexion');
            } else if (utilisateur && utilisateur.role === 'Patient') {
                console.log("Authorized as patient");
                setIsAuthorized(true);
            } else {
                console.log("Wrong role, access denied");
                router.push('/access-denied');
            }
        }
    }, [chargement, estAuthentifie, utilisateur, router]);

    // Only show loading during initial auth check
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Vérification de l'authentification..." />
            </div>
        );
    }

    // On login page or authorized dashboard
    if (typeof window !== 'undefined' &&
        (window.location.pathname.includes('connexion') || isAuthorized)) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                {isAuthorized && <PatientNavigation />}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        );
    }

    // Empty div during redirects
    return <div></div>;
}