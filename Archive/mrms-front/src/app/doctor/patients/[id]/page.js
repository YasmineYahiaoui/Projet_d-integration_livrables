// /app/medecin/patients/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import patientService from '@/services/patientService';
import doctorService from '@/services/doctorService';
import { useUI } from '@/contexts/UIContext';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import MedicalNoteForm from '@/components/doctors/MedicalNoteForm';

export default function DoctorPatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useUI();

    const [patient, setPatient] = useState(null);
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [medicalNotes, setMedicalNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNoteForm, setShowNoteForm] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [patientData, medicalRecordData, medicalNotesData] = await Promise.all([
                    patientService.getPatientById(id),
                    doctorService.getPatientMedicalRecord(id),
                    doctorService.getPatientMedicalNotes(id)
                ]);

                setPatient(patientData);
                setMedicalRecord(medicalRecordData);
                setMedicalNotes(medicalNotesData);
            } catch (error) {
                console.error('Error fetching patient data:', error);
                setError('Erreur lors du chargement des données du patient');
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

    const handleAddNote = async (noteData) => {
        try {
            const newNote = await doctorService.addMedicalNote({
                ...noteData,
                clientId: id
            });

            setMedicalNotes([newNote, ...medicalNotes]);
            setShowNoteForm(false);
            addToast({
                type: 'success',
                message: 'Note médicale ajoutée avec succès'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Erreur lors de l\'ajout de la note médicale'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-red-500 mb-4">{error || 'Patient non trouvé'}</p>
                <button
                    onClick={() => router.push('/medecin/patients')}
                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    Retour à la liste des patients
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {patient.nom} {patient.prenom}
                    </h1>
                </div>

                <div className="flex space-x-3">
                    <Link
                        href={`/medecin/rendez-vous/nouveau?patientId=${id}`}
                        className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                    >
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Nouveau rendez-vous
                    </Link>
                    <button
                        onClick={() => setShowNoteForm(!showNoteForm)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        {showNoteForm ? 'Annuler' : 'Ajouter une note'}
                    </button>
                </div>
            </div>

            {showNoteForm && (
                <div className="bg-white rounded-lg shadow p-6">
                    <MedicalNoteForm onSubmit={handleAddNote} onCancel={() => setShowNoteForm(false)} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informations du patient</h2>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                                    <dd className="mt-1 text-gray-900">{patient.nom} {patient.prenom}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-gray-900">{patient.email || 'Non renseigné'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                                    <dd className="mt-1 text-gray-900">{patient.telephone || 'Non renseigné'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                                    <dd className="mt-1 text-gray-900">
                                        {patient.dateNaissance ? new Date(patient.dateNaissance).toLocaleDateString() : 'Non renseignée'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Dossier médical</h2>
                        </div>
                        <div className="p-6">
                            {!medicalRecord ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Aucun dossier médical disponible</p>
                                </div>
                            ) : (
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Groupe sanguin</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.groupeSanguin || 'Non spécifié'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.allergies || 'Aucune allergie connue'}</dd>
                                    </div>
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Antécédents médicaux</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.antecedentsMedicaux || 'Aucun antécédent'}</dd>
                                    </div>
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Médicaments actuels</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.medicamentsActuels || 'Aucun médicament'}</dd>
                                    </div>
                                </dl>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Notes médicales</h2>
                        </div>
                        <div className="p-6">
                            {medicalNotes.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Aucune note médicale disponible</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {medicalNotes.map(note => (
                                        <div key={note.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {new Date(note.dateCreation).toLocaleDateString()}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        Dr. {note.medecin?.nom} {note.medecin?.prenom}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    {note.prive && (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Privé
                            </span>
                                                    )}
                                                    {note.rendezVousId && (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Consultation
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                                {note.contenu}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}