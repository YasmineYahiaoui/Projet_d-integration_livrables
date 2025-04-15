import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function FaqList({ faqs = [], estAdmin = false, onAnswer, onDelete }) {
    // Ensure faqs is always an array
    const faqsArray = Array.isArray(faqs) ? faqs : [];

    const [faqOuverte, setFaqOuverte] = useState(null);
    const [faqEnEdition, setFaqEnEdition] = useState(null);
    const [reponse, setReponse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [confirmationSuppression, setConfirmationSuppression] = useState(null);

    // Formater la date
    const formaterDate = (dateString) => {
        try {
            return format(new Date(dateString), 'PPP', { locale: fr });
        } catch (error) {
            return 'Date invalide';
        }
    };

    // Basculer l'état d'ouverture d'une FAQ
    const toggleFaq = (id) => {
        setFaqOuverte(faqOuverte === id ? null : id);
    };

    // Commencer à répondre à une FAQ
    const commencerRepondre = (faq) => {
        setFaqEnEdition(faq.id);
        setReponse(faq.reponse || '');
    };

    // Annuler la réponse
    const annulerReponse = () => {
        setFaqEnEdition(null);
        setReponse('');
    };

    // Soumettre la réponse
    const soumettreReponse = async () => {
        if (!reponse.trim() || !onAnswer) return;

        setChargement(true);
        const succes = await onAnswer(faqEnEdition, reponse);
        setChargement(false);

        if (succes) {
            setFaqEnEdition(null);
            setReponse('');
        }
    };

    // Confirmer la suppression
    const confirmerSuppression = (id) => {
        setConfirmationSuppression(id);
    };

    // Annuler la suppression
    const annulerSuppression = () => {
        setConfirmationSuppression(null);
    };

    // Supprimer la FAQ
    const supprimerFaq = async () => {
        if (!confirmationSuppression || !onDelete) return;

        setChargement(true);
        const succes = await onDelete(confirmationSuppression);
        setChargement(false);

        if (succes) {
            setConfirmationSuppression(null);
            if (faqOuverte === confirmationSuppression) {
                setFaqOuverte(null);
            }
        }
    };

    // Si aucune FAQ
    if (faqsArray.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Aucune question fréquemment posée pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200">
            {faqsArray.map(faq => (
                <div key={faq.id || `faq-${Math.random()}`} className="py-4 px-6">
                    <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleFaq(faq.id)}
                    >
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-[#5CB1B1]">
                                {faq.question || 'Question sans titre'}
                            </h3>

                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>Posée le {faq.dateCreation ? formaterDate(faq.dateCreation) : 'N/A'}</span>
                                {!faq.reponse && estAdmin && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                                        En attente de réponse
                                    </span>
                                )}
                            </div>
                        </div>

                        <span className="ml-6 h-7 flex items-center">
                            {faqOuverte === faq.id ? (
                                <ChevronUpIcon className="h-5 w-5 text-[#5CB1B1]" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </span>
                    </div>

                    {/* Contenu déplié */}
                    {faqOuverte === faq.id && (
                        <div className="mt-4">
                            {/* Réponse */}
                            {faq.reponse ? (
                                <div className="prose prose-sm text-gray-700">
                                    <p>{faq.reponse}</p>
                                    {faq.dateReponse && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Répondu le {formaterDate(faq.dateReponse)}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Cette question n'a pas encore de réponse.
                                </p>
                            )}

                            {/* Actions Admin */}
                            {estAdmin && (
                                <div className="mt-4 flex justify-end space-x-3">
                                    {faqEnEdition !== faq.id ? (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    commencerRepondre(faq);
                                                }}
                                                className="text-[#5CB1B1] hover:text-[#4A9494] text-sm font-medium"
                                            >
                                                {faq.reponse ? 'Modifier la réponse' : 'Répondre'}
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmerSuppression(faq.id);
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full space-y-3">
                                            <textarea
                                                value={reponse}
                                                onChange={(e) => setReponse(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                                rows={4}
                                                placeholder="Votre réponse..."
                                            />

                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        annulerReponse();
                                                    }}
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                                                    disabled={chargement}
                                                >
                                                    Annuler
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        soumettreReponse();
                                                    }}
                                                    className="px-3 py-1 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] text-sm"
                                                    disabled={chargement || !reponse.trim()}
                                                >
                                                    {chargement ? 'Enregistrement...' : 'Enregistrer'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Modal de confirmation de suppression */}
                    {confirmationSuppression === faq.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Confirmer la suppression
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            annulerSuppression();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        disabled={chargement}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            supprimerFaq();
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        disabled={chargement}
                                    >
                                        {chargement ? 'Suppression...' : 'Supprimer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}