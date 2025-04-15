'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

// Create auth context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [utilisateur, setUtilisateur] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [estAuthentifie, setEstAuthentifie] = useState(false);
    const router = useRouter();

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to get stored user first
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUtilisateur(storedUser);
                    setEstAuthentifie(true);
                }

                // Verify token validity
                const isTokenValid = await authService.verifierToken();

                if (isTokenValid) {
                    try {
                        // Get fresh user data
                        const currentUser = await authService.getUtilisateurCourant();
                        setUtilisateur(currentUser);
                        setEstAuthentifie(true);
                    } catch (error) {
                        console.error("Error getting user data:", error);
                        authService.clearAuth();
                        setUtilisateur(null);
                        setEstAuthentifie(false);
                    }
                } else {
                    // Token is invalid, clear auth state
                    authService.clearAuth();
                    setUtilisateur(null);
                    setEstAuthentifie(false);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setUtilisateur(null);
                setEstAuthentifie(false);
            } finally {
                setChargement(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const connexion = async (identifiant, motDePasse) => {
        setChargement(true);

        try {
            const result = await authService.connexion(identifiant, motDePasse);
            setUtilisateur(result.utilisateur);
            setEstAuthentifie(true);
            return result;
        } catch (error) {
            console.error("Login error in context:", error);
            throw error;
        } finally {
            setChargement(false);
        }
    };

    // Logout function
    const deconnexion = async () => {
        setChargement(true);

        try {
            await authService.deconnexion();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUtilisateur(null);
            setEstAuthentifie(false);
            setChargement(false);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                utilisateur,
                estAuthentifie,
                chargement,
                connexion,
                deconnexion,
                estAdmin: () => utilisateur?.role === 'Administrateur',
                estMedecin: () => utilisateur?.role === 'Médecin',
                estPatient: () => utilisateur?.role === 'Patient',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook for easier access
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }

    return context;
}