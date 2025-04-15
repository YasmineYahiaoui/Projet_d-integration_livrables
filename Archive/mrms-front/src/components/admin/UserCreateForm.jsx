'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { useUI } from '@/contexts/UIContext';

export default function UserCreateForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        identifiant: '',
        motDePasse: '',
        role: 'Médecin'
    });

    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const [validation, setValidation] = useState({});
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

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        try {
            setChargement(true);
            setErreur('');

            // Call the admin-only user creation function
            await authService.createUser(formData);

            // Show success notification
            if (addToast) {
                addToast({
                    type: 'success',
                    message: 'Utilisateur créé avec succès!'
                });
            }

            // Handle success callback or redirect
            if (onSuccess) {
                onSuccess();
            } else {
                // Reset form
                setFormData({
                    nom: '',
                    prenom: '',
                    email: '',
                    identifiant: '',
                    motDePasse: '',
                    role: 'Médecin'
                });
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);

            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setErreur("Vous n'avez pas les permissions nécessaires pour créer un utilisateur.");
                } else if (error.response.status === 409) {
                    setErreur('Cet identifiant ou cette adresse email est déjà utilisé.');
                } else if (error.response.data && error.response.data.message) {
                    setErreur(error.response.data.message);
                } else {
                    setErreur('Une erreur est survenue lors de la création de l\'utilisateur. Veuillez réessayer.');
                }
            } else {
                setErreur('Impossible de communiquer avec le serveur. Veuillez vérifier votre connexion et réessayer.');
            }
        } finally {
            setChargement(false);
        }
    };

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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle <span className="text-red-500">*</span>
                </label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    disabled={chargement}
                >
                    <option value="Médecin">Médecin</option>
                    <option value="Administrateur">Administrateur</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={() => {
                        if (onSuccess) onSuccess();
                        else router.back();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={chargement}
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    disabled={chargement}
                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2 disabled:opacity-70"
                >
                    {chargement ? 'Création en cours...' : 'Créer l\'utilisateur'}
                </button>
            </div>
        </form>
    );
}