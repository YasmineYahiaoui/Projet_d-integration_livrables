'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PatientList from '@/components/patients/PatientList';
import usePatients from '@/hooks/usePatients';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function PatientsPage() {
    const {
        patients,
        pagination,
        loading,
        error,
        getPatients,
        deletePatient
    } = usePatients();

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Charger les patients avec les filtres
    useEffect(() => {
        const fetchPatients = async () => {
            const filters = {};
            if (debouncedSearch) {
                filters.search = debouncedSearch;
            }
            await getPatients(currentPage, filters);
        };

        fetchPatients();
    }, [currentPage, debouncedSearch, getPatients]);

    // Gérer la pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gérer la suppression
    const handleDelete = async (patientId) => {
        await deletePatient(patientId);
        // Recharger la liste après la suppression
        const filters = {};
        if (debouncedSearch) {
            filters.search = debouncedSearch;
        }
        await getPatients(currentPage, filters);
    };

    // Gérer la recherche
    const handleSearch = (e) => {
        e.preventDefault();
        // La recherche est déjà traitée par l'effet
    };

    return (
        <ProtectedRoute titre="Patients">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Gestion des patients
                    </h1>
                    <Link
                        href="/patients/nouveau"
                        className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nouveau patient
                    </Link>
                </div>

                {/* Recherche */}
                <div className="bg-white rounded-lg shadow p-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher un patient..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 block w-full border border-gray-300 rounded-md focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>

                {/* Liste des patients */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                        </div>
                    ) : (
                        <PatientList
                            patients={patients}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}