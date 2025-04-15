// services/authService.js
import api from './api';

const AUTH_TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
    /**
     * Connecter un utilisateur
     * @param {string} nomUtilisateur - Nom d'utilisateur ou email
     * @param {string} motDePasse - Mot de passe
     * @returns {Promise} - Promesse avec les données de l'utilisateur
     */
    connexion: async (nomUtilisateur, motDePasse) => {
        try {
            const response = await api.post('/auth/connexion', {
                nomUtilisateur,
                motDePasse
            });

            const { token, ...utilisateur } = response.data;

            // Stocker le token et les données utilisateur
            if (typeof window !== 'undefined') {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                localStorage.setItem(USER_KEY, JSON.stringify(utilisateur));
            }

            return {
                utilisateur,
                token
            };
        } catch (error) {
            // Transformer l'erreur pour qu'elle soit plus facilement utilisable
            if (error.response) {
                // Le serveur a répondu avec un code d'erreur
                const errorMsg = error.response.data.message || 'Erreur lors de la connexion';
                throw { ...error, userMessage: errorMsg };
            }
            throw { ...error, userMessage: 'Problème de connexion au serveur' };
        }
    },

    /**
     * Déconnecter l'utilisateur
     */
    deconnexion: async () => {
        try {
            // Appel au backend (optionnel, selon l'implémentation)
            await api.post('/auth/deconnexion');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Supprimer le token et les données utilisateur
            if (typeof window !== 'undefined') {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }
    },

    /**
     * Vérifier si le token est valide
     * @returns {Promise<boolean>} - Promesse avec l'état de validité du token
     */
    verifierToken: async () => {
        // Si pas de token, pas besoin de vérifier
        const token = authService.getToken();
        if (!token) return false;

        try {
            // Tenter une requête qui nécessite l'authentification
            await api.get('/auth/moi');
            return true;
        } catch (error) {
            // Si erreur 401, le token n'est pas valide
            if (error.response && error.response.status === 401) {
                authService.clearAuth();
                return false;
            }

            // Pour les autres erreurs (comme problèmes réseau), considérer que le token est valide
            // car nous ne pouvons pas confirmer qu'il est invalide
            return true;
        }
    },

    /**
     * Obtenir l'utilisateur courant depuis l'API
     * @returns {Promise} - Promesse avec les données de l'utilisateur
     */
    getUtilisateurCourant: async () => {
        try {
            const response = await api.get('/auth/moi');

            // Mettre à jour les données utilisateur stockées
            if (typeof window !== 'undefined') {
                localStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }

            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                authService.clearAuth();
            }
            throw error;
        }
    },

    /**
     * Obtenir le token d'authentification
     * @returns {string|null} - Token d'authentification ou null
     */
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(AUTH_TOKEN_KEY);
        }
        return null;
    },

    /**
     * Obtenir l'utilisateur stocké localement
     * @returns {Object|null} - Données de l'utilisateur ou null
     */
    getUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(USER_KEY);
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },

    /**
     * Effacer toutes les données d'authentification
     */
    clearAuth: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }
};

export default authService;