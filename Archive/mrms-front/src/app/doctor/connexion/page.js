'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';

export default function DoctorLoginPage() {
    const [identifiant, setIdentifiant] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const [loading, setLoading] = useState(false);
    const { connexion } = useAuth();
    const { error: showErrorToast } = useUI();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifiant || !motDePasse) {
            setErreur('Veuillez saisir votre identifiant et mot de passe');
            return;
        }

        try {
            setLoading(true);
            setErreur('');

            await connexion(identifiant, motDePasse);
            router.push('/medecin/tableau-bord');
        } catch (error) {
            console.error("Doctor login error:", error);

            // Display error message
            const errorMessage = error.userMessage || error.message || 'Identifiants incorrects';
            setErreur(errorMessage);

            // Show toast for network errors
            if (error.message?.includes('connexion au serveur')) {
                showErrorToast('Problème de connexion au serveur. Vérifiez que le backend est accessible.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Espace médecin
                        </h1>
                        <p className="text-gray-600">
                            Connectez-vous pour accéder à votre espace médecin
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {erreur && (
                            <div className="px-4 py-3 bg-red-50 text-red-500 text-sm rounded-md">
                                {erreur}
                            </div>
                        )}

                        <div>
                            <label htmlFor="identifiant" className="block text-sm font-medium text-gray-700">
                                Identifiant
                            </label>
                            <input
                                id="identifiant"
                                name="identifiant"
                                type="text"
                                required
                                value={identifiant}
                                onChange={(e) => setIdentifiant(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="motDePasse"
                                name="motDePasse"
                                type="password"
                                required
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5CB1B1] hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Information */}
            <div className="hidden md:block bg-[#5CB1B1]/10">
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Bienvenue dans votre espace médecin
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Gérez vos patients, vos rendez-vous et les dossiers médicaux en toute simplicité.
                        </p>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                Fonctionnalités disponibles:
                            </h3>
                            <ul className="space-y-2 text-gray-600 list-disc list-inside">
                                <li>Gestion des patients</li>
                                <li>Planification des rendez-vous</li>
                                <li>Dossiers médicaux électroniques</li>
                                <li>Gestion des disponibilités</li>
                                <li>Suivi des consultations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}