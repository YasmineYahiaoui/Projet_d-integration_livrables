// /components/layout/DoctorNavigation.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    HomeIcon, UsersIcon, CalendarIcon, ClockIcon, CogIcon, QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function DoctorNavigation() {
    const pathname = usePathname();
    const { utilisateur, deconnexion } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation links
    const navigation = [
        { name: 'Tableau de bord', href: '/medecin/tableau-bord', icon: HomeIcon },
        { name: 'Patients', href: '/medecin/patients', icon: UsersIcon },
        { name: 'Rendez-vous', href: '/medecin/rendez-vous', icon: CalendarIcon },
        { name: 'Disponibilités', href: '/medecin/disponibilites', icon: ClockIcon },
        { name: 'Paramètres', href: '/parametres', icon: CogIcon },
        { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden">
                <button
                    type="button"
                    className="p-2 -m-2 text-gray-500 hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Ouvrir le menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition">
                    <div className="flex justify-between items-center px-4 py-5 border-b border-gray-200">
                        <div className="text-xl font-medium text-[#5CB1B1]">MRMS</div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Fermer le menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto">
                        <div className="px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                        pathname === item.href
                                            ? 'bg-[#5CB1B1]/10 text-[#5CB1B1]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-6 w-6 ${
                                            pathname === item.href
                                                ? 'text-[#5CB1B1]'
                                                : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5">
                <div className="flex items-center px-6">
                    <div className="text-xl font-medium text-[#5CB1B1]">MRMS</div>
                </div>
                <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
                    {/* User profile */}
                    <div className="px-4 py-4 border-t border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-[#5CB1B1] flex items-center justify-center text-white font-medium">
                                    {utilisateur?.nom?.charAt(0) || 'M'}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    Dr. {utilisateur?.nom || 'Médecin'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {utilisateur?.role || 'Médecin'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Navigation */}
                    <nav className="px-3 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                    pathname === item.href
                                        ? 'bg-[#5CB1B1]/10 text-[#5CB1B1]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 ${
                                        pathname === item.href
                                            ? 'text-[#5CB1B1]'
                                            : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    {/* Logout button */}
                    <div className="px-3 mt-auto pb-4">
                        <button
                            onClick={deconnexion}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                        >
                            <svg className="mr-3 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}