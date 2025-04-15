/**
 * Utilitaires pour la gestion de l'authentification
 */

/**
 * Sauvegarder le token JWT dans le localStorage
 * @param {string} token - Token JWT
 */
export const saveToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mrms_token', token);
    }
};

/**
 * Récupérer le token JWT du localStorage
 * @returns {string|null} Token JWT ou null
 */
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('mrms_token');
    }
    return null;
};

/**
 * Supprimer le token JWT du localStorage
 */
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mrms_token');
    }
};

/**
 * Vérifier si un token JWT est présent
 * @returns {boolean} True si un token est présent
 */
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

/**
 * Analyser un token JWT pour obtenir les informations
 * @param {string} token - Token JWT
 * @returns {Object|null} Informations du token ou null si invalide
 */
export const parseToken = (token) => {
    if (!token) return null;
    if (typeof window === 'undefined') return null;

    try {
        // Diviser le token JWT en parties
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Décoder la partie payload
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (error) {
        console.error('Erreur lors de l\'analyse du token:', error);
        return null;
    }
};

/**
 * Vérifier si un token est expiré
 * @param {string} token - Token JWT
 * @returns {boolean} True si le token est expiré
 */
export const isTokenExpired = (token) => {
    const payload = parseToken(token);
    if (!payload || !payload.exp) return true;

    // Convertir la date d'expiration en millisecondes
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
};

/**
 * Obtenir les informations de l'utilisateur à partir du token
 * @returns {Object|null} Informations de l'utilisateur ou null
 */
export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    const payload = parseToken(token);
    if (!payload) return null;

    return {
        id: payload.sub || payload.id,
        nom: payload.nom,
        email: payload.email,
        role: payload.role
    };
};