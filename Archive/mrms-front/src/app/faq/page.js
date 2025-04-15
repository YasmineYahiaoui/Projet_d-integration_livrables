'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import FaqList from '@/components/faq/FaqList';
import FaqForm from '@/components/faq/FaqForm';
import faqService from '@/services/faqService';
import { useAuth } from '@/hooks/useAuth';

export default function FaqPage() {
    const { estAdmin } = useAuth();
    const [faqs, setFaqs] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);

    // Charger les FAQs
    useEffect(() => {
        const chargerFaqs = async () => {
            try {
                setChargement(true);

                const response = estAdmin()
                    ? await faqService.getAllFaqs()  // Admin voit toutes les FAQs, y compris celles sans réponse
                    : await faqService.getPublicFaqs(); // Les autres ne voient que les FAQs publiques (avec réponses)

                setFaqs(response);
            } catch (error) {
                console.error('Erreur lors du chargement des FAQs:', error);
                setErreur('Impossible de charger les FAQs. Veuillez réessayer.');
            } finally {
                setChargement(false);
            }
        };

        chargerFaqs();
    }, [estAdmin]);

    // Ajouter une nouvelle FAQ
    const ajouterFaq = (nouvelleFaq) => {
        setFaqs(prevFaqs => [nouvelleFaq, ...prevFaqs]);
        setAfficherFormulaire(false);
    };

    // Répondre à une FAQ (admin uniquement)
    const repondreFaq = async (id, reponse) => {
        try {
            const faqMiseAJour = await faqService.answerFaq(id, reponse);

            setFaqs(prevFaqs =>
                prevFaqs.map(faq =>
                    faq.id === id ? faqMiseAJour : faq
                )
            );

            return true;
        } catch (error) {
            console.error('Erreur lors de la réponse à la FAQ:', error);
            return false;
        }
    };

    // Supprimer une FAQ (admin uniquement)
    const supprimerFaq = async (id) => {
        try {
            await faqService.deleteFaq(id);

            setFaqs(prevFaqs =>
                prevFaqs.filter(faq => faq.id !== id)
            );

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la FAQ:', error);
            return false;
        }
    };

    return (
        <ProtectedRoute titre="FAQ">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Foire Aux Questions
                    </h1>

                    <button
                        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
                        className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                    >
                        {afficherFormulaire ? 'Annuler' : 'Poser une question'}
                    </button>
                </div>

                {/* Formulaire */}
                {afficherFormulaire && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <FaqForm onSubmit={ajouterFaq} onCancel={() => setAfficherFormulaire(false)} />
                    </div>
                )}

                {/* Message d'erreur */}
                {erreur && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{erreur}</p>
                    </div>
                )}

                {/* Liste des FAQs */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {chargement ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : (
                        <FaqList
                            faqs={faqs}
                            estAdmin={estAdmin()}
                            onAnswer={repondreFaq}
                            onDelete={supprimerFaq}
                        />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}