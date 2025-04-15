import api from './api';

const faqService = {
    /**
     * Récupérer les FAQs publiques (avec réponses)
     * @returns {Promise<Array>} Liste des FAQs publiques
     */
    async getPublicFaqs() {
        try {
            const response = await api.get('/faq/publiques');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des FAQs publiques:', error);
            throw error;
        }
    },

    /**
     * Récupérer toutes les FAQs (y compris celles sans réponse)
     * Admin uniquement
     * @returns {Promise<Array>} Liste de toutes les FAQs
     */
    async getAllFaqs() {
        try {
            const response = await api.get('/faq');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les FAQs:', error);
            throw error;
        }
    },

    /**
     * Soumettre une nouvelle question
     * @param {Object} question - Données de la question
     * @returns {Promise<Object>} Question créée
     */
    async submitQuestion(question) {
        try {
            const response = await api.post('/faq', question);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la soumission de la question:', error);
            throw error;
        }
    },

    /**
     * Répondre à une question
     * Admin uniquement
     * @param {string|number} id - ID de la question
     * @param {string} reponse - Réponse à la question
     * @returns {Promise<Object>} FAQ mise à jour
     */
    async answerFaq(id, reponse) {
        try {
            const response = await api.put(`/faq/${id}`, { reponse });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la réponse à la question ${id}:`, error);
            throw error;
        }
    },

    /**
     * Supprimer une question
     * Admin uniquement
     * @param {string|number} id - ID de la question
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async deleteFaq(id) {
        try {
            const response = await api.delete(`/faq/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la question ${id}:`, error);
            throw error;
        }
    }
};

export default faqService;