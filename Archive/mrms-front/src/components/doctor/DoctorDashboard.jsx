'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import api from '@/services/api';
import {
    CalendarIcon, UserGroupIcon, ClockIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function DoctorDashboard() {
    const [stats, setStats] = useState({
        todayAppointments: 0,
        pendingAppointments: 0,
        totalPatients: 0,
        completedAppointments: 0
    });
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Get today's date in YYYY-MM-DD format
                const today = format(new Date(), 'yyyy-MM-dd');

                // Fetch doctor's appointments for today
                const [appointmentsRes, patientsRes] = await Promise.all([
                    api.get('/api/medecin/rendez-vous', { params: { date: today } }),
                    api.get('/api/medecin/patients', { params: { limit: 5 } })
                ]);

                // Process appointments
                const appointments = appointmentsRes.data.rendezVous || [];
                setTodayAppointments(appointments);

                // Calculate statistics
                const pending = appointments.filter(a => a.statut?.nom === 'Programmé').length;
                const completed = appointments.filter(a => a.statut?.nom === 'Terminé').length;

                setStats({
                    todayAppointments: appointments.length,
                    pendingAppointments: pending,
                    totalPatients: patientsRes.data.total || 0,
                    completedAppointments: completed
                });

                // Set recent patients
                setRecentPatients(patientsRes.data.patients || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord médecin</h1>
                <Link
                    href="/medecin/disponibilites"
                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    Gérer mes disponibilités
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="RDV aujourd'hui"
                    value={stats.todayAppointments}
                    icon={CalendarIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Patients en attente"
                    value={stats.pendingAppointments}
                    icon={ClockIcon}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Total patients"
                    value={stats.totalPatients}
                    icon={UserGroupIcon}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="RDV terminés"
                    value={stats.completedAppointments}
                    icon={CheckCircleIcon}
                    color="bg-green-500"
                />
            </div>

            {/* Today's Appointments */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Rendez-vous d'aujourd'hui ({format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })})
                    </h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : todayAppointments.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Aucun rendez-vous programmé aujourd'hui</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {todayAppointments.map(appointment => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {appointment.heure}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.client?.nom} {appointment.client?.prenom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.client?.telephone || 'Pas de téléphone'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getStatusColor(appointment.statut?.nom)
                        }`}>
                          {appointment.statut?.nom || 'Programmé'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/medecin/rendez-vous/${appointment.id}`} className="text-[#5CB1B1] hover:text-[#4A9494] mr-3">
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Patients récents</h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : recentPatients.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Aucun patient récent</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentPatients.map(patient => (
                                <Link
                                    key={patient.id}
                                    href={`/medecin/patients/${patient.id}`}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {patient.nom} {patient.prenom}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {patient.email || 'Pas d\'email'}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                        {patient.telephone || 'Pas de téléphone'}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${color} text-white rounded-md p-3`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 'Confirmé': return 'bg-green-100 text-green-800';
        case 'Annulé': return 'bg-red-100 text-red-800';
        case 'Terminé': return 'bg-blue-100 text-blue-800';
        case 'Programmé': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}