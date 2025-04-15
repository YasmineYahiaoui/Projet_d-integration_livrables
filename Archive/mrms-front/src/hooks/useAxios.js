import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

/**
 * Hook personnalisé pour effectuer des requêtes HTTP avec Axios
 * @param {Object} options - Options de la requête
 * @param {string} options.url - URL de la requête
 * @param {string} options.method - Méthode HTTP (GET, POST, PUT, DELETE)
 * @param {Object} options.data - Données à envoyer (pour POST, PUT)
 * @param {Object} options.params - Paramètres de l'URL (pour GET)
 * @param {boolean} options.loadOnMount - Effectuer la requête au montage du composant
 * @param {Object} options.headers - En-têtes HTTP personnalisés
 * @returns {Object} État et fonctions pour gérer la requête
 */
export default function useAxios({
                                     url,
                                     method = 'GET',
                                     data = null,
                                     params = null,
                                     loadOnMount = false,
                                     headers = {}
                                 }) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * Effectuer la requête
     * @param {Object} newParams - Nouveaux paramètres pour la requête
     * @param {Object} newData - Nouvelles données pour la requête
     * @param {string} newUrl - Nouvelle URL pour la requête
     * @returns {Promise<Object>} Réponse de la requête
     */
    const fetchData = useCallback(async (newParams = null, newData = null, newUrl = null) => {
        try {
            setLoading(true);
            setError(null);

            const requestOptions = {
                method,
                url: newUrl || url,
                headers,
                params: newParams || params,
                data: newData || data
            };

            const result = await api(requestOptions);
            setResponse(result.data);
            return result.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url, method, data, params, headers]);

    // Effectuer la requête au montage du composant si loadOnMount est true
    useEffect(() => {
        if (loadOnMount) {
            fetchData();
        }
    }, [loadOnMount, fetchData]);

    /**
     * Réinitialiser l'état de la requête
     */
    const reset = () => {
        setResponse(null);
        setError(null);
        setLoading(false);
    };

    return {
        response,
        error,
        loading,
        fetchData,
        reset
    };
}