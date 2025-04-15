'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import MedicalNotesEditor from '@/components/doctor/MedicalNotesEditor';
import appointmentService from '@/services/appointmentService';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/hooks/useAuth';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function AppointmentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useUI();
    const { estMedecin } = useAuth();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [showNoteEditor, setShowNoteEditor] = useState(false);

    // Charger les données du rendez-vous
    useEffect(() => {
        const loadAppointment = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await appointmentService.getAppointmentById(id);
                setAppointment(data);
            } catch (error) {
                console.error('Erreur lors du chargement du rendez-vous:', error);
                setError('Impossible de charger les données du rendez-vous.');
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement du rendez-vous'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadAppointment();
        }
    }, [id, addToast]);

    // Formatage de la date et de l'heure
    const formatAppointmentDate = (appointment) => {
        if (!appointment) return '';

        try {
            let dateObj;
            if (appointment.date && appointment.heure) {
                dateObj = new Date(`${appointment.date}T${appointment.heure}`);
            } else if (appointment.dateHeure) {
                dateObj = new Date(appointment.dateHeure);
            } else {
                return 'Date invalide';
            }

            return format(dateObj, 'PPPP', { locale: fr });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date invalide';
        }
    };

    const formatAppointmentTime = (appointment) => {
        if (!appointment) return '';

        try {
            let timeStr;
            if (appointment.heure) {
                timeStr = appointment.heure;
            } else if (appointment.dateHeure) {
                timeStr = new Date(appointment.dateHeure).toTimeString().slice(0, 5);
            } else {
                return '--:--';
            }

            return timeStr;
        } catch (error) {
            console.error('Error formatting time:', error);
            return '--:--';
        }
    };

    // Obtenir le statut du rendez-vous
    const getAppointmentStatus = (appointment) => {
        if (!appointment) return '';

        if (typeof appointment.statut === 'object' && appointment.statut !== null) {
            return appointment.statut.nom || 'Programmé';
        }
        return appointment.statut || 'Programmé';
    };

    // Obtenir la couleur du statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmé':
                return 'bg-green-100 text-green-800';
            case 'Annulé':
                return 'bg-red-100 text-red-800';
            case 'Terminé':
                return 'bg-blue-100 text-blue-800';
            case 'Programmé':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    // Mettre à jour le statut du rendez-vous
    const handleStatusChange = async (newStatus) => {
        try {
            setStatusLoading(true);
            await appointmentService.updateAppointment(id, { statut: newStatus });

            // Mettre à jour le rendez-vous local
            setAppointment(prev => ({
                ...prev,
                statut: newStatus
            }));

            addToast({
                type: 'success',
                message: `Le statut a été changé en "${newStatus}"`
            });
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors du changement de statut'
            });
        } finally {
            setStatusLoading(false);
        }
    };

    // Supprimer le rendez-vous
    const handleDeleteAppointment = async () => {
        try {
            await appointmentService.deleteAppointment(id);
            addToast({
                type: 'success',
                message: 'Rendez-vous supprimé avec succès'
            });
            router.push('/rendez-vous');
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors de la suppression du rendez-vous'
            });
        }
    };

    // Ajouter une note médicale
    const handleNoteSaved = (newNote) => {
        setShowNoteEditor(false);
        addToast({
            type: 'success',
            message: 'Note médicale ajoutée avec succès'
        });

        // Recharger le rendez-vous pour voir la note
        appointmentService.getAppointmentById(id).then(data => {
            setAppointment(data);
        }).catch(error => {
            console.error('Erreur lors du rechargement du rendez-vous:', error);
        });
    };

    // Obtenir le nom du patient
    const getPatientName = () => {
        if (!appointment) return '';

        if (appointment.patient) {
            return `${appointment.patient.nom || ''} ${appointment.patient.prenom || ''}`.trim();
        } else if (appointment.client) {
            return `${appointment.client.nom || ''} ${appointment.client.prenom || ''}`.trim();
        }

        return 'Patient inconnu';
    };

    return (
        <ProtectedRoute titre="Détail rendez-vous">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 p-2 rounded-full hover:bg-gray-100"
                            aria-label="Retour"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        {loading ? (
                            <h1 className="text-2xl font-semibold text-gray-800">Chargement...</h1>
                        ) : error ? (
                            <h1 className="text-2xl font-semibold text-gray-800">Rendez-vous non trouvé</h1>
                        ) : (
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Rendez-vous du {formatAppointmentDate(appointment)}
                            </h1>
                        )}
                    </div>

                    {!loading && !error && appointment && (
                        <div className="flex space-x-2">
                            <Link
                                href={`/rendez-vous/${id}/modifier`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <PencilIcon className="h-5 w-5 mr-2" />
                                Modifier
                            </Link>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/rendez-vous')}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                        >
                            Retour à la liste des rendez-vous
                        </button>
                    </div>
                )}

                {/* Contenu principal */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                    </div>
                ) : !error && appointment && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Informations principales */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Informations du rendez-vous</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CalendarIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Date</p>
                                            <p className="text-sm text-gray-500">{formatAppointmentDate(appointment)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <ClockIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Heure</p>
                                            <p className="text-sm text-gray-500">{formatAppointmentTime(appointment)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <UserIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Patient</p>
                                            <p className="text-sm text-gray-500">{getPatientName()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <ClockIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Durée</p>
                                            <p className="text-sm text-gray-500">{appointment.duree || 30} minutes</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-900">Notes</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {appointment.notes || 'Aucune note pour ce rendez-vous.'}
                                    </p>
                                </div>

                                {/* Notes médicales */}
                                {estMedecin && estMedecin() && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-medium text-gray-900">Notes médicales</h3>

                                            {!showNoteEditor && (
                                                <button
                                                    onClick={() => setShowNoteEditor(true)}
                                                    className="text-sm text-[#5CB1B1] hover:text-[#4A9494]"
                                                >
                                                    Ajouter une note
                                                </button>
                                            )}
                                        </div>

                                        {showNoteEditor ? (
                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <MedicalNotesEditor
                                                    appointmentId={id}
                                                    onNoteSaved={handleNoteSaved}
                                                />

                                                <div className="mt-2 flex justify-end">
                                                    <button
                                                        onClick={() => setShowNoteEditor(false)}
                                                        className="text-sm text-gray-500 hover:text-gray-700"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {appointment.notesMedicales && appointment.notesMedicales.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {appointment.notesMedicales.map((note, index) => (
                                                            <div key={note.id || index} className="bg-gray-50 p-4 rounded-md">
                                                                <div className="flex justify-between">
                                                                    <p className="text-sm text-gray-500">
                                                                        {note.dateCreation && format(new Date(note.dateCreation), 'PPP', { locale: fr })}
                                                                    </p>
                                                                    {note.prive && (
                                                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                                                            Note privée
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="mt-2 text-sm">{note.contenu}</p>

                                                                {(note.diagnostic || note.traitement) && (
                                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                                        {note.diagnostic && (
                                                                            <p className="text-sm">
                                                                                <span className="font-medium">Diagnostic:</span> {note.diagnostic}
                                                                            </p>
                                                                        )}
                                                                        {note.traitement && (
                                                                            <p className="text-sm mt-1">
                                                                                <span className="font-medium">Traitement:</span> {note.traitement}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">
                                                        Aucune note médicale pour ce rendez-vous.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statut et actions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Statut</h2>

                                <div className="flex flex-col items-center">
                                    <span className={`px-4 py-2 rounded-full ${getStatusColor(getAppointmentStatus(appointment))}`}>
                                        {getAppointmentStatus(appointment)}
                                    </span>

                                    <div className="mt-6 w-full space-y-3">
                                        <button
                                            onClick={() => handleStatusChange('Confirmé')}
                                            disabled={statusLoading || getAppointmentStatus(appointment) === 'Confirmé'}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                                            Confirmer
                                        </button>

                                        <button
                                            onClick={() => handleStatusChange('Terminé')}
                                            disabled={statusLoading || getAppointmentStatus(appointment) === 'Terminé'}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                                            Marquer comme terminé
                                        </button>

                                        <button
                                            onClick={() => handleStatusChange('Annulé')}
                                            disabled={statusLoading || getAppointmentStatus(appointment) === 'Annulé'}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircleIcon className="h-5 w-5 mr-2" />
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Patient</h2>

                                <div className="space-y-4">
                                    {(appointment.patient || appointment.client) && (
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nom</p>
                                                <p className="text-sm text-gray-900">{getPatientName()}</p>
                                            </div>

                                            {(appointment.patient?.email || appointment.client?.email) && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                                    <p className="text-sm text-gray-900">{appointment.patient?.email || appointment.client?.email}</p>
                                                </div>
                                            )}

                                            {(appointment.patient?.telephone || appointment.client?.telephone) && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                                                    <p className="text-sm text-gray-900">{appointment.patient?.telephone || appointment.client?.telephone}</p>
                                                </div>
                                            )}

                                            <div className="pt-4">
                                                <Link
                                                    href={`/patients/${appointment.patient?.id || appointment.client?.id || '#'}`}
                                                    className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                                                >
                                                    Voir la fiche patient
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmation de suppression */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeleteAppointment}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}