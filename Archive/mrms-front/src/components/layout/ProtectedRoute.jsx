'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ProtectedRoute({ children, titre, roles = [] }) {
    const { estAuthentifie, chargement, utilisateur } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Vérifier l'authentification et les permissions
    useEffect(() => {
        if (!chargement) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
            if (!estAuthentifie) {
                router.push('/');
                return;
            }

            // Vérifier les rôles si spécifiés
            if (roles.length > 0 && utilisateur) {
                const estAutorise = roles.includes(utilisateur.role);
                if (!estAutorise) {
                    // Rediriger vers le tableau de bord si l'utilisateur n'a pas le rôle requis
                    router.push('/tableau-bord');
                }
            }
        }
    }, [chargement, estAuthentifie, router, roles, utilisateur, pathname]);

    // Afficher un indicateur de chargement
    if (chargement) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CB1B1]"></div>
            </div>
        );
    }

    // Si l'utilisateur n'est pas authentifié, ne rien afficher pendant la redirection
    if (!estAuthentifie) {
        return null;
    }

    // Générer le titre de la page en fonction du chemin si non fourni
    const titreGenerique = () => {
        if (pathname === '/tableau-bord') return 'Tableau de bord';
        if (pathname.startsWith('/patients')) return 'Gestion des patients';
        if (pathname.startsWith('/rendez-vous')) return 'Gestion des rendez-vous';
        if (pathname.startsWith('/parametres')) return 'Paramètres';
        if (pathname.startsWith('/faq')) return 'FAQ';
        return 'MRMS';
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col h-full">
                <Header titre={titre || titreGenerique()} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}