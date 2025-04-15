'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function PatientMedicalRecord() {
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [medicalNotes, setMedicalNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicalData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/patient/dossier-medical');
                setMedicalRecord(response.data.dossierMedical);
                setMedicalNotes(response.data.notesMedicales || []);
            } catch (error) {
                console.error('Error fetching medical record:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Mon Dossier Médical</h1>

            {/* Medical Information */}
            <section className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Informations médicales</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem label="Groupe sanguin" value={medicalRecord?.groupeSanguin || 'Non spécifié'} />
                        <InfoItem label="Taille" value={medicalRecord?.taille ? `${medicalRecord.taille} cm` : 'Non spécifiée'} />
                        <InfoItem label="Poids" value={medicalRecord?.poids ? `${medicalRecord.poids} kg` : 'Non spécifié'} />
                        <InfoItem label="Date de naissance" value={medicalRecord?.dateNaissance || 'Non spécifiée'} />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Allergies</h3>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">
                            {medicalRecord?.allergies || 'Aucune allergie connue'}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Antécédents médicaux</h3>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">
                            {medicalRecord?.antecedents || 'Aucun antécédent médical documenté'}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Médications actuelles</h3>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">
                            {medicalRecord?.medicationsActuelles || 'Aucune médication actuelle'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Medical Notes */}
            <section className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Notes médicales</h2>
                </div>
                <div className="p-6">
                    {medicalNotes.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Aucune note médicale disponible</p>
                    ) : (
                        <div className="space-y-4">
                            {medicalNotes.map((note, index) => (
                                <div key={note.id || index} className="border-l-4 border-[#5CB1B1] pl-4 py-2">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-900">Dr. {note.medecin?.nom || 'Médecin'}</p>
                                        <p className="text-sm text-gray-500">{new Date(note.dateCreation).toLocaleDateString()}</p>
                                    </div>
                                    <p className="mt-1 text-gray-600">{note.contenu}</p>
                                    {note.diagnostic && (
                                        <p className="mt-2 text-sm">
                                            <span className="font-medium">Diagnostic:</span> {note.diagnostic}
                                        </p>
                                    )}
                                    {note.traitement && (
                                        <p className="mt-1 text-sm">
                                            <span className="font-medium">Traitement:</span> {note.traitement}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-gray-900">{value}</p>
        </div>
    );
}