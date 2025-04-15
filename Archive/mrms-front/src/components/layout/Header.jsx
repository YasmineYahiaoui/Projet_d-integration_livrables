'use client';

import { useAuth } from '@/hooks/useAuth';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

export default function Header({ titre }) {
    const { utilisateur, deconnexion } = useAuth();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const menuRef = useRef(null);

    // Fermer le menu si on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOuvert(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
            {/* Titre de la page */}
            <h1 className="text-xl font-semibold text-gray-800">{titre}</h1>

            {/* Actions et profil */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
                    <BellIcon className="h-6 w-6" />
                </button>

                {/* Profil */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOuvert(!menuOuvert)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                        <UserCircleIcon className="h-8 w-8 text-[#5CB1B1]" />
                        <span className="hidden md:inline-block font-medium">
              {utilisateur?.nom || 'Utilisateur'}
            </span>
                    </button>

                    {/* Menu déroulant */}
                    {menuOuvert && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <p className="font-medium">{utilisateur?.nom}</p>
                                <p className="text-gray-500">{utilisateur?.role}</p>
                            </div>
                            <a href="/parametres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Paramètres
                            </a>
                            <button
                                onClick={deconnexion}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}