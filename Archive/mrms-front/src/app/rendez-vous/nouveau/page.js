'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppointmentForm from '@/components/rendez-vous/AppointmentForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewAppointmentPage() {
    const router = useRouter();

    return (
        <ProtectedRoute titre="Nouveau rendez-vous">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100"
                        aria-label="Retour"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Créer un nouveau rendez-vous
                    </h1>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <AppointmentForm mode="creation" />
                </div>
            </div>
        </ProtectedRoute>
    );
}