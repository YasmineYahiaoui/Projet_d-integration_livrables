'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import StatisticsCard from '@/components/dashboard/StatisticsCard';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import PatientSummary from '@/components/dashboard/PatientSummary';
import dashboardService from '@/services/dashboardService';
import {
    UsersIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        appointmentsToday: 0,
        completedAppointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                setChargement(true);
                setError(null);

                // Récupérer les statistiques
                const statsData = await dashboardService.getStatistiques();
                setStats(statsData || {
                    totalPatients: 0,
                    totalAppointments: 0,
                    appointmentsToday: 0,
                    completedAppointments: 0
                });

                // Récupérer les rendez-vous récents
                const appointmentsData = await dashboardService.getRendezVousRecents();
                setRecentAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

                // Récupérer les patients récents
                const patientsData = await dashboardService.getPatientsRecents();
                setRecentPatients(Array.isArray(patientsData) ? patientsData : []);
            } catch (error) {
                console.error('Erreur lors du chargement des données du tableau de bord:', error);
                setError('Impossible de charger les données du tableau de bord.');
            } finally {
                setChargement(false);
            }
        };

        chargerDonnees();
    }, []);

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatisticsCard
                        titre="Total Patients"
                        valeur={stats.totalPatients}
                        icone={UsersIcon}
                        couleur="bg-blue-500"
                    />
                    <StatisticsCard
                        titre="Total Rendez-vous"
                        valeur={stats.totalAppointments}
                        icone={CalendarIcon}
                        couleur="bg-green-500"
                    />
                    <StatisticsCard
                        titre="Rendez-vous aujourd'hui"
                        valeur={stats.appointmentsToday}
                        icone={ClockIcon}
                        couleur="bg-yellow-500"
                    />
                    <StatisticsCard
                        titre="Rendez-vous terminés"
                        valeur={stats.completedAppointments}
                        icone={CheckCircleIcon}
                        couleur="bg-purple-500"
                    />
                </div>

                {/* Error display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rendez-vous récents */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Rendez-vous récents</h2>
                        </div>
                        <div className="p-4">
                            {chargement ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                                </div>
                            ) : (
                                <RecentAppointments rendezVous={recentAppointments} />
                            )}
                        </div>
                    </div>

                    {/* Patients récents */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Patients récents</h2>
                        </div>
                        <div className="p-4">
                            {chargement ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                                </div>
                            ) : (
                                <PatientSummary patients={recentPatients} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/patients/nouveau"
                            className="bg-[#5CB1B1] text-white px-4 py-2 rounded-md hover:bg-[#4A9494] transition-colors"
                        >
                            Ajouter un patient
                        </a>
                        <a
                            href="/rendez-vous/nouveau"
                            className="bg-[#5CB1B1] text-white px-4 py-2 rounded-md hover:bg-[#4A9494] transition-colors"
                        >
                            Créer un rendez-vous
                        </a>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}