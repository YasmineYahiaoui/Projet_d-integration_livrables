// /app/medecin/patients/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import doctorService from '@/services/doctorService';
import PatientsList from '@/components/doctors/PatientsList';
import { useUI } from '@/contexts/UIContext';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToast } = useUI();

    useEffect(() => {
        fetchPatients();
    }, [currentPage]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm
            };

            const response = await doctorService.getMyPatients(params);
            setPatients(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Erreur lors du chargement des patients'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchPatients();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Mes patients</h1>
                <Link
                    href="/medecin/patients/nouveau"
                    className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Nouveau patient
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="flex">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="focus:ring-[#5CB1B1] focus:border-[#5CB1B1] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Rechercher un patient..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#5CB1B1] hover:bg-[#4A9494]"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                    </div>
                ) : (
                    <>
                        <PatientsList patients={patients} />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                                <div className="flex-1 flex justify-between">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Précédent
                                    </button>
                                    <span className="text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}