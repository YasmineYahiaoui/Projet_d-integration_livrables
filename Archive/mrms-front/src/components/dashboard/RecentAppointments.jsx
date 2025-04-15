import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function RecentAppointments({ rendezVous = [] }) {
    // Ensure rendezVous is always an array
    const appointmentsArray = Array.isArray(rendezVous) ? rendezVous : [];

    // Format date function
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'PPP', { locale: fr });
        } catch (error) {
            return 'Date invalide';
        }
    };

    // Format time function
    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'HH:mm', { locale: fr });
        } catch (error) {
            return '--:--';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        // Extract status name if it's an object
        const statusName = typeof status === 'object' && status !== null ? status.nom : status;

        switch (statusName) {
            case 'Planifié':
            case 'Programmé':
                return 'bg-blue-100 text-blue-800';
            case 'Confirmé':
                return 'bg-green-100 text-green-800';
            case 'Annulé':
                return 'bg-red-100 text-red-800';
            case 'Terminé':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function to get patient/client name
    const getPatientName = (appointment) => {
        if (appointment.patient) {
            return `${appointment.patient.nom || ''} ${appointment.patient.prenom || ''}`.trim();
        } else if (appointment.client) {
            return `${appointment.client.nom || ''} ${appointment.client.prenom || ''}`.trim();
        }
        return 'Patient inconnu';
    };

    // Helper function to get appointment status text
    const getStatusText = (status) => {
        if (!status) return 'N/A';
        return typeof status === 'object' && status !== null ? status.nom : status;
    };

    // Render date/time with proper handling
    const renderDateTime = (appointment) => {
        if (appointment.dateHeure) {
            return (
                <>
                    <div className="text-sm font-medium">{formatDate(appointment.dateHeure)}</div>
                    <div className="text-xs text-gray-500">{formatTime(appointment.dateHeure)}</div>
                </>
            );
        } else if (appointment.date) {
            const dateTimeStr = `${appointment.date}T${appointment.heure || '00:00:00'}`;
            return (
                <>
                    <div className="text-sm font-medium">{formatDate(dateTimeStr)}</div>
                    <div className="text-xs text-gray-500">{appointment.heure || '--:--'}</div>
                </>
            );
        }
        return (
            <>
                <div className="text-sm font-medium">Date inconnue</div>
                <div className="text-xs text-gray-500">--:--</div>
            </>
        );
    };

    return (
        <div>
            {appointmentsArray.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Aucun rendez-vous récent à afficher.
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {appointmentsArray.map((rdv) => (
                        <li key={rdv.id} className="py-3">
                            <Link
                                href={`/rendez-vous/${rdv.id}`}
                                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 mr-3">
                                        <span className="h-8 w-8 rounded-full bg-[#5CB1B1]/20 flex items-center justify-center">
                                            <span className="text-[#5CB1B1] text-lg font-semibold">
                                                {getPatientName(rdv).charAt(0)}
                                            </span>
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{getPatientName(rdv)}</div>
                                        <div className="text-xs text-gray-500">{rdv.type || 'Consultation'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        {renderDateTime(rdv)}
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(rdv.statut)}`}>
                                            {getStatusText(rdv.statut)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}