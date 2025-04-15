'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PatientDetails from '@/components/patients/PatientDetails';
import MedicalNotes from '@/components/patients/MedicalNotes';
import patientService from '@/services/patientService';
import { useUI } from '@/contexts/UIContext';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useUI();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('informations');
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Charger les données du patient
    useEffect(() => {
        const loadPatient = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await patientService.getPatientById(id);
                setPatient(data);
            } catch (error) {
                console.error('Erreur lors du chargement du patient:', error);
                setError('Impossible de charger les données du patient.');
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement du patient'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPatient();
        }
    }, [id, addToast]);

    // Mettre à jour les données du patient
    const handlePatientUpdate = (updatedPatient) => {
        setPatient(updatedPatient);
    };

    // Supprimer le patient
    const handleDeletePatient = async () => {
        try {
            await patientService.deletePatient(id);
            addToast({
                type: 'success',
                message: 'Patient supprimé avec succès'
            });
            router.push('/patients');
        } catch (error) {
            console.error('Erreur lors de la suppression du patient:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors de la suppression du patient'
            });
        }
    };

    return (
        <ProtectedRoute titre="Détail patient">
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
                            <h1 className="text-2xl font-semibold text-gray-800">Patient non trouvé</h1>
                        ) : (
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {patient?.nom} {patient?.prenom}
                            </h1>
                        )}
                    </div>

                    {!loading && !error && patient && (
                        <div className="flex space-x-2">
                            <Link
                                href={`/rendez-vous/nouveau?patientId=${id}`}
                                className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                            >
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                Nouveau rendez-vous
                            </Link>
                            <Link
                                href={`/patients/${id}/modifier`}
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
                            onClick={() => router.push('/patients')}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                        >
                            Retour à la liste des patients
                        </button>
                    </div>
                )}

                {/* Contenu principal */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                    </div>
                ) : !error && patient && (
                    <>
                        {/* Onglets */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('informations')}
                                        className={`py-4 px-1 ${
                                            activeTab === 'informations'
                                                ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } font-medium text-sm`}
                                    >
                                        Informations
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('noteMedicale')}
                                        className={`py-4 px-1 ${
                                            activeTab === 'noteMedicale'
                                                ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } font-medium text-sm`}
                                    >
                                        Notes médicales
                                    </button>
                                </nav>
                            </div>

                            {/* Contenu des onglets */}
                            {activeTab === 'informations' && <PatientDetails patient={patient} />}
                            {activeTab === 'noteMedicale' && (
                                <MedicalNotes patient={patient} onUpdate={handlePatientUpdate} />
                            )}
                        </div>
                    </>
                )}

                {/* Modal de confirmation de suppression */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Êtes-vous sûr de vouloir supprimer le patient {patient?.nom} {patient?.prenom} ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeletePatient}
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