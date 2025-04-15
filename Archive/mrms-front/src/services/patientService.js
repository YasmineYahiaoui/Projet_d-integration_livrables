// services/patientService.js
import api from './api';

const patientService = {
    /**
     * Inscrire un nouveau patient
     * @param {Object} patientData - Données du patient
     * @returns {Promise} - Promesse avec les données de l'utilisateur créé
     */
    inscription: async (patientData) => {
        try {
            const response = await api.post('/auth/inscription-patient', patientData);
            return response.data;
        } catch (error) {
            // Transformer l'erreur pour qu'elle soit plus facilement utilisable
            if (error.response) {
                // Le serveur a répondu avec un code d'erreur
                const errorMsg = error.response.data.message || 'Erreur lors de l\'inscription';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    },

    /**
     * Récupérer tous les patients
     * @param {Object} options - Options de pagination et recherche
     * @returns {Promise} - Promesse avec les patients récupérés
     */
    getPatients: async (options = {}) => {
        const { page = 1, limite = 10, recherche = '', typePatientId = '' } = options;
        try {
            const response = await api.get('/clients', {
                params: { page, limite, recherche, typePatientId }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.message || 'Erreur lors de la récupération des patients';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    },

    /**
     * Récupérer un patient par son ID
     * @param {number} id - ID du patient
     * @returns {Promise} - Promesse avec les données du patient
     */
    getPatientById: async (id) => {
        try {
            const response = await api.get(`/clients/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.message || 'Erreur lors de la récupération du patient';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    },

    /**
     * Récupérer le profil du patient connecté
     * @returns {Promise} - Promesse avec les données du profil du patient
     */
    getMyProfile: async () => {
        try {
            const response = await api.get('/auth/moi');
            console.log('Profile response:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.message || 'Erreur lors de la récupération du profil';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    },

    /**
     * Mettre à jour le profil du patient connecté
     * @param {Object} profileData - Données du profil à mettre à jour
     * @returns {Promise} - Promesse avec les données du profil mis à jour
     */
    updateMyProfile: async (profileData) => {
        try {
            // Structurer les données pour correspondre à l'attente de l'API
            // Basé sur la structure retournée par /auth/moi
            const payload = {
                // Si dateNaissance est au niveau racine
                dateNaissance: profileData.dateNaissance,

                // Mettre à jour les informations du client
                client: {
                    nom: profileData.nom,
                    prenom: profileData.prenom,
                    email: profileData.email,
                    telephone: profileData.telephone
                }
            };

            const response = await api.put('/patients/profil', payload);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                const errorMsg = error.response.data.message || 'Erreur lors de la mise à jour du profil';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    }
};

export default patientService;