'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import patientService from '@/services/patientService';
import { useAuth } from '@/contexts/AuthContext';

export default function MinimalPatientRegister() {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        motDePasse: '',
        confirmationMotDePasse: ''
    });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const [validation, setValidation] = useState({});
    const router = useRouter();
    const { connexion } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation errors
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (erreur) setErreur('');
    };

    // Validate form
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        setChargement(true);

        try {
            // Préparation des données pour l'API
            const patientData = {
                prenom: formData.prenom,
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone || '',
                motDePasse: formData.motDePasse
            };

            // Appel au service d'inscription
            const response = await patientService.inscription(patientData);

            // Connexion automatique de l'utilisateur
            if (response && response.token) {
                await connexion(formData.email, formData.motDePasse);
                router.push('/patient/tableau-bord');
            }
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            setErreur(error.userMessage || "Une erreur est survenue lors de l'inscription");
        } finally {
            setChargement(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {erreur && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {erreur}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                </label>
                <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    disabled={chargement}
                />
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5CB1B1] hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
            >
                {chargement ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
        </form>
    );
}