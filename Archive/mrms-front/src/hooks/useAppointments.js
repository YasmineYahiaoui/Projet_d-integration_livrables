import { useState, useCallback } from 'react';
import appointmentService from '@/services/appointmentService';
import { useUI } from '@/contexts/UIContext';

/**
 * Hook personnalisé pour la gestion des rendez-vous
 * @returns {Object} Fonctions et états pour la gestion des rendez-vous
 */
const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10
    });

    const { addToast } = useUI();

    /**
     * Charger la liste des rendez-vous avec pagination et filtres
     * @param {number} page - Numéro de page
     * @param {Object} filters - Filtres à appliquer
     * @returns {Promise<Array>} Liste des rendez-vous
     */
    const getAppointments = useCallback(async (page = 1, filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit: pagination.limit,
                ...filters
            };

            const response = await appointmentService.getAppointments(params);

            setAppointments(response.data || []);
            setPagination({
                page: response.page || 1,
                totalPages: response.totalPages || 1,
                totalItems: response.totalItems || 0,
                limit: response.limit || 10
            });

            return response.data;
        } catch (error) {
            console.error('Erreur lors du chargement des rendez-vous:', error);
            setError(error.userMessage || 'Impossible de charger les rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de charger les rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [pagination.limit, addToast]);

    /**
     * Charger un rendez-vous par son ID
     * @param {string|number} id - ID du rendez-vous
     * @returns {Promise<Object>} Détails du rendez-vous
     */
    const getAppointmentById = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await appointmentService.getAppointmentById(id);
            setAppointment(response);

            return response;
        } catch (error) {
            console.error(`Erreur lors du chargement du rendez-vous ${id}:`, error);
            setError(error.userMessage || 'Impossible de charger les détails du rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de charger les détails du rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Créer un nouveau rendez-vous
     * @param {Object} appointmentData - Données du rendez-vous
     * @returns {Promise<Object>} Rendez-vous créé
     */
    const createAppointment = useCallback(async (appointmentData) => {
        try {
            setLoading(true);
            setError(null);

            // Vérifier la disponibilité du créneau
            const disponibilite = await appointmentService.checkAvailability({
                date: appointmentData.date,
                heure: appointmentData.heure,
                duree: appointmentData.duree
            });

            if (!disponibilite.disponible) {
                throw new Error('Ce créneau n\'est pas disponible. Veuillez sélectionner un autre créneau.');
            }

            const response = await appointmentService.createAppointment(appointmentData);

            // Extraire le rendez-vous créé, qu'il soit à la racine ou sous la propriété rendezvous
            const createdAppointment = response.rendezvous || response;

            // Mettre à jour le state local
            setAppointments(prev => [createdAppointment, ...prev]);

            addToast({
                type: 'success',
                message: 'Rendez-vous créé avec succès.'
            });

            return createdAppointment;
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            setError(error.userMessage || 'Impossible de créer le rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de créer le rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Mettre à jour un rendez-vous
     * @param {string|number} id - ID du rendez-vous
     * @param {Object} appointmentData - Données à mettre à jour
     * @returns {Promise<Object>} Rendez-vous mis à jour
     */
    const updateAppointment = useCallback(async (id, appointmentData) => {
        try {
            setLoading(true);
            setError(null);

            // Vérifier la disponibilité du créneau si la date ou l'heure a changé
            if (appointmentData.date && appointmentData.heure) {
                const disponibilite = await appointmentService.checkAvailability({
                    date: appointmentData.date,
                    heure: appointmentData.heure,
                    duree: appointmentData.duree,
                    appointmentId: id // Exclure le rendez-vous actuel
                });

                if (!disponibilite.disponible) {
                    throw new Error('Ce créneau n\'est pas disponible. Veuillez sélectionner un autre créneau.');
                }
            }

            const response = await appointmentService.updateAppointment(id, appointmentData);

            // Extraire le rendez-vous mis à jour
            const updatedAppointment = response.rendezvous || response;

            // Mise à jour optimiste des états locaux
            // Si le rendez-vous chargé est celui mis à jour, on le met à jour en local
            if (appointment && appointment.id === id) {
                setAppointment(updatedAppointment);
            }

            // Mettre à jour la liste des rendez-vous si elle contient celui modifié
            setAppointments(prev =>
                prev.map(item => item.id === id ? updatedAppointment : item)
            );

            addToast({
                type: 'success',
                message: 'Rendez-vous mis à jour avec succès.'
            });

            return updatedAppointment;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du rendez-vous ${id}:`, error);
            setError(error.userMessage || 'Impossible de mettre à jour le rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de mettre à jour le rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointment, addToast]);

    /**
     * Supprimer un rendez-vous
     * @param {string|number} id - ID du rendez-vous
     * @returns {Promise<Object>} Résultat de la suppression
     */
    const deleteAppointment = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await appointmentService.deleteAppointment(id);

            // Mettre à jour la liste des rendez-vous en local
            setAppointments(prev => prev.filter(a => a.id !== id));

            // Si le rendez-vous chargé est celui supprimé, on le réinitialise
            if (appointment && appointment.id === id) {
                setAppointment(null);
            }

            addToast({
                type: 'success',
                message: 'Rendez-vous supprimé avec succès.'
            });

            return response;
        } catch (error) {
            console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error);
            setError(error.userMessage || 'Impossible de supprimer le rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de supprimer le rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointment, addToast]);

    /**
     * Changer le statut d'un rendez-vous
     * @param {string|number} id - ID du rendez-vous
     * @param {string} status - Nouveau statut
     * @returns {Promise<Object>} Rendez-vous mis à jour
     */
    const changeAppointmentStatus = useCallback(async (id, status) => {
        try {
            setLoading(true);
            setError(null);

            const response = await appointmentService.updateAppointment(id, { statut: status });

            // Extraire le rendez-vous mis à jour
            const updatedAppointment = response.rendezvous || response;

            // Mise à jour optimiste des états locaux
            if (appointment && appointment.id === id) {
                setAppointment(updatedAppointment);
            }

            // Mettre à jour la liste des rendez-vous
            setAppointments(prev =>
                prev.map(item => item.id === id ? updatedAppointment : item)
            );

            addToast({
                type: 'success',
                message: `Statut du rendez-vous changé en "${status}".`
            });

            return updatedAppointment;
        } catch (error) {
            console.error(`Erreur lors du changement de statut du rendez-vous ${id}:`, error);
            setError(error.userMessage || 'Impossible de changer le statut du rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: error.userMessage || 'Impossible de changer le statut du rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointment, addToast]);

    return {
        // États
        appointments,
        appointment,
        loading,
        error,
        pagination,

        // Fonctions
        getAppointments,
        getAppointmentById,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentStatuses: appointmentService.getAppointmentStatuses,
        getNotificationTypes: appointmentService.getNotificationTypes,
        getAvailableTimeSlots: appointmentService.getAvailableTimeSlots,
        changeAppointmentStatus
    };
};

export { useAppointments };
export default useAppointments;