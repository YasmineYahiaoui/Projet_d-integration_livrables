'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DoctorNavigation from '@/components/layout/DoctorNavigation';
import Loading from '@/components/common/Loading';

export default function DoctorLayout({ children }) {
    const { estAuthentifie, chargement, utilisateur } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        console.log("Doctor layout rendering", { estAuthentifie, chargement, utilisateur });

        // Simple check - only when not on login page
        if (window.location.pathname.includes('connexion')) {
            console.log("On login page, skipping auth check");
            setIsChecking(false);
            return;
        }

        // Check auth for dashboard pages
        console.log("Checking auth for protected page");
        if (!estAuthentifie) {
            console.log("Not authenticated, redirecting to login");
            router.push('/doctor/connexion');
        } else if (utilisateur && utilisateur.role === 'Médecin') {
            console.log("Authorized as doctor");
            setIsAuthorized(true);
        } else {
            console.log("Wrong role, access denied");
            router.push('/access-denied');
        }

        setIsChecking(false);
    }, [estAuthentifie, utilisateur, router]);

    // Show loading during check
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Chargement..." />
            </div>
        );
    }

    // On login page or authorized dashboard
    if (window.location.pathname.includes('connexion') || isAuthorized) {
        return (
            <div className="flex h-screen bg-gray-50">
                {isAuthorized && <DoctorNavigation />}
                <div className={`flex-1 flex flex-col ${isAuthorized ? 'lg:pl-64' : ''}`}>
                    <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
            </div>
        );
    }

    // Empty div during redirects
    return <div></div>;
}