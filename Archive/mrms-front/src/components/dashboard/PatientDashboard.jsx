'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/contexts/UIContext';
import PatientAppointmentsList from '@/components/patient/PatientAppointmentsList';

export default function PatientDashboard() {
    const { utilisateur, estAuthentifie, chargement } = useAuth();
    const router = useRouter();
    const { addToast } = useUI || { addToast: () => {} };

    const [rendezVous, setRendezVous] = useState([]);
    const [rendezVousChargement, setRendezVousChargement] = useState(true);
    const [rendezVousErreur, setRendezVousErreur] = useState(null);
    const [infosPatient, setInfosPatient] = useState(null);
    const [profileChargement, setProfileChargement] = useState(true);

    // Redirect if not authenticated or not a patient
    useEffect(() => {
        if (!chargement && (!estAuthentifie || (utilisateur && utilisateur.role !== 'Patient'))) {
            router.push('/connexion');
            if (estAuthentifie && utilisateur && utilisateur.role !== 'Patient') {
                addToast({
                    type: 'error',
                    message: 'Accès réservé aux patients'
                });
            }
        }
    }, [chargement, estAuthentifie, utilisateur, router, addToast]);

    // Fetch patient profile
    useEffect(() => {
        const fetchPatientProfile = async () => {
            try {
                setProfileChargement(true);
                const response = await api.get('/api/patient/mon-profil');
                setInfosPatient(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement du profil patient:', error);
            } finally {
                setProfileChargement(false);
            }
        };

        if (estAuthentifie && utilisateur && utilisateur.role === 'Patient') {
            fetchPatientProfile();
        }
    }, [estAuthentifie, utilisateur]);

    // Fetch upcoming appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setRendezVousChargement(true);
                setRendezVousErreur(null);

                const response = await api.get('/api/patient/mes-rendez-vous');

                // Sort appointments by date and time (most recent first)
                const sortedAppointments = response.data.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.heure}`);
                    const dateB = new Date(`${b.date}T${b.heure}`);
                    return dateB - dateA;
                });

                setRendezVous(sortedAppointments);
            } catch (error) {
                console.error('Erreur lors du chargement des rendez-vous:', error);
                setRendezVousErreur('Impossible de charger vos rendez-vous');
            } finally {
                setRendezVousChargement(false);
            }
        };

        if (estAuthentifie && utilisateur && utilisateur.role === 'Patient') {
            fetchAppointments();
        }
    }, [estAuthentifie, utilisateur]);

    // Show loading state
    if (chargement || (estAuthentifie && profileChargement)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    // Return early if not authenticated or not a patient
    if (!estAuthentifie || (utilisateur && utilisateur.role !== 'Patient')) {
        return null; // Redirection handled by useEffect
    }

    // Count upcoming appointments
    const rdvAVenir = rendezVous.filter(rdv => {
        const dateRdv = new Date(`${rdv.date}T${rdv.heure}`);
        return dateRdv >= new Date() && rdv.statut?.nom !== 'Annulé';
    });

    // Get next appointment
    const prochainRdv = rdvAVenir.length > 0 ? rdvAVenir[rdvAVenir.length - 1] : null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Tableau de bord patient
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Bienvenue, {infosPatient?.prenom} {infosPatient?.nom}
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        href="/patient/rendez-vous/nouveau"
                        className="bg-[#5CB1B1] text-white px-4 py-2 rounded-md hover:bg-[#4A9494] transition-colors"
                    >
                        Prendre rendez-vous
                    </Link>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-gray-500 text-sm uppercase font-semibold">Prochain rendez-vous</div>
                    <div className="mt-2">
                        {prochainRdv ? (
                            <div>
                                <div className="text-xl font-bold">
                                    {format(new Date(`${prochainRdv.date}T${prochainRdv.heure}`), 'PPP', { locale: fr })}
                                </div>
                                <div className="text-gray-600">
                                    à {prochainRdv.heure}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-600">Aucun rendez-vous à venir</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-gray-500 text-sm uppercase font-semibold">Rendez-vous à venir</div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold">{rdvAVenir.length}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-gray-500 text-sm uppercase font-semibold">Total des rendez-vous</div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold">{rendezVous.length}</div>
                    </div>
                </div>
            </div>

            {/* Appointments section */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Mes rendez-vous</h2>
                    <Link
                        href="/patient/rendez-vous"
                        className="text-sm text-[#5CB1B1] hover:text-[#4A9494]"
                    >
                        Voir tous
                    </Link>
                </div>

                <div className="p-4">
                    {rendezVousChargement ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : rendezVousErreur ? (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md">
                            {rendezVousErreur}
                        </div>
                    ) : rendezVous.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Vous n'avez pas encore de rendez-vous.</p>
                            <Link
                                href="/patient/rendez-vous/nouveau"
                                className="mt-4 inline-block bg-[#5CB1B1] text-white px-4 py-2 rounded-md hover:bg-[#4A9494] transition-colors"
                            >
                                Prendre votre premier rendez-vous
                            </Link>
                        </div>
                    ) : (
                        <PatientAppointmentsList
                            rendezVous={rdvAVenir.slice(0, 5)}
                            limit={5}
                        />
                    )}
                </div>
            </div>

            {/* Profile section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Mon profil</h2>
                    <Link
                        href="/patient/profil"
                        className="text-sm text-[#5CB1B1] hover:text-[#4A9494]"
                    >
                        Modifier
                    </Link>
                </div>

                <div className="p-4">
                    {profileChargement ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : !infosPatient ? (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md">
                            Impossible de charger les informations du profil
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm">Nom</p>
                                <p className="font-medium">{infosPatient.prenom} {infosPatient.nom}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p className="font-medium">{infosPatient.email || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Téléphone</p>
                                <p className="font-medium">{infosPatient.telephone || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Préférence de contact</p>
                                <p className="font-medium">{infosPatient.preferenceContact?.nom || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Langue</p>
                                <p className="font-medium">{infosPatient.langue?.nom || 'Non spécifié'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}