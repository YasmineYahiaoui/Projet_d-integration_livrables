'use client';

import { useState } from 'react';
import Link from 'next/link';
import MinimalPatientLogin from '@/components/patient/PatientLogin';

export default function PatientConnexionPage() {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left side - Login form */}
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
                            <button className="mr-4 font-medium text-[#5CB1B1]">
                                Connexion
                            </button>
                            <Link href="/patient/inscription">
                                <button className="text-gray-500 hover:text-[#5CB1B1]">
                                    Inscription
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Espace patient
                        </h1>
                        <p className="text-gray-600">
                            Connectez-vous pour accéder à votre espace patient
                        </p>
                    </div>

                    <MinimalPatientLogin />

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right side - Information */}
            <div className="hidden md:block bg-[#5CB1B1]/10">
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Bienvenue dans votre espace patient
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Gérez facilement vos rendez-vous médicaux et accédez à vos informations personnelles de santé en toute sécurité.
                        </p>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                Avantages de votre espace patient:
                            </h3>
                            <ul className="space-y-2 text-gray-600 list-disc list-inside">
                                <li>Prise de rendez-vous en ligne</li>
                                <li>Consultation de vos rendez-vous</li>
                                <li>Modification et annulation faciles</li>
                                <li>Rappels automatiques</li>
                                <li>Accès sécurisé à vos informations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}