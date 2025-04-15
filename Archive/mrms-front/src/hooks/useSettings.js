import { useState, useCallback } from 'react';
import settingsService from '@/services/settingsService';
import { useUI } from '@/contexts/UIContext';

/**
 * Hook personnalisé pour la gestion des paramètres
 * @returns {Object} Fonctions et états pour la gestion des paramètres
 */
export default function useSettings() {
    const [settings, setSettings] = useState(null);
    const [appointmentSettings, setAppointmentSettings] = useState(null);
    const [notificationSettings, setNotificationSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { addToast } = useUI();

    /**
     * Récupérer les paramètres généraux
     * @returns {Promise<Object>} Paramètres généraux
     */
    const getSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.getSettings();
            setSettings(response);

            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            setError('Impossible de charger les paramètres. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de charger les paramètres. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Mettre à jour les paramètres généraux
     * @param {Object} updatedSettings - Paramètres mis à jour
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    const updateSettings = useCallback(async (updatedSettings) => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.updateSettings(updatedSettings);
            setSettings(response);

            addToast({
                type: 'success',
                message: 'Paramètres mis à jour avec succès.'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres:', error);
            setError('Impossible de mettre à jour les paramètres. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de mettre à jour les paramètres. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Récupérer les paramètres des rendez-vous
     * @returns {Promise<Object>} Paramètres des rendez-vous
     */
    const getAppointmentSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.getAppointmentSettings();
            setAppointmentSettings(response);

            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres de rendez-vous:', error);
            setError('Impossible de charger les paramètres de rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de charger les paramètres de rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Mettre à jour les paramètres des rendez-vous
     * @param {Object} updatedSettings - Paramètres mis à jour
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    const updateAppointmentSettings = useCallback(async (updatedSettings) => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.updateAppointmentSettings(updatedSettings);
            setAppointmentSettings(response);

            addToast({
                type: 'success',
                message: 'Paramètres de rendez-vous mis à jour avec succès.'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres de rendez-vous:', error);
            setError('Impossible de mettre à jour les paramètres de rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de mettre à jour les paramètres de rendez-vous. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Récupérer les paramètres des notifications
     * @returns {Promise<Object>} Paramètres des notifications
     */
    const getNotificationSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.getNotificationSettings();
            setNotificationSettings(response);

            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres de notification:', error);
            setError('Impossible de charger les paramètres de notification. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de charger les paramètres de notification. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    /**
     * Mettre à jour les paramètres des notifications
     * @param {Object} updatedSettings - Paramètres mis à jour
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    const updateNotificationSettings = useCallback(async (updatedSettings) => {
        try {
            setLoading(true);
            setError(null);

            const response = await settingsService.updateNotificationSettings(updatedSettings);
            setNotificationSettings(response);

            addToast({
                type: 'success',
                message: 'Paramètres de notification mis à jour avec succès.'
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
            setError('Impossible de mettre à jour les paramètres de notification. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Impossible de mettre à jour les paramètres de notification. Veuillez réessayer.'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    return {
        // États
        settings,
        appointmentSettings,
        notificationSettings,
        loading,
        error,

        // Fonctions
        getSettings,
        updateSettings,
        getAppointmentSettings,
        updateAppointmentSettings,
        getNotificationSettings,
        updateNotificationSettings
    };
}