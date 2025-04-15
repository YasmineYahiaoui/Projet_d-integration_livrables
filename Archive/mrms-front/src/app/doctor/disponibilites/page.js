// /app/medecin/disponibilites/page.js
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import doctorService from '@/services/doctorService';
import AvailabilityCalendar from '@/components/doctor/AvailabilityCalendar';
import AvailabilityForm from '@/components/doctor/AvailabilityForm';
import { useUI } from '@/contexts/UIContext';

export default function DoctorAvailabilityPage() {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { addToast } = useUI();

    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                setLoading(true);
                const data = await doctorService.getMyAvailability();
                setAvailabilities(data);
            } catch (error) {
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement des disponibilités'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAvailabilities();
    }, [addToast]);

    const handleAddAvailability = async (availabilityData) => {
        try {
            const newAvailability = await doctorService.setAvailability(availabilityData);
            setAvailabilities([...availabilities, newAvailability]);
            setShowForm(false);
            addToast({
                type: 'success',
                message: 'Disponibilité ajoutée avec succès'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Erreur lors de l\'ajout de la disponibilité'
            });
        }
    };

    const handleDeleteAvailability = async (id) => {
        try {
            await doctorService.deleteAvailability(id);
            setAvailabilities(availabilities.filter(a => a.id !== id));
            addToast({
                type: 'success',
                message: 'Disponibilité supprimée avec succès'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Erreur lors de la suppression de la disponibilité'
            });
        }
    };

    return (
        <ProtectedRoute titre="Gestion des disponibilités">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Mes disponibilités</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                    >
                        {showForm ? 'Annuler' : 'Ajouter une disponibilité'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <AvailabilityForm onSubmit={handleAddAvailability} onCancel={() => setShowForm(false)} />
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : availabilities.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Aucune disponibilité définie.</p>
                        </div>
                    ) : (
                        <AvailabilityCalendar
                            availabilities={availabilities}
                            onDelete={handleDeleteAvailability}
                        />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}