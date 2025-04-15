'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';
import { useUI } from '@/contexts/UIContext';
import MedicalNotesEditor from '@/components/doctor/MedicalNotesEditor';

export default function PatientDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useUI();

    const [patientData, setPatientData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/medecin/patients/${id}`);

                setPatientData(response.data.patient);
                setAppointments(response.data.historiqueRendezVous || []);
                setNotes(response.data.notesMedicales || []);
            } catch (error) {
                console.error('Error fetching patient data:', error);
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement des données du patient'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPatientData();
        }
    }, [id, addToast]);

    const handleNoteCreated = (newNote) => {
        setNotes(prev => [newNote, ...prev]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    if (!patientData) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Patient non trouvé</h3>
                <p className="mt-2 text-gray-500">Le patient que vous recherchez n'existe pas ou vous n'avez pas les permissions nécessaires.</p>
                <button
                    onClick={() => router.push('/medecin/patients')}
                    className="mt-6 px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    Retour à la liste des patients
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Patient Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                            {patientData.nom} {patientData.prenom}
                        </h2>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="mr-1">Email:</span>
                                <span className="font-medium">{patientData.email || 'Non renseigné'}</span>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="mr-1">Téléphone:</span>
                                <span className="font-medium">{patientData.telephone || 'Non renseigné'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex lg:mt-0 lg:ml-4">
                        <button
                            onClick={() => router.push(`/medecin/rendez-vous/nouveau?patientId=${patientData.id}`)}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                        >
                            Nouveau rendez-vous
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`${
                            activeTab === 'profile'
                                ? 'border-[#5CB1B1] text-[#5CB1B1]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Profil
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`${
                            activeTab === 'appointments'
                                ? 'border-[#5CB1B1] text-[#5CB1B1]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Rendez-vous
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`${
                            activeTab === 'notes'
                                ? 'border-[#5CB1B1] text-[#5CB1B1]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Notes médicales
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations personnelles</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nom complet</p>
                                        <p className="mt-1 text-gray-900">{patientData.nom} {patientData.prenom}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="mt-1 text-gray-900">{patientData.email || 'Non renseigné'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Téléphone</p>
                                        <p className="mt-1 text-gray-900">{patientData.telephone || 'Non renseigné'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Préférence de contact</p>
                                        <p className="mt-1 text-gray-900">{patientData.preferenceContact?.nom || 'Non spécifiée'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Langue</p>
                                        <p className="mt-1 text-gray-900">{patientData.langue?.nom || 'Non spécifiée'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes médicales</h3>
                                <textarea
                                    value={patientData.notesMedicales || ''}
                                    onChange={async (e) => {
                                        const newValue = e.target.value;
                                        setPatientData(prev => ({ ...prev, notesMedicales: newValue }));

                                        try {
                                            await api.put(`/api/medecin/patients/${id}/notes-medicales`, {
                                                notesMedicales: newValue
                                            });
                                        } catch (error) {
                                            console.error('Error updating medical notes:', error);
                                        }
                                    }}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    placeholder="Ajoutez des notes médicales ici..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date et heure
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        Aucun rendez-vous pour ce patient
                                    </td>
                                </tr>
                            ) : (
                                appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(`${appointment.date}T${appointment.heure}`), 'PPP', { locale: fr })}
                                            </div>
                                            <div className="text-sm text-gray-500">{appointment.heure}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.statut?.nom === 'Confirmé' ? 'bg-green-100 text-green-800' :
                                appointment.statut?.nom === 'Annulé' ? 'bg-red-100 text-red-800' :
                                    appointment.statut?.nom === 'Terminé' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.statut?.nom || 'Programmé'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => router.push(`/medecin/rendez-vous/${appointment.id}`)}
                                                className="text-[#5CB1B1] hover:text-[#4A9494]"
                                            >
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="p-6 space-y-6">
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une note</h3>
                            <MedicalNotesEditor
                                patientId={id}
                                onNoteSaved={handleNoteCreated}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des notes</h3>

                            {notes.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Aucune note médicale</p>
                            ) : (
                                <div className="space-y-6">
                                    {notes.map(note => (
                                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        {format(new Date(note.dateCreation), 'PPP à HH:mm', { locale: fr })}
                                                    </p>
                                                    {note.prive && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Note privée
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-gray-900">{note.contenu}</p>

                                                {note.diagnostic && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-500">Diagnostic</p>
                                                        <p className="text-gray-900">{note.diagnostic}</p>
                                                    </div>
                                                )}

                                                {note.traitement && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-500">Traitement</p>
                                                        <p className="text-gray-900">{note.traitement}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}