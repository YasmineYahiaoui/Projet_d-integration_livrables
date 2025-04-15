'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Update import path as needed

export default function DoctorLoginForm() {
    const [identifiant, setIdentifiant] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const [loading, setLoading] = useState(false);
    const { connexion } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        // Basic validation
        if (!identifiant || !motDePasse) {
            setErreur('Veuillez saisir votre identifiant et mot de passe');
            return;
        }

        setLoading(true);
        setErreur('');

        try {
            console.log("Attempting login with:", identifiant);
            await connexion(identifiant, motDePasse);
            console.log("Login successful");

            // Navigate after successful login
            router.push('/medecin/tableau-bord');
        } catch (error) {
            console.error("Login error:", error);
            setErreur(error.message || 'Identifiants incorrects');
            setLoading(false);
        }
    };

    return (
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
    );
}