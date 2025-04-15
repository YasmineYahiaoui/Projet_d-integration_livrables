// /app/patient/dossier-medical/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import patientService from '@/services/patientService';
import { useUI } from '@/contexts/UIContext';
import Loading from '@/components/common/Loading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PatientMedicalRecordPage() {
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useUI();

    useEffect(() => {
        const fetchMedicalRecord = async () => {
            try {
                setLoading(true);
                const data = await patientService.getMyMedicalRecord();
                setMedicalRecord(data);
            } catch (error) {
                addToast({
                    type: 'error',
                    message: 'Erreur lors du chargement de votre dossier médical'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalRecord();
    }, [addToast]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center">
                    <Link href="/patient/tableau-bord" className="mr-4">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Mon dossier médical</h1>
                </div>

                {loading ? (
                    <Loading />
                ) : !medicalRecord ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">Dossier médical non disponible.</p>
                    </div>
                ) : (
                    <>
                        {/* Medical record summary */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Informations générales</h2>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Groupe sanguin</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.dossier?.groupeSanguin || 'Non spécifié'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.dossier?.allergies || 'Aucune allergie connue'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Antécédents médicaux</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.dossier?.antecedentsMedicaux || 'Aucun antécédent'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Médicaments actuels</dt>
                                        <dd className="mt-1 text-gray-900">{medicalRecord.dossier?.medicamentsActuels || 'Aucun médicament'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Medical notes */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Notes médicales</h2>
                            </div>
                            <div className="p-6">
                                {medicalRecord.notesMedicales?.length > 0 ? (
                                    <div className="space-y-4">
                                        {medicalRecord.notesMedicales.map((note) => (
                                            <div key={note.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {new Date(note.dateCreation).toLocaleDateString()}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            Dr. {note.medecin?.nom} {note.medecin?.prenom}
                                                        </p>
                                                    </div>
                                                    {note.rendezVousId && (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                            Consultation
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                                                    {note.contenu}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Aucune note médicale disponible</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}