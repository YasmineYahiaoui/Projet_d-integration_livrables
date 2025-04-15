// /app/medecin/rendez-vous/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import doctorService from '@/services/doctorService';
import { useUI } from '@/contexts/UIContext';
import { PlusIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState({
        date: '',
        statut: ''
    });
    const { addToast } = useUI();

    useEffect(() => {
        fetchAppointments();
    }, [currentPage, filter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...filter
            };

            const response = await doctorService.getMyAppointments(params);
            setAppointments(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Erreur lors du chargement des rendez-vous'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilter({
            date: '',
            statut: ''
        });
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmé': return 'bg-green-100 text-green-800';
            case 'Annulé': return 'bg-red-100 text-red-800';
            case 'Terminé': return 'bg-blue-100 text-blue-800';
            case 'Programmé': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Mes rendez-vous</h1>
                <Link
                    href="/medecin/rendez-vous/nouveau"
                    className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494]"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Nouveau rendez-vous
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={filter.date}
                                    onChange={handleFilterChange}
                                    className="focus:ring-[#5CB1B1] focus:border-[#5CB1B1] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
                                Statut
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="statut"
                                    name="statut"
                                    value={filter.statut}
                                    onChange={handleFilterChange}
                                    className="focus:ring-[#5CB1B1] focus:border-[#5CB1B1] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="Programmé">Programmé</option>
                                    <option value="Confirmé">Confirmé</option>
                                    <option value="Terminé">Terminé</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">Aucun rendez-vous trouvé</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Heure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.date && format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.heure}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.patient?.nom} {appointment.patient?.prenom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.patient?.telephone || 'Pas de téléphone'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {appointment.type || 'Consultation'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.duree} min
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getStatusColor(appointment.statut?.nom || appointment.statutNom)
                        }`}>
                          {appointment.statut?.nom || appointment.statutNom || 'Programmé'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/medecin/rendez-vous/${appointment.id}`} className="text-[#5CB1B1] hover:text-[#4A9494] mr-3">
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

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