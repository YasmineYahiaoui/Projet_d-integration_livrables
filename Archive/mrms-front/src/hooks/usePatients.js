import { useState, useCallback } from 'react';
import patientService from '@/services/patientService';
import { useUI } from '@/contexts/UIContext';

export default function usePatients() {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        page: 1,
        limit: 10
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { addToast } = useUI();

    const getPatients = useCallback(async (page = 1, filters = {}) => {
        try {
            setLoading(true);
            setError('');

            const response = await patientService.getPatients(page, filters);

            // Check if the response has the nested structure
            if (response.data && response.data.patients) {
                // Handle the nested structure
                setPatients(response.data.patients);

                // Extract pagination info from the top level
                setPagination({
                    totalItems: response.totalItems || 0,
                    totalPages: response.totalPages || 0,
                    page: response.page || 1,
                    limit: response.limit || 10
                });
            } else if (Array.isArray(response.data)) {
                // Handle the old structure where data is directly an array
                setPatients(response.data);

                setPagination({
                    totalItems: response.totalItems || 0,
                    totalPages: response.totalPages || 0,
                    page: response.page || 1,
                    limit: response.limit || 10
                });
            } else {
                // Fallback to handle unexpected structures
                console.error('Unexpected API response structure:', response);
                setPatients([]);
                setError('Format de réponse inattendu. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('Impossible de charger les patients. Veuillez réessayer.');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePatient = useCallback(async (patientId) => {
        try {
            setLoading(true);
            await patientService.deletePatient(patientId);

            addToast({
                type: 'success',
                message: 'Patient supprimé avec succès'
            });

            return true;
        } catch (error) {
            console.error('Error deleting patient:', error);

            addToast({
                type: 'error',
                message: 'Erreur lors de la suppression du patient'
            });

            return false;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    return {
        patients,
        pagination,
        loading,
        error,
        getPatients,
        deletePatient
    };
}