'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    ChartPieIcon,
    UserGroupIcon,
    CalendarIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const pathname = usePathname();
    const { deconnexion, estAdmin, estMedecin } = useAuth();
    const [estOuvert, setEstOuvert] = useState(false);

    const toggleSidebar = () => {
        setEstOuvert(!estOuvert);
    };

    const liens = [
        {
            nom: 'Tableau de bord',
            href: '/tableau-bord',
            icone: ChartPieIcon,
            acces: true // Tous les utilisateurs
        },
        {
            nom: 'Patients',
            href: '/patients',
            icone: UserGroupIcon,
            acces: true // Tous les utilisateurs
        },
        {
            nom: 'Rendez-vous',
            href: '/rendez-vous',
            icone: CalendarIcon,
            acces: true // Tous les utilisateurs
        },
        {
            nom: 'Paramètres',
            href: '/parametres',
            icone: Cog6ToothIcon,
            acces: true // Tous les utilisateurs
        },
        {
            nom: 'FAQ',
            href: '/faq',
            icone: QuestionMarkCircleIcon,
            acces: true // Tous les utilisateurs
        }
    ];

    // Filtrer les liens en fonction du rôle
    const liensFiltres = liens.filter(lien => lien.acces);

    return (
        <>
            {/* Bouton hamburger pour mobile */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
                onClick={toggleSidebar}
            >
                {estOuvert ? (
                    <XMarkIcon className="h-6 w-6 text-[#5CB1B1]" />
                ) : (
                    <Bars3Icon className="h-6 w-6 text-[#5CB1B1]" />
                )}
            </button>

            {/* Overlay pour mobile */}
            {estOuvert && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
                    estOuvert ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 w-64 bg-[#5CB1B1] text-white`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center py-6 border-b border-white/20">
                        <h1 className="text-2xl font-bold">MRMS</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <ul className="space-y-2">
                            {liensFiltres.map((lien) => {
                                const Icon = lien.icone;
                                const actif = pathname === lien.href;

                                return (
                                    <li key={lien.href}>
                                        <Link
                                            href={lien.href}
                                            className={`flex items-center px-4 py-3 rounded-lg ${
                                                actif
                                                    ? 'bg-white text-[#5CB1B1]'
                                                    : 'text-white hover:bg-[#4A9494]'
                                            } transition-colors`}
                                            onClick={() => setEstOuvert(false)}
                                        >
                                            <Icon className="h-5 w-5 mr-3" />
                                            <span>{lien.nom}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Déconnexion */}
                    <div className="p-4 border-t border-white/20">
                        <button
                            onClick={deconnexion}
                            className="flex items-center px-4 py-3 w-full rounded-lg text-white hover:bg-[#4A9494] transition-colors"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}