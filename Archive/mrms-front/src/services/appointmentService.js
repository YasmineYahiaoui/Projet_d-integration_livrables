import api from './api';

const appointmentService = {
    /**
     * Récupérer la liste des rendez-vous avec pagination et filtres
     * @param {Object} params - Paramètres de filtrage et pagination
     * @returns {Promise<Object>} Résultats paginés
     */
    async getAppointments(params = {}) {
        try {
            const response = await api.get('/rendezvous', { params });

            // S'assurer que la réponse est correctement formatée pour correspondre à la structure API réelle
            const formattedResponse = {
                data: response.data.rendezvous || response.data.items || response.data || [],
                page: response.data.currentPage || response.data.page || 1,
                totalPages: response.data.totalPages || 1,
                totalItems: response.data.total || response.data.totalItems || 0,
                limit: response.data.limit || 10
            };

            return formattedResponse;
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
            throw error;
        }
    },

    /**
     * Récupérer un rendez-vous par son ID
     * @param {string|number} id - ID du rendez-vous
     * @returns {Promise<Object>} Détails du rendez-vous
     */
    async getAppointmentById(id) {
        try {
            const response = await api.get(`/rendezvous/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error);
            throw error;
        }
    },

    /**
     * Créer un nouveau rendez-vous
     * @param {Object} appointmentData - Données du rendez-vous
     * @returns {Promise<Object>} Rendez-vous créé
     */
    async createAppointment(appointmentData) {
        try {
            // Formater les données en fonction des attentes de l'API
            const apiData = {
                clientId: appointmentData.patientId,
                date: appointmentData.date,
                heure: appointmentData.heure,
                duree: parseInt(appointmentData.duree, 10),
                type: appointmentData.type,
                notes: appointmentData.notes,
                statut: appointmentData.statut || 'Planifié',
                notifications: appointmentData.notifications || []
            };

            const response = await api.post('/rendezvous', apiData);
            // Retourner le rendez-vous créé avec la structure correcte
            return response.data.rendezvous || response.data;
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour un rendez-vous
     * @param {string|number} id - ID du rendez-vous
     * @param {Object} appointmentData - Données à mettre à jour
     * @returns {Promise<Object>} Rendez-vous mis à jour
     */
    async updateAppointment(id, appointmentData) {
        try {
            // Formater les données en fonction des attentes de l'API
            const apiData = {};

            if (appointmentData.patientId) apiData.clientId = appointmentData.patientId;
            if (appointmentData.date) apiData.date = appointmentData.date;
            if (appointmentData.heure) apiData.heure = appointmentData.heure;
            if (appointmentData.duree) apiData.duree = parseInt(appointmentData.duree, 10);
            if (appointmentData.type) apiData.type = appointmentData.type;
            if (appointmentData.notes !== undefined) apiData.notes = appointmentData.notes;
            if (appointmentData.statut) apiData.statut = appointmentData.statut;
            if (appointmentData.notifications) apiData.notifications = appointmentData.notifications;

            const response = await api.put(`/rendezvous/${id}`, apiData);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du rendez-vous ${id}:`, error);
            throw error;
        }
    },

    /**
     * Supprimer un rendez-vous
     * @param {string|number} id - ID du rendez-vous
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async deleteAppointment(id) {
        try {
            const response = await api.delete(`/rendezvous/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error);
            throw error;
        }
    },

    /**
     * Récupérer tous les statuts de rendez-vous
     * @returns {Promise<Array>} Liste des statuts
     */
    async getAppointmentStatuses() {
        try {
            const response = await api.get('/rendezvous/statuts');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statuts de rendez-vous:', error);
            throw error;
        }
    },

    /**
     * Récupérer tous les types de notification
     * @returns {Promise<Array>} Liste des types de notification
     */
    async getNotificationTypes() {
        try {
            const response = await api.get('/rendezvous/types-notification');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des types de notification:', error);
            throw error;
        }
    },

    /**
     * Vérifier la disponibilité d'un créneau
     * @param {Object} params - Paramètres (date, heure, durée)
     * @returns {Promise<Object>} Résultat de la vérification
     */
    async checkAvailability(params) {
        try {
            const response = await api.get('/rendezvous/disponibilite', { params });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification de disponibilité:', error);
            throw error;
        }
    },

    /**
     * Récupérer les créneaux disponibles pour une date
     * @param {string} date - Date au format YYYY-MM-DD
     * @returns {Promise<Array>} Liste des créneaux disponibles
     */
    async getAvailableTimeSlots(date) {
        try {
            const response = await api.get('/rendezvous/creneaux-disponibles', {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des créneaux disponibles:', error);
            throw error;
        }
    }
};

export default appointmentService;