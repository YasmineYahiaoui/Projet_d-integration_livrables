'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AdminLoginPage() {
    const { chargement, estAuthentifie } = useAuth();
    const router = useRouter();
    const [showRegister, setShowRegister] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!chargement && estAuthentifie) {
            router.push('/tableau-bord');
        }
    }, [chargement, estAuthentifie, router]);

    // Don't show anything during initial auth check
    if (chargement) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    // If authenticated, don't show login page (redirect will happen in useEffect)
    if (estAuthentifie) {
        return null;
    }

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left side - Login/Register form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/" className="text-[#5CB1B1] hover:text-[#4A9494] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour
                        </Link>
                        <div>
                            <button
                                onClick={() => setShowRegister(false)}
                                className={`mr-4 ${!showRegister ? 'font-medium text-[#5CB1B1]' : 'text-gray-500'}`}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => setShowRegister(true)}
                                className={showRegister ? 'font-medium text-[#5CB1B1]' : 'text-gray-500'}
                            >
                                Inscription
                            </button>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {showRegister ? 'Créer un compte administrateur' : 'Connexion administrateur'}
                        </h1>
                        <p className="text-gray-600">
                            {showRegister ? 'Créez un nouveau compte pour accéder au système' : 'Connectez-vous pour accéder au tableau de bord'}
                        </p>
                    </div>

                    {showRegister ? (
                        <RegisterForm onSuccess={() => setShowRegister(false)} />
                    ) : (
                        <LoginForm />
                    )}
                </div>
            </div>

            {/* Right side - Image or information */}
            <div className="hidden md:block bg-[#5CB1B1]/10">
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Espace Administrateur
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Cet espace est réservé au personnel médical autorisé. Connectez-vous pour accéder aux fonctionnalités de gestion des patients et des rendez-vous.
                        </p>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                Fonctionnalités d'administration:
                            </h3>
                            <ul className="space-y-2 text-gray-600 list-disc list-inside">
                                <li>Gestion des patients</li>
                                <li>Planification des rendez-vous</li>
                                <li>Accès aux dossiers médicaux</li>
                                <li>Gestion du personnel</li>
                                <li>Tableau de bord et statistiques</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}