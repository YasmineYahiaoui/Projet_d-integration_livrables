import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';

export default function AppointmentSettings() {
    const [parametres, setParametres] = useState({
        dureeParDefaut: 30,
        heureOuverture: '08:00',
        heureFermeture: '18:00',
        joursOuvres: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
        intervalleCreneaux: 15,
        autorisationRdvJourMeme: true,
        delaiMinimumRdv: 1, // en heures
        delaiAnnulation: 24 // en heures
    });

    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [message, setMessage] = useState({ type: '', texte: '' });

    const joursDisponibles = [
        { id: 'lundi', label: 'Lundi' },
        { id: 'mardi', label: 'Mardi' },
        { id: 'mercredi', label: 'Mercredi' },
        { id: 'jeudi', label: 'Jeudi' },
        { id: 'vendredi', label: 'Vendredi' },
        { id: 'samedi', label: 'Samedi' },
        { id: 'dimanche', label: 'Dimanche' }
    ];

    // Charger les paramètres
    useEffect(() => {
        const chargerParametres = async () => {
            try {
                setChargement(true);
                const response = await settingsService.getAppointmentSettings();

                // Ensure default values if properties are missing
                setParametres({
                    dureeParDefaut: response?.dureeParDefaut || 30,
                    heureOuverture: response?.heureOuverture || '08:00',
                    heureFermeture: response?.heureFermeture || '18:00',
                    joursOuvres: Array.isArray(response?.joursOuvres) ? response.joursOuvres : ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
                    intervalleCreneaux: response?.intervalleCreneaux || 15,
                    autorisationRdvJourMeme: response?.autorisationRdvJourMeme !== undefined ? response.autorisationRdvJourMeme : true,
                    delaiMinimumRdv: response?.delaiMinimumRdv || 1,
                    delaiAnnulation: response?.delaiAnnulation || 24
                });
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres de rendez-vous:', error);
                setMessage({
                    type: 'error',
                    texte: 'Impossible de charger les paramètres de rendez-vous.'
                });
            } finally {
                setChargement(false);
            }
        };

        chargerParametres();
    }, []);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'joursOuvres') {
            // Gérer les jours d'ouverture (cases à cocher multiples)
            const jour = value;
            const nouveauxJours = Array.isArray(parametres.joursOuvres)
                ? [...parametres.joursOuvres]
                : [];

            if (checked) {
                // Ajouter le jour s'il n'est pas déjà présent
                if (!nouveauxJours.includes(jour)) {
                    nouveauxJours.push(jour);
                }
            } else {
                // Retirer le jour
                const index = nouveauxJours.indexOf(jour);
                if (index !== -1) {
                    nouveauxJours.splice(index, 1);
                }
            }

            setParametres(prev => ({
                ...prev,
                joursOuvres: nouveauxJours
            }));
        } else {
            // Gérer les autres champs
            setParametres(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
            }));
        }
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setEnregistrement(true);
            setMessage({ type: '', texte: '' });

            // Validation
            if (parametres.heureOuverture >= parametres.heureFermeture) {
                setMessage({
                    type: 'error',
                    texte: 'L\'heure d\'ouverture doit être antérieure à l\'heure de fermeture.'
                });
                setEnregistrement(false);
                return;
            }

            if (!Array.isArray(parametres.joursOuvres) || parametres.joursOuvres.length === 0) {
                setMessage({
                    type: 'error',
                    texte: 'Veuillez sélectionner au moins un jour d\'ouverture.'
                });
                setEnregistrement(false);
                return;
            }

            await settingsService.updateAppointmentSettings(parametres);

            setMessage({
                type: 'success',
                texte: 'Les paramètres de rendez-vous ont été enregistrés avec succès.'
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des paramètres de rendez-vous:', error);
            setMessage({
                type: 'error',
                texte: 'Une erreur est survenue lors de l\'enregistrement des paramètres de rendez-vous.'
            });
        } finally {
            setEnregistrement(false);

            // Effacer le message après 5 secondes
            setTimeout(() => {
                setMessage({ type: '', texte: '' });
            }, 5000);
        }
    };

    if (chargement) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    // Ensure joursOuvres is always an array
    const joursOuvresArray = Array.isArray(parametres.joursOuvres)
        ? parametres.joursOuvres
        : [];

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Paramètres des rendez-vous</h2>

            {message.texte && (
                <div className={`mb-6 p-4 rounded-md ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {message.texte}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Horaires d'ouverture</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="heureOuverture" className="block text-sm text-gray-700 mb-1">
                                Heure d'ouverture
                            </label>
                            <input
                                type="time"
                                id="heureOuverture"
                                name="heureOuverture"
                                value={parametres.heureOuverture}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>

                        <div>
                            <label htmlFor="heureFermeture" className="block text-sm text-gray-700 mb-1">
                                Heure de fermeture
                            </label>
                            <input
                                type="time"
                                id="heureFermeture"
                                name="heureFermeture"
                                value={parametres.heureFermeture}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>
                    </div>

                    <div>
            <span className="block text-sm text-gray-700 mb-2">
              Jours d'ouverture
            </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {joursDisponibles.map(jour => (
                                <div key={jour.id} className="flex items-center">
                                    <input
                                        id={`jour-${jour.id}`}
                                        name="joursOuvres"
                                        type="checkbox"
                                        value={jour.id}
                                        checked={joursOuvresArray.includes(jour.id)}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                                    />
                                    <label htmlFor={`jour-${jour.id}`} className="ml-3 text-sm text-gray-700">
                                        {jour.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Paramètres des créneaux</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dureeParDefaut" className="block text-sm text-gray-700 mb-1">
                                Durée par défaut des rendez-vous (minutes)
                            </label>
                            <select
                                id="dureeParDefaut"
                                name="dureeParDefaut"
                                value={parametres.dureeParDefaut}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 heure</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="intervalleCreneaux" className="block text-sm text-gray-700 mb-1">
                                Intervalle entre les créneaux (minutes)
                            </label>
                            <select
                                id="intervalleCreneaux"
                                name="intervalleCreneaux"
                                value={parametres.intervalleCreneaux}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Contraintes des rendez-vous</h3>

                    <div className="flex items-center">
                        <input
                            id="autorisationRdvJourMeme"
                            name="autorisationRdvJourMeme"
                            type="checkbox"
                            checked={parametres.autorisationRdvJourMeme}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                        />
                        <label htmlFor="autorisationRdvJourMeme" className="ml-3 text-sm text-gray-700">
                            Autoriser les rendez-vous le jour même
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="delaiMinimumRdv" className="block text-sm text-gray-700 mb-1">
                                Délai minimum avant un rendez-vous (heures)
                            </label>
                            <input
                                type="number"
                                id="delaiMinimumRdv"
                                name="delaiMinimumRdv"
                                value={parametres.delaiMinimumRdv}
                                onChange={handleChange}
                                min="0"
                                max="48"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>

                        <div>
                            <label htmlFor="delaiAnnulation" className="block text-sm text-gray-700 mb-1">
                                Délai d'annulation sans frais (heures)
                            </label>
                            <input
                                type="number"
                                id="delaiAnnulation"
                                name="delaiAnnulation"
                                value={parametres.delaiAnnulation}
                                onChange={handleChange}
                                min="0"
                                max="72"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={enregistrement}
                        className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                    >
                        {enregistrement ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                    </button>
                </div>
            </form>
        </div>
    );
}