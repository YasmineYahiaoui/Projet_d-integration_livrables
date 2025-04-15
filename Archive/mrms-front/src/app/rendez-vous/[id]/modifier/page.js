'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppointmentForm from '@/components/rendez-vous/AppointmentForm';
import appointmentService from '@/services/appointmentService';
import Loading from '@/components/common/Loading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditAppointmentPage() {
    const { id } = useParams();
    const router = useRouter();

    const [rendezVous, setRendezVous] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    // Charger les données du rendez-vous
    useEffect(() => {
        const chargerRendezVous = async () => {
            try {
                setChargement(true);
                setErreur(null);

                const rdvData = await appointmentService.getAppointmentById(id);

                // Normalize the appointment data for the form
                const normalizedData = normalizeAppointmentData(rdvData);
                setRendezVous(normalizedData);
            } catch (error) {
                console.error('Erreur lors du chargement des données du rendez-vous:', error);
                setErreur('Impossible de charger les informations du rendez-vous.');
            } finally {
                setChargement(false);
            }
        };

        if (id) {
            chargerRendezVous();
        }
    }, [id]);

    // Normalize the appointment data to a consistent format for the form
    const normalizeAppointmentData = (data) => {
        if (!data) return null;

        // Create a normalized appointment object
        const normalized = { ...data };

        // Handle patient/client differences
        if (data.client && !data.patient) {
            normalized.patient = data.client;
            normalized.patientId = data.clientId;
        }

        // Handle status object
        if (data.statut && typeof data.statut === 'object') {
            normalized.statutNom = data.statut.nom;
        } else {
            normalized.statutNom = data.statut;
        }

        // Handle date and time
        if (data.dateHeure && !data.date) {
            try {
                const dateTime = new Date(data.dateHeure);
                normalized.date = dateTime.toISOString().split('T')[0];
                normalized.heure = dateTime.toTimeString().substring(0, 5);
            } catch (e) {
                console.error('Error parsing dateHeure:', e);
            }
        }

        // Handle notifications array
        if (data.notifications && Array.isArray(data.notifications)) {
            normalized.notifications = data.notifications.map(n =>
                typeof n === 'object' && n !== null ? n.nom : n
            );
        }

        return normalized;
    };

    return (
        <ProtectedRoute titre="Modifier le rendez-vous">
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
                        {chargement ? 'Chargement...' : rendezVous ? 'Modifier le rendez-vous' : 'Rendez-vous non trouvé'}
                    </h1>
                </div>

                {/* Affichage des erreurs */}
                {erreur && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{erreur}</p>
                        <button
                            onClick={() => router.push('/rendez-vous')}
                            className="mt-2 text-sm font-medium hover:underline"
                        >
                            Retour à la liste des rendez-vous
                        </button>
                    </div>
                )}

                {/* Formulaire ou chargement */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {chargement ? (
                        <div className="flex justify-center py-8">
                            <Loading />
                        </div>
                    ) : rendezVous ? (
                        <AppointmentForm appointment={rendezVous} mode="edition" />
                    ) : !erreur && (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Rendez-vous non trouvé.</p>
                            <button
                                onClick={() => router.push('/rendez-vous')}
                                className="mt-4 px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                            >
                                Retour à la liste des rendez-vous
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}