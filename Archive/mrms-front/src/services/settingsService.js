import api from './api';

const settingsService = {
    /**
     * Récupérer les paramètres généraux de l'application
     * @returns {Promise<Object>} Paramètres généraux
     */
    async getSettings() {
        try {
            const response = await api.get('/api/parametres');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour les paramètres généraux de l'application
     * @param {Object} settings - Nouveaux paramètres
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    async updateSettings(settings) {
        try {
            const response = await api.put('/api/parametres', settings);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres:', error);
            throw error;
        }
    },

    /**
     * Récupérer les paramètres des rendez-vous
     * @returns {Promise<Object>} Paramètres des rendez-vous
     */
    async getAppointmentSettings() {
        try {
            const response = await api.get('/parametres/rendezvous');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres de rendez-vous:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour les paramètres des rendez-vous
     * @param {Object} settings - Nouveaux paramètres
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    async updateAppointmentSettings(settings) {
        try {
            const response = await api.put('/parametres/rendezvous', settings);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres de rendez-vous:', error);
            throw error;
        }
    },

    /**
     * Récupérer les paramètres des notifications
     * @returns {Promise<Object>} Paramètres des notifications
     */
    async getNotificationSettings() {
        try {
            const response = await api.get('/parametres/notifications');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres de notification:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour les paramètres des notifications
     * @param {Object} settings - Nouveaux paramètres
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    async updateNotificationSettings(settings) {
        try {
            const response = await api.put('/parametres/notifications', settings);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
            throw error;
        }
    }
};

export default settingsService;