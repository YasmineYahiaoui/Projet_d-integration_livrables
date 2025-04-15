// utils/response.js
/**
 * Utilitaire pour formater les réponses API de manière cohérente
 */

/**
 * Formate une réponse API avec pagination
 * @param {Object|Array} data - Les données à renvoyer
 * @param {Object} pagination - Informations de pagination (count, page, limite)
 * @returns {Object} - Réponse formatée
 */
exports.formatResponse = (data, pagination = null) => {
    const response = { data };

    if (pagination) {
        const { count, page, limite } = pagination;
        response.totalItems = count;
        response.totalPages = Math.ceil(count / parseInt(limite));
        response.page = parseInt(page || 1);
        response.limit = parseInt(limite || 10);
    }

    return response;
};

/**
 * Formate un message d'erreur pour l'API
 * @param {string} message - Message d'erreur
 * @param {number} statusCode - Code d'état HTTP
 * @param {Object|Array} errors - Erreurs détaillées (optionnel)
 * @returns {Object} - Réponse d'erreur formatée
 */
exports.errorResponse = (message, statusCode = 400, errors = null) => {
    const response = { message };

    if (errors) {
        response.errors = errors;
    }

    return response;
};