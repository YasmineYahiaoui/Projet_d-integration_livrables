'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';
import { useUI } from '@/contexts/UIContext';
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function DoctorAvailabilityCalendar() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newAvailability, setNewAvailability] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        heureDebut: '09:00',
        heureFin: '17:00',
        recurrence: 'aucune'
    });

    const { addToast } = useUI();

    // Calculate the days of the week
    const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i)
    );

    // Fetch availabilities for the current week
    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                setLoading(true);

                const startDate = format(daysOfWeek[0], 'yyyy-MM-dd');
                const endDate = format(daysOfWeek[6], 'yyyy-MM-dd');

                const response = await api.get('/api/medecin/disponibilites', {
                    params: { dateDebut: startDate, dateFin: endDate }
                });

                setAvailabilities(response.data || []);
            } catch (error) {
                console.error('Error fetching availabilities:', error);
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement des disponibilités'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAvailabilities();
    }, [currentWeek, addToast]);

    // Group availabilities by date
    const getAvailabilitiesForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return availabilities.filter(a => a.date === dateStr);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAvailability(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save new availability
    const handleSaveAvailability = async (e) => {
        e.preventDefault();

        if (newAvailability.heureDebut >= newAvailability.heureFin) {
            addToast({
                type: 'error',
                message: 'L\'heure de début doit être antérieure à l\'heure de fin'
            });
            return;
        }

        try {
            const response = await api.post('/api/medecin/disponibilites', newAvailability);

            // Update the list
            setAvailabilities(prev => [...prev, response.data.disponibilite]);

            // Close modal and reset form
            setModalOpen(false);
            setNewAvailability({
                date: format(new Date(), 'yyyy-MM-dd'),
                heureDebut: '09:00',
                heureFin: '17:00',
                recurrence: 'aucune'
            });

            addToast({
                type: 'success',
                message: 'Disponibilité ajoutée avec succès'
            });
        } catch (error) {
            console.error('Error saving availability:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors de l\'enregistrement de la disponibilité'
            });
        }
    };

    // Delete availability
    const handleDeleteAvailability = async (id) => {
        try {
            await api.delete(`/api/medecin/disponibilites/${id}`);

            // Update the list
            setAvailabilities(prev => prev.filter(a => a.id !== id));

            addToast({
                type: 'success',
                message: 'Disponibilité supprimée avec succès'
            });
        } catch (error) {
            console.error('Error deleting availability:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors de la suppression de la disponibilité'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des disponibilités</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Ajouter une disponibilité
                </button>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-medium">
                    {format(daysOfWeek[0], 'MMMM yyyy', { locale: fr })}
                </h2>

                <button
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {daysOfWeek.map(day => (
                    <div key={day.toString()} className="text-center p-2">
                        <p className="text-xs text-gray-500">{format(day, 'EEEE', { locale: fr })}</p>
                        <p className="text-lg font-medium">{format(day, 'd')}</p>
                    </div>
                ))}

                {/* Calendar cells */}
                {daysOfWeek.map(day => (
                    <div
                        key={`cell-${day.toString()}`}
                        className="min-h-[120px] border border-gray-200 rounded-md p-2"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {getAvailabilitiesForDate(day).map(availability => (
                                    <div
                                        key={availability.id}
                                        className="bg-[#5CB1B1]/10 p-2 rounded-md text-xs text-gray-800"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{availability.heureDebut} - {availability.heureFin}</span>
                                            <button
                                                onClick={() => handleDeleteAvailability(availability.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {availability.recurrence !== 'aucune' && (
                                            <p className="text-[#5CB1B1] mt-1 text-xs">
                                                Récurrence: {availability.recurrence}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add availability modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une disponibilité</h3>

                        <form onSubmit={handleSaveAvailability} className="space-y-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={newAvailability.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de début <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="heureDebut"
                                        name="heureDebut"
                                        value={newAvailability.heureDebut}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de fin <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="heureFin"
                                        name="heureFin"
                                        value={newAvailability.heureFin}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
                                    Récurrence
                                </label>
                                <select
                                    id="recurrence"
                                    name="recurrence"
                                    value={newAvailability.recurrence}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="aucune">Aucune (date unique)</option>
                                    <option value="hebdomadaire">Hebdomadaire</option>
                                    <option value="mensuelle">Mensuelle</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}