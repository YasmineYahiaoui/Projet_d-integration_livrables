'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import PatientAppointmentsList from '@/components/patient/PatientAppointmentsList';
import { CalendarIcon, ClipboardIcon, UserIcon } from '@heroicons/react/24/outline';

export default function PatientDashboard() {
    const [userData, setUserData] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, appointmentsRes] = await Promise.all([
                    api.get('/api/patient/mon-profil'),
                    api.get('/api/patient/mes-rendez-vous')
                ]);

                setUserData(profileRes.data);

                // Filter upcoming appointments
                const now = new Date();
                const upcoming = appointmentsRes.data.filter(appt => {
                    const apptDate = new Date(`${appt.date}T${appt.heure}`);
                    return apptDate > now && appt.statut?.nom !== 'Annulé';
                });

                setUpcomingAppointments(upcoming);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Patient Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatsCard
                    title="Prochains RDV"
                    value={upcomingAppointments.length}
                    icon={CalendarIcon}
                    linkTo="/patient/rendez-vous"
                />
                <StatsCard
                    title="Mon Dossier"
                    value="Consulter"
                    icon={ClipboardIcon}
                    linkTo="/patient/dossier-medical"
                />
                <StatsCard
                    title="Mon Profil"
                    value="Gérer"
                    icon={UserIcon}
                    linkTo="/patient/profil"
                />
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Prochains rendez-vous</h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : (
                        <PatientAppointmentsList rendezVous={upcomingAppointments} limit={5} />
                    )}
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, linkTo }) {
    return (
        <a href={linkTo} className="bg-white rounded-lg shadow p-5 transition hover:shadow-md">
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#5CB1B1]/10 text-[#5CB1B1]">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-lg font-semibold">{value}</p>
                </div>
            </div>
        </a>
    );
}