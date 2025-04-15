import api from './api';

const dashboardService = {
    /**
     * Récupérer les statistiques du tableau de bord
     * @returns {Promise<Object>} Statistiques
     */
    async getStatistiques() {
        try {
            const response = await api.get('/tableauBord/statistiques');

            // Ensure all required stats are present with fallbacks
            return {
                totalPatients: response.data.totalPatients || 0,
                totalAppointments: response.data.totalAppointments || 0,
                appointmentsToday: response.data.appointmentsToday || 0,
                completedAppointments: response.data.completedAppointments || 0,
                ...response.data
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    /**
     * Récupérer les rendez-vous récents
     * @param {number} limite - Nombre de rendez-vous à récupérer
     * @returns {Promise<Array>} Liste des rendez-vous récents
     */
    async getRendezVousRecents(limite = 5) {
        try {
            const response = await api.get('/tableauBord/rendezvous-recents', {
                params: { limite }
            });

            // Format appointments to ensure they have all required fields
            return (response.data || []).map(rdv => ({
                id: rdv.id,
                dateHeure: rdv.dateHeure || rdv.date,
                patient: rdv.patient || { nom: 'Non spécifié', prenom: '' },
                statut: rdv.statut || 'Planifié',
                type: rdv.type || 'Consultation',
                ...rdv
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous récents:', error);
            throw error;
        }
    },

    /**
     * Récupérer les patients récents
     * @param {number} limite - Nombre de patients à récupérer
     * @returns {Promise<Array>} Liste des patients récents
     */
    async getPatientsRecents(limite = 5) {
        try {
            const response = await api.get('/tableauBord/patients-recents', {
                params: { limite }
            });

            // Format patients to ensure they have all required fields
            return (response.data || []).map(patient => ({
                id: patient.id,
                nom: patient.nom || 'Non spécifié',
                prenom: patient.prenom || '',
                email: patient.email || '',
                telephone: patient.telephone || '',
                ...patient
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des patients récents:', error);
            throw error;
        }
    }
};

export default dashboardService;