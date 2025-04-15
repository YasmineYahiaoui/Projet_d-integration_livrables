// /app/patient/rendez-vous/nouveau/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import appointmentService from '@/services/appointmentService';
import { useUI } from '@/contexts/UIContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BookAppointmentPage() {
    const router = useRouter();
    const { addToast } = useUI();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [type, setType] = useState('Consultation');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch available slots when date changes
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate) return;

            try {
                setLoadingSlots(true);
                const slots = await appointmentService.getAvailableTimeSlots(selectedDate);
                setAvailableSlots(slots);
                // Reset selected time if not available in new slots
                if (slots.length > 0 && !slots.includes(selectedTime)) {
                    setSelectedTime('');
                }
            } catch (error) {
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement des créneaux disponibles'
                });
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, addToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedTime) {
            addToast({
                type: 'error',
                message: 'Veuillez sélectionner une date et une heure'
            });
            return;
        }

        try {
            setLoading(true);
            await appointmentService.createAppointment({
                date: selectedDate,
                heure: selectedTime,
                type,
                notes,
                duree: 30 // Default duration
            });

            addToast({
                type: 'success',
                message: 'Rendez-vous pris avec succès'
            });

            router.push('/patient/rendez-vous');
        } catch (error) {
            addToast({
                type: 'error',
                message: error.userMessage || 'Erreur lors de la prise de rendez-vous'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center">
                    <Link href="/patient/rendez-vous" className="mr-4">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Prendre un rendez-vous</h1>
                </div>

                {/* Booking form */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Date selection */}
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date du rendez-vous
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                {/* Time selection */}
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                        Heure du rendez-vous
                                    </label>
                                    {loadingSlots ? (
                                        <div className="mt-2 flex justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                                        </div>
                                    ) : selectedDate ? (
                                        availableSlots.length > 0 ? (
                                            <div className="mt-2 grid grid-cols-3 gap-2">
                                                {availableSlots.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setSelectedTime(slot)}
                                                        className={`py-2 text-center text-sm rounded-md ${
                                                            selectedTime === slot
                                                                ? 'bg-[#5CB1B1] text-white'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-red-600">
                                                Aucun créneau disponible à cette date
                                            </p>
                                        )
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Veuillez d'abord sélectionner une date
                                        </p>
                                    )}
                                </div>

                                {/* Appointment type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                        Type de rendez-vous
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm"
                                    >
                                        <option value="Consultation">Consultation</option>
                                        <option value="Suivi">Suivi</option>
                                        <option value="Urgence">Urgence</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notes (optionnel)
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Précisez la raison de votre consultation..."
                                    ></textarea>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/patient/rendez-vous"
                                        className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1]"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedDate || !selectedTime}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#5CB1B1] hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
                                    >
                                        {loading ? 'En cours...' : 'Confirmer le rendez-vous'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}