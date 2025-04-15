import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/contexts/UIContext';
import patientService from '@/services/patientService';

export default function MedicalNotes({ patient, onUpdate }) {
    const { estMedecin } = useAuth();
    const { addToast } = useUI();
    const [noteMedicale, setNoteMedicale] = useState(patient.noteMedecin || '');
    const [allergies, setAllergies] = useState(patient.allergies || '');
    const [antecedents, setAntecedents] = useState(patient.antecedentsMedicaux || '');
    const [enregistrement, setEnregistrement] = useState(false);
    const [message, setMessage] = useState({ type: '', texte: '' });

    // Vérifier que l'utilisateur est médecin
    if (!estMedecin()) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-red-700">
                                Vous n'avez pas les permissions nécessaires pour accéder aux notes médicales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setEnregistrement(true);
            setMessage({ type: '', texte: '' });

            // Préparer les données à mettre à jour
            const donneesMiseAJour = {
                noteMedecin: noteMedicale,
                allergies: allergies,
                antecedentsMedicaux: antecedents
            };

            // Appel à l'API pour mettre à jour les données
            const patientMisAJour = await patientService.updatePatient(patient.id, donneesMiseAJour);

            // Mettre à jour les données locales
            if (onUpdate) {
                onUpdate({
                    ...patient,
                    ...donneesMiseAJour
                });
            }

            // Afficher une notification
            addToast({
                type: 'success',
                message: 'Les notes médicales ont été enregistrées avec succès.'
            });

            setMessage({
                type: 'success',
                texte: 'Les notes médicales ont été enregistrées avec succès.'
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notes médicales:', error);

            const errorMsg = error.userMessage || 'Une erreur est survenue lors de l\'enregistrement des notes médicales.';

            setMessage({
                type: 'error',
                texte: errorMsg
            });

            addToast({
                type: 'error',
                message: errorMsg
            });
        } finally {
            setEnregistrement(false);

            // Effacer le message après 5 secondes
            setTimeout(() => {
                setMessage({ type: '', texte: '' });
            }, 5000);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Notes médicales</h2>
                <div className="bg-yellow-50 rounded-full px-3 py-1 text-xs font-medium text-yellow-800">
                    Visible uniquement par les médecins
                </div>
            </div>

            {message.texte && (
                <div className={`mb-6 p-4 rounded-md ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {message.texte}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                            Allergies connues
                        </label>
                        <textarea
                            id="allergies"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            placeholder="Allergies du patient (médicaments, aliments, etc.)"
                        />
                    </div>

                    <div>
                        <label htmlFor="antecedents" className="block text-sm font-medium text-gray-700 mb-1">
                            Antécédents médicaux
                        </label>
                        <textarea
                            id="antecedents"
                            value={antecedents}
                            onChange={(e) => setAntecedents(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            placeholder="Antécédents médicaux du patient"
                        />
                    </div>

                    <div>
                        <label htmlFor="noteMedicale" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes du médecin
                        </label>
                        <textarea
                            id="noteMedicale"
                            value={noteMedicale}
                            onChange={(e) => setNoteMedicale(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            placeholder="Notes concernant le patient (confidentiel)"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={enregistrement}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                        >
                            {enregistrement ? 'Enregistrement...' : 'Enregistrer les notes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}