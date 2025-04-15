// services/api.js
import axios from 'axios';

// Créer une instance d'axios avec une configuration de base
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
    (config) => {
        // Récupérer le token du stockage local (côté client uniquement)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gérer les erreurs 401 (non autorisé) - token expiré ou invalide
        if (error.response && error.response.status === 401) {
            // Si on n'est pas déjà sur la page de connexion
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/connexion')) {
                // Supprimer le token et rediriger vers la page de connexion
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/patient/connexion';
            }
        }
        return Promise.reject(error);
    }
);

export default api;