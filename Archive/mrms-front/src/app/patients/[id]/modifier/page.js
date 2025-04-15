'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PatientForm from '@/components/patients/PatientForm';
import patientService from '@/services/patientService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loading from '@/components/common/Loading';

export default function EditPatientPage() {
    const { id } = useParams();
    const router = useRouter();

    const [patient, setPatient] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    // Charger les données du patient
    useEffect(() => {
        const chargerPatient = async () => {
            try {
                setChargement(true);
                setErreur(null);

                const patientData = await patientService.getPatientById(id);
                setPatient(patientData);
            } catch (error) {
                console.error('Erreur lors du chargement des données du patient:', error);
                setErreur('Impossible de charger les informations du patient.');
            } finally {
                setChargement(false);
            }
        };

        if (id) {
            chargerPatient();
        }
    }, [id]);

    return (
        <ProtectedRoute titre="Modifier le patient">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100"
                        aria-label="Retour"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {chargement ? 'Chargement...' : patient ? `Modifier ${patient.nom} ${patient.prenom}` : 'Patient non trouvé'}
                    </h1>
                </div>

                {/* Affichage des erreurs */}
                {erreur && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{erreur}</p>
                        <button
                            onClick={() => router.push('/patients')}
                            className="mt-2 text-sm font-medium hover:underline"
                        >
                            Retour à la liste des patients
                        </button>
                    </div>
                )}

                {/* Formulaire ou chargement */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {chargement ? (
                        <div className="flex justify-center py-8">
                            <Loading />
                        </div>
                    ) : patient ? (
                        <PatientForm patient={patient} mode="edition" />
                    ) : !erreur && (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Patient non trouvé.</p>
                            <button
                                onClick={() => router.push('/patients')}
                                className="mt-4 px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                            >
                                Retour à la liste des patients
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}