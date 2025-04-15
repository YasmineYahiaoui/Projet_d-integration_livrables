'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppointmentList from '@/components/rendez-vous/AppointmentList';
import AppointmentCalendar from '@/components/rendez-vous/AppointmentCalendar';
import { useAppointments } from '@/hooks/useAppointments';
import { PlusIcon, CalendarIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export default function AppointmentsPage() {
    const {
        appointments,
        pagination,
        loading,
        error,
        getAppointments,
        deleteAppointment
    } = useAppointments();

    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        date: ''
    });

    // Charger les rendez-vous
    useEffect(() => {
        getAppointments(currentPage, filters);
    }, [currentPage, getAppointments]);

    // Gérer le changement de page
    const handlePageChange = (page, newFilters = null) => {
        setCurrentPage(page);
        if (newFilters) {
            setFilters(prev => ({
                ...prev,
                ...newFilters
            }));
        }
    };

    // Gérer la suppression
    const handleDelete = async (id) => {
        await deleteAppointment(id);
        // Recharger la liste
        getAppointments(currentPage, filters);
    };

    // Gérer la sélection d'une date dans le calendrier
    const handleDateSelect = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setFilters(prev => ({
            ...prev,
            date: formattedDate
        }));
        getAppointments(1, { ...filters, date: formattedDate });
    };

    // Gérer la sélection d'un rendez-vous dans le calendrier
    const handleAppointmentSelect = (appointment) => {
        // Redirection vers la page de détail du rendez-vous
        window.location.href = `/rendez-vous/${appointment.id}`;
    };

    return (
        <ProtectedRoute titre="Rendez-vous">
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Gestion des rendez-vous
                    </h1>
                    <div className="flex space-x-3">
                        <div className="bg-white rounded-md shadow p-1 flex">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md ${
                                    viewMode === 'list'
                                        ? 'bg-[#5CB1B1] text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                                title="Vue liste"
                            >
                                <TableCellsIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-md ${
                                    viewMode === 'calendar'
                                        ? 'bg-[#5CB1B1] text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                                title="Vue calendrier"
                            >
                                <CalendarIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <Link
                            href="/rendez-vous/nouveau"
                            className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Nouveau rendez-vous
                        </Link>
                    </div>
                </div>

                {/* Vue calendrier */}
                {viewMode === 'calendar' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <AppointmentCalendar
                            onSelectDate={handleDateSelect}
                            onSelectAppointment={handleAppointmentSelect}
                        />
                    </div>
                )}

                {/* Vue liste */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                <p>{error}</p>
                            </div>
                        )}

                        <AppointmentList
                            rendezVous={appointments}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}