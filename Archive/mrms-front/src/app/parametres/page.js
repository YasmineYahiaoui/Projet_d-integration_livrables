'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import NotificationSettings from '@/components/parametres/NotificationSettings';
import AppointmentSettings from '@/components/parametres/AppointmentSettings';
import ProfileSettings from '@/components/parametres/ProfileSettings';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
    const { estAdmin } = useAuth();
    const [ongletActif, setOngletActif] = useState('profil');

    // Onglets disponibles
    const onglets = [
        { id: 'profil', label: 'Profil', acces: true },
        { id: 'rendezVous', label: 'Rendez-vous', acces: estAdmin() },
        { id: 'notifications', label: 'Notifications', acces: estAdmin() }
    ];

    // Filtrer les onglets selon les permissions
    const ongletsDisponibles = onglets.filter(onglet => onglet.acces);

    return (
        <ProtectedRoute titre="Paramètres">
            <div className="space-y-6">
                {/* Navigation par onglets */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            {ongletsDisponibles.map((onglet) => (
                                <button
                                    key={onglet.id}
                                    onClick={() => setOngletActif(onglet.id)}
                                    className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                                        ongletActif === onglet.id
                                            ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {onglet.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Contenu de l'onglet */}
                    <div className="p-6">
                        {ongletActif === 'profil' && <ProfileSettings />}
                        {ongletActif === 'rendezVous' && estAdmin() && <AppointmentSettings />}
                        {ongletActif === 'notifications' && estAdmin() && <NotificationSettings />}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}