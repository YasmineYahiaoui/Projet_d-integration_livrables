'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
    const [identifiants, setIdentifiants] = useState({
        nomUtilisateur: '',
        motDePasse: ''
    });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const router = useRouter();
    const { connexion } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIdentifiants(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user changes input
        if (erreur) setErreur('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!identifiants.nomUtilisateur.trim() || !identifiants.motDePasse) {
            setErreur('Veuillez saisir votre nom d\'utilisateur et votre mot de passe');
            return;
        }

        setErreur('');
        setChargement(true);

        try {
            // Call the auth context login method
            const result = await connexion(identifiants.nomUtilisateur, identifiants.motDePasse);
            console.log('Connexion réussie:', result);

            // Redirect to dashboard on success
            router.push('/tableau-bord');
        } catch (error) {
            console.error('Erreur de connexion:', error);

            // Handle different types of errors
            if (error.response && error.response.status === 401) {
                setErreur('Nom d\'utilisateur ou mot de passe incorrect');
            } else if (error.response && error.response.data && error.response.data.message) {
                setErreur(error.response.data.message);
            } else {
                setErreur('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
            }
        } finally {
            setChargement(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {erreur && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {erreur}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="nomUtilisateur" className="block text-sm font-medium text-gray-700">
                    Nom d&apos;utilisateur
                </label>
                <input
                    id="nomUtilisateur"
                    name="nomUtilisateur"
                    type="text"
                    required
                    value={identifiants.nomUtilisateur}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    placeholder="admin"
                    autoComplete="username"
                    disabled={chargement}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                </label>
                <input
                    id="motDePasse"
                    name="motDePasse"
                    type="password"
                    required
                    value={identifiants.motDePasse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    placeholder="••••••"
                    autoComplete="current-password"
                    disabled={chargement}
                />
            </div>

            <button
                type="submit"
                disabled={chargement}
                className="w-full bg-[#5CB1B1] text-white py-2 px-4 rounded-full hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2 disabled:opacity-70"
            >
                {chargement ? 'Connexion en cours...' : 'Connexion'}
            </button>
        </form>
    );
}