'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PatientForm from '@/components/patients/PatientForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewPatientPage() {
    const router = useRouter();

    return (
        <ProtectedRoute titre="Nouveau patient">
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
                        Créer un nouveau patient
                    </h1>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <PatientForm mode="creation" />
                </div>
            </div>
        </ProtectedRoute>
    );
}