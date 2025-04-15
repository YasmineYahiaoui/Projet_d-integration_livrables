import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';
import { useUI } from '@/contexts/UIContext';

export default function PatientAppointmentsList({ rendezVous = [], limit = 0, showActions = true }) {
    // Ensure rendezVous is always an array
    const appointmentsArray = Array.isArray(rendezVous) ? rendezVous : [];

    // Apply limit if needed
    const appointmentsToShow = limit > 0 ? appointmentsArray.slice(0, limit) : appointmentsArray;

    const [loadingId, setLoadingId] = useState(null);
    const { addToast } = useUI || { addToast: () => {} };

    // Format date for display
    const formatAppointmentDate = (date, heure) => {
        try {
            const dateTime = new Date(`${date}T${heure}`);
            return format(dateTime, 'PPPPp', { locale: fr });
        } catch (e) {
            return 'Date invalide';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        // Extract status name if it's an object
        const statusName = typeof status === 'object' && status !== null ? status.nom : status;

        switch (statusName) {
            case 'Programmé':
                return 'bg-blue-100 text-blue-800';
            case 'Confirmé':
                return 'bg-green-100 text-green-800';
            case 'Annulé':
                return 'bg-red-100 text-red-800';
            case 'Terminé':
                return 'bg-purple-100 text-purple-800';
            case 'Non présenté':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle appointment cancellation
    const handleCancelAppointment = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            return;
        }

        try {
            setLoadingId(id);

            await api.put(`/api/patient/annuler-rendez-vous/${id}`);

            addToast({
                type: 'success',
                message: 'Rendez-vous annulé avec succès'
            });

            // Refresh page to update the data
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'annulation du rendez-vous:', error);

            addToast({
                type: 'error',
                message: 'Erreur lors de l\'annulation du rendez-vous'
            });
        } finally {
            setLoadingId(null);
        }
    };

    // Check if an appointment is in the past
    const isAppointmentPast = (date, time) => {
        const appointmentDate = new Date(`${date}T${time}`);
        return appointmentDate < new Date();
    };

    // Check if an appointment can be canceled
    const canCancelAppointment = (appointment) => {
        // Cannot cancel if it's already canceled, completed, or in the past
        const statusName = appointment.statut?.nom || appointment.statut;
        return (
            statusName !== 'Annulé' &&
            statusName !== 'Terminé' &&
            !isAppointmentPast(appointment.date, appointment.heure)
        );
    };

    if (appointmentsToShow.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500">
                Aucun rendez-vous à afficher.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date et heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                    </th>
                    {showActions && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {appointmentsToShow.map((rdv) => (
                    <tr key={rdv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {formatAppointmentDate(rdv.date, rdv.heure)}
                            </div>
                            <div className="text-xs text-gray-500">
                                Durée: {rdv.duree} min
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rdv.type || 'Consultation'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(rdv.statut)}`}>
                                    {rdv.statut?.nom || rdv.statut || 'Programmé'}
                                </span>
                        </td>
                        {showActions && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/patient/rendez-vous/${rdv.id}`}
                                    className="text-[#5CB1B1] hover:text-[#4A9494] mr-3"
                                >
                                    Détails
                                </Link>

                                {canCancelAppointment(rdv) && (
                                    <button
                                        onClick={() => handleCancelAppointment(rdv.id)}
                                        disabled={loadingId === rdv.id}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingId === rdv.id ? 'Annulation...' : 'Annuler'}
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}