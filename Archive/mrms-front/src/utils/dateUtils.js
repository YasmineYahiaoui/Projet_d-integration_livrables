import { format, parse, isValid, addMinutes, subMinutes, differenceInMinutes, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Utilitaires pour la manipulation des dates
 */

/**
 * Formater une date selon un format spécifique
 * @param {Date|string} date - Date à formater
 * @param {string} formatStr - Format de sortie (ex: 'yyyy-MM-dd')
 * @param {boolean} useFrench - Utiliser la locale française
 * @returns {string} Date formatée
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy', useFrench = true) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return '';

        return format(dateObj, formatStr, useFrench ? { locale: fr } : undefined);
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return '';
    }
};

/**
 * Formater une date et heure selon un format spécifique
 * @param {Date|string} date - Date à formater
 * @param {string} formatStr - Format de sortie (ex: 'dd/MM/yyyy HH:mm')
 * @param {boolean} useFrench - Utiliser la locale française
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date, formatStr = 'dd/MM/yyyy HH:mm', useFrench = true) => {
    return formatDate(date, formatStr, useFrench);
};

/**
 * Formater une date en format "il y a X temps" (ex: "il y a 2 jours")
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée en format relatif
 */
export const formatRelativeDate = (date) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return '';

        const now = new Date();
        const diffInSeconds = Math.floor((now - dateObj) / 1000);

        if (diffInSeconds < 60) {
            return 'à l\'instant';
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `il y a ${diffInMonths} mois`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
    } catch (error) {
        console.error('Erreur lors du formatage de la date relative:', error);
        return '';
    }
};

/**
 * Convertir une date au format ISO
 * @param {Date|string} date - Date à convertir
 * @returns {string} Date au format ISO
 */
export const toISODate = (date) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return '';

        return dateObj.toISOString();
    } catch (error) {
        console.error('Erreur lors de la conversion en ISO:', error);
        return '';
    }
};

/**
 * Vérifier si une date est dans le passé
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean} True si la date est dans le passé
 */
export const isPastDate = (date) => {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return false;

        return dateObj < new Date();
    } catch (error) {
        console.error('Erreur lors de la vérification de la date passée:', error);
        return false;
    }
};

/**
 * Vérifier si une date est aujourd'hui
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean} True si la date est aujourd'hui
 */
export const isToday = (date) => {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return false;

        const today = new Date();

        return (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
        );
    } catch (error) {
        console.error('Erreur lors de la vérification si la date est aujourd\'hui:', error);
        return false;
    }
};

/**
 * Obtenir le nom du jour de la semaine pour une date
 * @param {Date|string} date - Date à utiliser
 * @param {boolean} fullName - Utiliser le nom complet ou abrégé
 * @returns {string} Nom du jour de la semaine
 */
export const getDayName = (date, fullName = false) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return '';

        const format = fullName ? 'EEEE' : 'EEE';
        return formatDate(dateObj, format, true);
    } catch (error) {
        console.error('Erreur lors de l\'obtention du nom du jour:', error);
        return '';
    }
};

/**
 * Obtenir l'objet Date à partir d'une date et heure
 * @param {string} dateStr - Date au format 'YYYY-MM-DD'
 * @param {string} timeStr - Heure au format 'HH:mm'
 * @returns {Date|null} Objet Date ou null en cas d'erreur
 */
export const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    try {
        const combinedStr = `${dateStr}T${timeStr}`;
        const dateObj = new Date(combinedStr);

        if (!isValid(dateObj)) return null;

        return dateObj;
    } catch (error) {
        console.error('Erreur lors de la combinaison date/heure:', error);
        return null;
    }
};

/**
 * Calculer la fin d'un rendez-vous
 * @param {Date|string} startDateTime - Date et heure de début
 * @param {number} durationInMinutes - Durée en minutes
 * @returns {Date|null} Date et heure de fin ou null en cas d'erreur
 */
export const calculateEndTime = (startDateTime, durationInMinutes) => {
    if (!startDateTime || typeof durationInMinutes !== 'number') return null;

    try {
        const dateObj = typeof startDateTime === 'string' ? new Date(startDateTime) : startDateTime;

        if (!isValid(dateObj)) return null;

        return addMinutes(dateObj, durationInMinutes);
    } catch (error) {
        console.error('Erreur lors du calcul de l\'heure de fin:', error);
        return null;
    }
};

/**
 * Générer une liste de créneaux horaires
 * @param {string} startTime - Heure de début (ex: '08:00')
 * @param {string} endTime - Heure de fin (ex: '18:00')
 * @param {number} intervalInMinutes - Intervalle en minutes (ex: 15)
 * @returns {string[]} Liste des créneaux horaires
 */
export const generateTimeSlots = (startTime = '08:00', endTime = '18:00', intervalInMinutes = 15) => {
    try {
        // Convertir les heures en objets Date
        const baseDate = new Date();
        const start = parse(startTime, 'HH:mm', baseDate);
        const end = parse(endTime, 'HH:mm', baseDate);

        if (!isValid(start) || !isValid(end)) return [];

        // Calculer le nombre de créneaux
        const totalMinutes = differenceInMinutes(end, start);
        const numSlots = Math.floor(totalMinutes / intervalInMinutes) + 1;

        // Générer les créneaux
        const slots = [];
        let currentTime = start;

        for (let i = 0; i < numSlots; i++) {
            slots.push(format(currentTime, 'HH:mm'));
            currentTime = addMinutes(currentTime, intervalInMinutes);
        }

        return slots;
    } catch (error) {
        console.error('Erreur lors de la génération des créneaux horaires:', error);
        return [];
    }
};

/**
 * Vérifier si un jour est un jour ouvré
 * @param {Date|string} date - Date à vérifier
 * @param {number[]} workingDays - Jours ouvrés (0 = dimanche, 1 = lundi, etc.)
 * @returns {boolean} True si le jour est ouvré
 */
export const isWorkingDay = (date, workingDays = [1, 2, 3, 4, 5]) => {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!isValid(dateObj)) return false;

        const dayOfWeek = getDay(dateObj);
        return workingDays.includes(dayOfWeek);
    } catch (error) {
        console.error('Erreur lors de la vérification du jour ouvré:', error);
        return false;
    }
};