'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/contexts/UIContext';

export default function BookAppointment() {
    const { utilisateur, estAuthentifie, chargement } = useAuth();
    const router = useRouter();
    const { addToast } = useUI || { addToast: () => {} };

    // Form data
    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        heure: '',
        duree: '30',
        typeNotificationId: '1',
        notes: ''
    });

    // Form states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validation, setValidation] = useState({});

    // Reference data
    const [typesNotification, setTypesNotification] = useState([]);
    const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
    const [loadingCreneaux, setLoadingCreneaux] = useState(false);

    // Redirect if not authenticated or not a patient
    useEffect(() => {
        if (!chargement && (!estAuthentifie || (utilisateur && utilisateur.role !== 'Patient'))) {
            router.push('/connexion');
            if (estAuthentifie && utilisateur && utilisateur.role !== 'Patient') {
                addToast({
                    type: 'error',
                    message: 'Accès réservé aux patients'
                });
            }
        }
    }, [chargement, estAuthentifie, utilisateur, router, addToast]);

    // Fetch reference data
    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                const [typesNotificationRes] = await Promise.all([
                    api.get('/rendezvous/types-notification')
                ]);

                setTypesNotification(typesNotificationRes.data);
            } catch (error) {
                console.error('Erreur lors du chargement des données de référence:', error);
                setError('Impossible de charger certaines données. Veuillez réessayer.');
            }
        };

        if (estAuthentifie && utilisateur && utilisateur.role === 'Patient') {
            fetchReferenceData();
        }
    }, [estAuthentifie, utilisateur]);

    // Fetch available time slots when date changes
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!formData.date) return;

            try {
                setLoadingCreneaux(true);
                const response = await api.get('/api/patient/creneaux-disponibles', {
                    params: { date: formData.date }
                });

                setCreneauxDisponibles(response.data.creneauxDisponibles || []);
            } catch (error) {
                console.error('Erreur lors du chargement des créneaux disponibles:', error);
                setCreneauxDisponibles([]);
            } finally {
                setLoadingCreneaux(false);
            }
        };

        if (estAuthentifie && utilisateur && utilisateur.role === 'Patient') {
            fetchAvailableSlots();
        }
    }, [formData.date, estAuthentifie, utilisateur]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error for this field
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear general error
        if (error) setError('');
    };

    // Select a time slot
    const handleSelectTimeSlot = (time) => {
        setFormData(prev => ({
            ...prev,
            heure: time
        }));

        // Clear validation error for this field
        if (validation.heure) {
            setValidation(prev => ({
                ...prev,
                heure: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.date) {
            errors.date = 'La date est requise';
        }

        if (!formData.heure) {
            errors.heure = 'L\'heure est requise';
        }

        setValidation(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Make API call to book appointment
            const response = await api.post('/api/patient/prendre-rendez-vous', formData);

            // Show success message
            addToast({
                type: 'success',
                message: 'Rendez-vous créé avec succès'
            });

            // Redirect to appointments page
            router.push('/patient/rendez-vous');
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Group time slots by period
    const getTimeSlotsByPeriod = () => {
        const morning = [];
        const afternoon = [];
        const evening = [];

        creneauxDisponibles.forEach(slot => {
            const hour = parseInt(slot.split(':')[0], 10);

            if (hour < 12) {
                morning.push(slot);
            } else if (hour < 17) {
                afternoon.push(slot);
            } else {
                evening.push(slot);
            }
        });

        return { morning, afternoon, evening };
    };

    // Return early if not authenticated or not a patient
    if (chargement || (!estAuthentifie || (utilisateur && utilisateur.role !== 'Patient'))) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    const { morning, afternoon, evening } = getTimeSlotsByPeriod();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Prendre un rendez-vous
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date selection */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                className={`w-full px-3 py-2 border ${
                                    validation.date ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                            />
                            {validation.date && (
                                <p className="mt-1 text-sm text-red-600">{validation.date}</p>
                            )}
                        </div>

                        {/* Duration selection */}
                        <div>
                            <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-1">
                                Durée
                            </label>
                            <select
                                id="duree"
                                name="duree"
                                value={formData.duree}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 heure</option>
                            </select>
                        </div>
                    </div>

                    {/* Time slot selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heure <span className="text-red-500">*</span>
                        </label>

                        {loadingCreneaux ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                            </div>
                        ) : creneauxDisponibles.length === 0 ? (
                            <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md">
                                Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Morning slots */}
                                {morning.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Matin</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                            {morning.map(time => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => handleSelectTimeSlot(time)}
                                                    className={`p-2 text-center rounded-md text-sm ${
                                                        formData.heure === time
                                                            ? 'bg-[#5CB1B1] text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Afternoon slots */}
                                {afternoon.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Après-midi</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                            {afternoon.map(time => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => handleSelectTimeSlot(time)}
                                                    className={`p-2 text-center rounded-md text-sm ${
                                                        formData.heure === time
                                                            ? 'bg-[#5CB1B1] text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Evening slots */}
                                {evening.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Soir</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                            {evening.map(time => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => handleSelectTimeSlot(time)}
                                                    className={`p-2 text-center rounded-md text-sm ${
                                                        formData.heure === time
                                                            ? 'bg-[#5CB1B1] text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {validation.heure && (
                            <p className="mt-1 text-sm text-red-600">{validation.heure}</p>
                        )}
                    </div>

                    {/* Notification type */}
                    <div>
                        <label htmlFor="typeNotificationId" className="block text-sm font-medium text-gray-700 mb-1">
                            Type de notification
                        </label>
                        <select
                            id="typeNotificationId"
                            name="typeNotificationId"
                            value={formData.typeNotificationId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                        >
                            {typesNotification.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (facultatif)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            placeholder="Informations supplémentaires à communiquer"
                        />
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.push('/patient/tableau-bord')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2 disabled:opacity-70"
                        >
                            {loading ? 'Création en cours...' : 'Confirmer le rendez-vous'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}