// /services/doctorService.js
import api from './api';

const doctorService = {
    // Récupérer les patients du médecin
    async getMyPatients(params = {}) {
        try {
            const response = await api.get('/api/medecin/patients', { params });
            return {
                data: response.data.patients || [],
                total: response.data.total || 0,
                page: response.data.page || 1,
                totalPages: response.data.totalPages || 1
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des patients:', error);
            throw error;
        }
    },

    // Récupérer les rendez-vous du médecin
    async getMyAppointments(params = {}) {
        try {
            const response = await api.get('/api/medecin/rendez-vous', { params });
            return {
                data: response.data.rendezVous || [],
                total: response.data.total || 0,
                page: response.data.page || 1,
                totalPages: response.data.totalPages || 1
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
            throw error;
        }
    },

    // Récupérer les disponibilités du médecin
    async getMyAvailability() {
        try {
            const response = await api.get('/api/medecin/disponibilites');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des disponibilités:', error);
            throw error;
        }
    },

    // Définir une disponibilité
    async setAvailability(availabilityData) {
        try {
            const response = await api.post('/api/medecin/disponibilites', availabilityData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la définition des disponibilités:', error);
            throw error;
        }
    },

    // Supprimer une disponibilité
    async deleteAvailability(id) {
        try {
            const response = await api.delete(`/api/medecin/disponibilites/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de la disponibilité:', error);
            throw error;
        }
    },

    // Ajouter une note médicale
    async addMedicalNote(noteData) {
        try {
            const response = await api.post('/api/medecin/notes-medicales', noteData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la note médicale:', error);
            throw error;
        }
    },

    // Récupérer les notes médicales d'un patient
    async getPatientMedicalNotes(patientId) {
        try {
            const response = await api.get(`/api/medecin/patients/${patientId}/notes-medicales`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des notes médicales:', error);
            throw error;
        }
    },

    // Récupérer le dossier médical d'un patient
    async getPatientMedicalRecord(patientId) {
        try {
            const response = await api.get(`/api/medecin/patients/${patientId}/dossier-medical`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du dossier médical:', error);
            throw error;
        }
    }
};

export default doctorService;