import { useState, useCallback } from 'react';
import faqService from '@/services/faqService';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook personnalisé pour la gestion des FAQs
 * @returns {Object} Fonctions et états pour la gestion des FAQs
 */
export default function useFaq() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { addToast } = useUI();
    const { estAdmin } = useAuth();

    /**
     * Charger les FAQs
     * @param {boolean} publicOnly - Charger uniquement les FAQs publiques
     * @returns {Promise<Array>} Liste des FAQs
     */
    const loadFaqs = useCallback(async (publicOnly = !estAdmin()) => {
        try {
            setLoading(true);
            setError(null);

            const response = publicOnly
                ? await faqService.getPublicFaqs()
                : await faqService.getAllFaqs();

            setFaqs(response);
            return response;
        } catch (error) {
            console.error('Erreur lors du chargement des FAQs:', error);
            setError('Impossible de charger les FAQs. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de charger les FAQs. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [estAdmin, addToast]);

    /**
     * Soumettre une nouvelle question
     * @param {Object} questionData - Données de la question
     * @returns {Promise<Object>} Question créée
     */
    const submitQuestion = useCallback(async (questionData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await faqService.submitQuestion(questionData);

            // Ajouter la nouvelle question à la liste si l'utilisateur est admin
            if (estAdmin()) {
                setFaqs(prev => [response, ...prev]);
            }

            addToast({
                type: 'success',
                message: 'Question soumise avec succès. Merci pour votre contribution!'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la soumission de la question:', error);
            setError('Impossible de soumettre la question. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de soumettre la question. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [estAdmin, addToast]);

    /**
     * Répondre à une question (admin uniquement)
     * @param {string|number} id - ID de la question
     * @param {string} reponse - Réponse à la question
     * @returns {Promise<Object>} FAQ mise à jour
     */
    const answerQuestion = useCallback(async (id, reponse) => {
        if (!estAdmin()) {
            const error = new Error('Vous n\'avez pas les permissions nécessaires pour répondre aux questions.');
            addToast({
                type: 'error',
                message: 'Accès refusé: Vous n\'avez pas les permissions nécessaires.'
            });
            throw error;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await faqService.answerFaq(id, reponse);

            // Mettre à jour la FAQ dans la liste
            setFaqs(prev =>
                prev.map(faq => faq.id === id ? response : faq)
            );

            addToast({
                type: 'success',
                message: 'Réponse enregistrée avec succès.'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la réponse:', error);
            setError('Impossible d\'enregistrer la réponse. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible d\'enregistrer la réponse. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [estAdmin, addToast]);

    /**
     * Supprimer une question (admin uniquement)
     * @param {string|number} id - ID de la question
     * @returns {Promise<Object>} Résultat de la suppression
     */
    const deleteQuestion = useCallback(async (id) => {
        if (!estAdmin()) {
            const error = new Error('Vous n\'avez pas les permissions nécessaires pour supprimer des questions.');
            addToast({
                type: 'error',
                message: 'Accès refusé: Vous n\'avez pas les permissions nécessaires.'
            });
            throw error;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await faqService.deleteFaq(id);

            // Supprimer la FAQ de la liste
            setFaqs(prev => prev.filter(faq => faq.id !== id));

            addToast({
                type: 'success',
                message: 'Question supprimée avec succès.'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la suppression de la question:', error);
            setError('Impossible de supprimer la question. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de supprimer la question. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [estAdmin, addToast]);

    return {
        // États
        faqs,
        loading,
        error,

        // Fonctions
        loadFaqs,
        submitQuestion,
        answerQuestion,
        deleteQuestion
    };
}