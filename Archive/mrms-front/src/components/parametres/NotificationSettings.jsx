import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';

export default function NotificationSettings() {
    const [parametres, setParametres] = useState({
        notificationEmail: true,
        notificationSMS: false,
        delaiRappelRendezVous: 24,
        emailConfirmation: true,
        smsConfirmation: false
    });

    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [message, setMessage] = useState({ type: '', texte: '' });

    // Charger les paramètres
    useEffect(() => {
        const chargerParametres = async () => {
            try {
                setChargement(true);
                const response = await settingsService.getNotificationSettings();

                // Set default values if properties are missing
                setParametres({
                    notificationEmail: response?.notificationEmail !== undefined ? response.notificationEmail : true,
                    notificationSMS: response?.notificationSMS !== undefined ? response.notificationSMS : false,
                    delaiRappelRendezVous: response?.delaiRappelRendezVous || 24,
                    emailConfirmation: response?.emailConfirmation !== undefined ? response.emailConfirmation : true,
                    smsConfirmation: response?.smsConfirmation !== undefined ? response.smsConfirmation : false
                });
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres de notification:', error);
                setMessage({
                    type: 'error',
                    texte: 'Impossible de charger les paramètres de notification.'
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
        setParametres(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
        }));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setEnregistrement(true);
            setMessage({ type: '', texte: '' });

            await settingsService.updateNotificationSettings(parametres);

            setMessage({
                type: 'success',
                texte: 'Les paramètres de notification ont été enregistrés avec succès.'
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des paramètres de notification:', error);
            setMessage({
                type: 'error',
                texte: 'Une erreur est survenue lors de l\'enregistrement des paramètres de notification.'
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

    // Ensure all boolean values have fallbacks
    const notificationEmail = parametres.notificationEmail !== undefined ? parametres.notificationEmail : true;
    const notificationSMS = parametres.notificationSMS !== undefined ? parametres.notificationSMS : false;
    const emailConfirmation = parametres.emailConfirmation !== undefined ? parametres.emailConfirmation : true;
    const smsConfirmation = parametres.smsConfirmation !== undefined ? parametres.smsConfirmation : false;

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Paramètres de notification</h2>

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
                    <h3 className="text-sm font-medium text-gray-900">Types de notification</h3>

                    <div className="flex items-center">
                        <input
                            id="notificationEmail"
                            name="notificationEmail"
                            type="checkbox"
                            checked={notificationEmail}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                        />
                        <label htmlFor="notificationEmail" className="ml-3 text-sm text-gray-700">
                            Notifications par email
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="notificationSMS"
                            name="notificationSMS"
                            type="checkbox"
                            checked={notificationSMS}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                        />
                        <label htmlFor="notificationSMS" className="ml-3 text-sm text-gray-700">
                            Notifications par SMS
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Rappels de rendez-vous</h3>

                    <div>
                        <label htmlFor="delaiRappelRendezVous" className="block text-sm text-gray-700 mb-1">
                            Délai de rappel avant le rendez-vous (heures)
                        </label>
                        <input
                            type="number"
                            id="delaiRappelRendezVous"
                            name="delaiRappelRendezVous"
                            value={parametres.delaiRappelRendezVous || 24}
                            onChange={handleChange}
                            min="1"
                            max="72"
                            className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="emailConfirmation"
                            name="emailConfirmation"
                            type="checkbox"
                            checked={emailConfirmation}
                            onChange={handleChange}
                            disabled={!notificationEmail}
                            className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded disabled:opacity-50"
                        />
                        <label htmlFor="emailConfirmation" className={`ml-3 text-sm ${!notificationEmail ? 'text-gray-400' : 'text-gray-700'}`}>
                            Envoyer un email de confirmation lors de la création d'un rendez-vous
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="smsConfirmation"
                            name="smsConfirmation"
                            type="checkbox"
                            checked={smsConfirmation}
                            onChange={handleChange}
                            disabled={!notificationSMS}
                            className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded disabled:opacity-50"
                        />
                        <label htmlFor="smsConfirmation" className={`ml-3 text-sm ${!notificationSMS ? 'text-gray-400' : 'text-gray-700'}`}>
                            Envoyer un SMS de confirmation lors de la création d'un rendez-vous
                        </label>
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