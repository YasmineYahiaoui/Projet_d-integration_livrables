'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);

        // Navigate to the appropriate page
        if (role === 'admin') {
            router.push('/admin/connexion');
        } else if (role === 'medecin') {
            router.push('/doctor/connexion');
        } else if (role === 'patient') {
            router.push('/patient/connexion');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">MRMS</h1>
                    <p className="text-gray-600 mb-8">
                        Système de Gestion de Dossiers Médicaux
                    </p>

                    <h2 className="text-xl font-semibold text-gray-700 mb-6">
                        Choisissez votre profil de connexion
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => handleRoleSelect('admin')}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#5CB1B1]"
                    >
                        <div className="h-16 w-16 rounded-full bg-[#5CB1B1]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5CB1B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-900">Administrateur</span>
                        <span className="text-sm text-gray-500 mt-1">Accès personnel médical</span>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('medecin')}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#5CB1B1]"
                    >
                        <div className="h-16 w-16 rounded-full bg-[#5CB1B1]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5CB1B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-900">Médecin</span>
                        <span className="text-sm text-gray-500 mt-1">Accès médecin</span>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('patient')}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#5CB1B1]"
                    >
                        <div className="h-16 w-16 rounded-full bg-[#5CB1B1]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5CB1B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-900">Patient</span>
                        <span className="text-sm text-gray-500 mt-1">Accès espace patient</span>
                    </button>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} MRMS. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    );
}