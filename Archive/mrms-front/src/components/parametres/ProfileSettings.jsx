import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';

export default function ProfileSettings() {
    const { utilisateur } = useAuth();

    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
    });

    const [chargement, setChargement] = useState(false);
    const [message, setMessage] = useState({ type: '', texte: '' });
    const [validation, setValidation] = useState({});

    // Charger les données de l'utilisateur
    useEffect(() => {
        if (utilisateur) {
            setFormData(prev => ({
                ...prev,
                nom: utilisateur.nom || '',
                email: utilisateur.email || ''
            }));
        }
    }, [utilisateur]);

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
    };

    // Valider le formulaire de changement de mot de passe
    const validerFormulaire = () => {
        const erreurs = {};

        // Vérifier si l'ancien mot de passe est fourni
        if (!formData.ancienMotDePasse) {
            erreurs.ancienMotDePasse = 'L\'ancien mot de passe est requis';
        }

        // Vérifier si le nouveau mot de passe est fourni
        if (!formData.nouveauMotDePasse) {
            erreurs.nouveauMotDePasse = 'Le nouveau mot de passe est requis';
        } else if (formData.nouveauMotDePasse.length < 6) {
            erreurs.nouveauMotDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        // Vérifier si la confirmation correspond
        if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
            erreurs.confirmationMotDePasse = 'Les mots de passe ne correspondent pas';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Soumettre le formulaire de changement de mot de passe
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        try {
            setChargement(true);
            setMessage({ type: '', texte: '' });

            // Appel à l'API pour changer le mot de passe
            await authService.changerMotDePasse(
                formData.ancienMotDePasse,
                formData.nouveauMotDePasse
            );

            // Réinitialiser les champs de mot de passe
            setFormData(prev => ({
                ...prev,
                ancienMotDePasse: '',
                nouveauMotDePasse: '',
                confirmationMotDePasse: ''
            }));

            setMessage({
                type: 'success',
                texte: 'Votre mot de passe a été modifié avec succès.'
            });
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);

            // Gérer les différentes erreurs
            if (error.response && error.response.status === 401) {
                setMessage({
                    type: 'error',
                    texte: 'L\'ancien mot de passe est incorrect.'
                });
            } else {
                setMessage({
                    type: 'error',
                    texte: 'Une erreur est survenue lors du changement de mot de passe.'
                });
            }
        } finally {
            setChargement(false);

            // Effacer le message après 5 secondes
            setTimeout(() => {
                setMessage({ type: '', texte: '' });
            }, 5000);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Profil utilisateur</h2>

            {/* Informations utilisateur */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Nom</p>
                        <p className="text-base font-medium text-gray-900">{formData.nom}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base font-medium text-gray-900">{formData.email || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Rôle</p>
                        <p className="text-base font-medium text-gray-900">{utilisateur?.role || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Formulaire de changement de mot de passe */}
            <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Changer le mot de passe</h3>

                {message.texte && (
                    <div className={`mb-6 p-4 rounded-md ${
                        message.type === 'success'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                        {message.texte}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ancienMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                            Ancien mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="ancienMotDePasse"
                            name="ancienMotDePasse"
                            value={formData.ancienMotDePasse}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                                validation.ancienMotDePasse ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        />
                        {validation.ancienMotDePasse && (
                            <p className="mt-1 text-sm text-red-600">{validation.ancienMotDePasse}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="nouveauMotDePasse"
                            name="nouveauMotDePasse"
                            value={formData.nouveauMotDePasse}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                                validation.nouveauMotDePasse ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        />
                        {validation.nouveauMotDePasse && (
                            <p className="mt-1 text-sm text-red-600">{validation.nouveauMotDePasse}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmationMotDePasse"
                            name="confirmationMotDePasse"
                            value={formData.confirmationMotDePasse}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                                validation.confirmationMotDePasse ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        />
                        {validation.confirmationMotDePasse && (
                            <p className="mt-1 text-sm text-red-600">{validation.confirmationMotDePasse}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={chargement}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                        >
                            {chargement ? 'Enregistrement...' : 'Changer le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}