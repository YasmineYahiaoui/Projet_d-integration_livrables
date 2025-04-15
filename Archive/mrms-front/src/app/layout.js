import '../styles/globals.css';
import { Inter } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'MRMS - Système de Gestion de Dossiers Médicaux',
    description: 'Application de gestion de dossiers médicaux et rendez-vous',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    );
}