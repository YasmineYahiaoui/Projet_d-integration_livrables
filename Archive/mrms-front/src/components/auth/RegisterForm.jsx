'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/contexts/UIContext';

export default function RegisterForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        identifiant: '',
        motDePasse: '',
        confirmationMotDePasse: ''
    });

    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const [validation, setValidation] = useState({});
    const [showRegistrationInfo, setShowRegistrationInfo] = useState(false);
    const router = useRouter();
    const { addToast } = useUI || { addToast: () => {} };

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Réinitialiser l'erreur de validation pour ce champ
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Effacer l'erreur générale quand l'utilisateur modifie les champs
        if (erreur) setErreur('');
    };

    // Valider le formulaire
    const validerFormulaire = () => {
        const erreurs = {};

        if (!formData.nom.trim()) erreurs.nom = 'Le nom est requis';
        if (!formData.prenom.trim()) erreurs.prenom = 'Le prénom est requis';

        if (!formData.email.trim()) {
            erreurs.email = 'L\'email est requis';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                erreurs.email = 'L\'adresse email n\'est pas valide';
            }
        }

        if (!formData.identifiant.trim()) {
            erreurs.identifiant = 'L\'identifiant est requis';
        } else if (formData.identifiant.trim().length < 4) {
            erreurs.identifiant = 'L\'identifiant doit contenir au moins 4 caractères';
        }

        if (!formData.motDePasse) {
            erreurs.motDePasse = 'Le mot de passe est requis';
        } else if (formData.motDePasse.length < 6) {
            erreurs.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.motDePasse !== formData.confirmationMotDePasse) {
            erreurs.confirmationMotDePasse = 'Les mots de passe ne correspondent pas';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        // Instead of attempting to register directly, show the info message
        setShowRegistrationInfo(true);

        if (addToast) {
            addToast({
                type: 'info',
                message: "L'inscription directe n'est pas activée. Contactez un administrateur pour obtenir un compte."
            });
        }
    };

    // If showing the info message
    if (showRegistrationInfo) {
        return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Inscription non disponible</h3>
                <p className="text-blue-700 mb-4">
                    L'inscription directe n'est pas activée sur cette plateforme.
                    Seuls les administrateurs peuvent créer de nouveaux comptes utilisateurs.
                </p>
                <p className="text-blue-700 mb-6">
                    Veuillez contacter votre administrateur système pour obtenir un compte.
                </p>
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => setShowRegistrationInfo(false)}
                        className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                        Retour au formulaire
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (onSuccess) onSuccess();
                            else router.push('/');
                        }}
                        className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                    >
                        Aller à la page de connexion
                    </button>
                </div>
            </div>
        );
    }

    // Standard registration form UI
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {erreur && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {erreur}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="nom"
                        name="nom"
                        type="text"
                        required
                        value={formData.nom}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                            validation.nom ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        disabled={chargement}
                    />
                    {validation.nom && (
                        <p className="mt-1 text-sm text-red-600">{validation.nom}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        required
                        value={formData.prenom}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                            validation.prenom ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        disabled={chargement}
                    />
                    {validation.prenom && (
                        <p className="mt-1 text-sm text-red-600">{validation.prenom}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                        validation.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                    disabled={chargement}
                />
                {validation.email && (
                    <p className="mt-1 text-sm text-red-600">{validation.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="identifiant" className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant <span className="text-red-500">*</span>
                </label>
                <input
                    id="identifiant"
                    name="identifiant"
                    type="text"
                    required
                    value={formData.identifiant}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                        validation.identifiant ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                    disabled={chargement}
                />
                {validation.identifiant && (
                    <p className="mt-1 text-sm text-red-600">{validation.identifiant}</p>
                )}
            </div>

            <div>
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                    id="motDePasse"
                    name="motDePasse"
                    type="password"
                    required
                    value={formData.motDePasse}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                        validation.motDePasse ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                    disabled={chargement}
                />
                {validation.motDePasse && (
                    <p className="mt-1 text-sm text-red-600">{validation.motDePasse}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                    id="confirmationMotDePasse"
                    name="confirmationMotDePasse"
                    type="password"
                    required
                    value={formData.confirmationMotDePasse}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                        validation.confirmationMotDePasse ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                    disabled={chargement}
                />
                {validation.confirmationMotDePasse && (
                    <p className="mt-1 text-sm text-red-600">{validation.confirmationMotDePasse}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={chargement}
                className="w-full bg-[#5CB1B1] text-white py-2 px-4 rounded-full hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2 disabled:opacity-70"
            >
                {chargement ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
        </form>
    );
}