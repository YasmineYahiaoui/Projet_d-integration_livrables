// /components/layout/PatientNavigation.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function PatientNavigation() {
    const pathname = usePathname();
    const { utilisateur, deconnexion } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Tableau de bord', href: '/patient/tableau-bord' },
        { name: 'Mes rendez-vous', href: '/patient/rendez-vous/nouveau' },
        { name: 'Mon dossier médical', href: '/patient/dossier-medical' },
        { name: 'Mon profil', href: '/patient/profil' },
        { name: 'FAQ', href: '/patient/faq' },
    ];

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/patient/tableau-bord" className="text-xl font-medium text-[#5CB1B1]">
                                MRMS
                            </Link>
                        </div>
                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        pathname === item.href
                                            ? 'border-[#5CB1B1] text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="ml-3 relative">
                            <div className="flex items-center">
                                <button onClick={deconnexion} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                                    Déconnexion
                                </button>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-sm font-medium text-gray-700">
                  {utilisateur?.nom} {utilisateur?.prenom}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${
                                    pathname === item.href
                                        ? 'bg-[#5CB1B1]/10 border-[#5CB1B1] text-[#5CB1B1]'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={deconnexion}
                            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}