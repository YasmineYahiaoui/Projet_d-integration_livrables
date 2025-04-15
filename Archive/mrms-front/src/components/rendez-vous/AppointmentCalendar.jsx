'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth,
    isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import appointmentService from '@/services/appointmentService';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Alert from '@/components/common/Alert';

export default function AppointmentCalendar({ onSelectDate, onSelectAppointment }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Charger les rendez-vous pour le mois en cours
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
                const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

                const params = {
                    dateDebut: startDate,
                    dateFin: endDate
                };

                const response = await appointmentService.getAppointments(params);
                // Ensure we have an array
                const appointmentsData = response?.data || [];
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Erreur lors du chargement des rendez-vous:', error);
                setError(error.userMessage || 'Impossible de charger les rendez-vous pour ce mois.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [currentMonth]);

    // Naviguer au mois précédent
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Naviguer au mois suivant
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // Formater l'en-tête du calendrier
    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Mois précédent"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h2>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Mois suivant"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        );
    };

    // Formater les noms des jours de la semaine
    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Lundi comme premier jour

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="py-2 text-center text-sm font-medium text-gray-500">
                    {format(addDays(startDate, i), 'EEEEEE', { locale: fr })}
                </div>
            );
        }

        return <div className="grid grid-cols-7">{days}</div>;
    };

    // Vérifier si une date a des rendez-vous
    const hasAppointments = (day) => {
        // Ensure appointments is an array
        const appointmentsArray = Array.isArray(appointments) ? appointments : [];

        return appointmentsArray.some(appointment => {
            try {
                // Handle different date formats
                const appointmentDate = appointment.dateHeure
                    ? new Date(appointment.dateHeure)
                    : appointment.date
                        ? new Date(appointment.date + 'T' + (appointment.heure || '00:00'))
                        : null;

                if (!appointmentDate) return false;
                return isSameDay(appointmentDate, day);
            } catch (error) {
                console.error('Error processing appointment date:', error);
                return false;
            }
        });
    };

    // Récupérer les rendez-vous pour une date donnée
    const getAppointmentsForDay = (day) => {
        // Ensure appointments is an array
        const appointmentsArray = Array.isArray(appointments) ? appointments : [];

        return appointmentsArray.filter(appointment => {
            try {
                // Handle different date formats
                const appointmentDate = appointment.dateHeure
                    ? new Date(appointment.dateHeure)
                    : appointment.date
                        ? new Date(appointment.date + 'T' + (appointment.heure || '00:00'))
                        : null;

                if (!appointmentDate) return false;
                return isSameDay(appointmentDate, day);
            } catch (error) {
                console.error('Error filtering appointment by date:', error);
                return false;
            }
        });
    };

    // Formater les cellules des jours
    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi comme premier jour
        const endDate = endOfMonth(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const formattedDate = format(day, 'd');
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const dayAppointments = getAppointmentsForDay(day);
                const hasEvents = hasAppointments(day);

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[80px] p-1 border border-gray-200 ${
                            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                        } ${isToday ? 'bg-blue-50' : ''} ${
                            isSelected ? 'bg-[#5CB1B1]/10' : ''
                        }`}
                        onClick={() => {
                            setSelectedDate(cloneDay);
                            if (onSelectDate) onSelectDate(cloneDay);
                        }}
                    >
                        <div className="flex justify-between">
                            <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                                {formattedDate}
                            </span>
                            {hasEvents && (
                                <span className="h-2 w-2 rounded-full bg-[#5CB1B1]"></span>
                            )}
                        </div>
                        <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
                            {dayAppointments.slice(0, 2).map((appointment, index) => {
                                try {
                                    // Get time from appointment
                                    const appointmentTime = appointment.dateHeure
                                        ? format(new Date(appointment.dateHeure), 'HH:mm')
                                        : appointment.heure || 'N/A';

                                    // Get patient name
                                    const patientName = appointment.patient
                                        ? `${appointment.patient.nom || ''} ${appointment.patient.prenom || ''}`.trim() || 'Patient'
                                        : 'Patient';

                                    return (
                                        <div
                                            key={appointment.id || `appt-${index}-${Math.random()}`}
                                            className="px-1 py-0.5 text-xs truncate rounded bg-[#5CB1B1]/20 cursor-pointer hover:bg-[#5CB1B1]/30"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onSelectAppointment) onSelectAppointment(appointment);
                                            }}
                                        >
                                            {appointmentTime} - {patientName}
                                        </div>
                                    );
                                } catch (error) {
                                    console.error('Error rendering appointment:', error);
                                    return null;
                                }
                            })}
                            {dayAppointments.length > 2 && (
                                <div className="text-xs text-gray-500 pl-1">
                                    +{dayAppointments.length - 2} de plus
                                </div>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7">
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-1">{rows}</div>;
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            {renderHeader()}
            {renderDays()}

            {error && (
                <Alert
                    variant="error"
                    message={error}
                    className="my-4"
                    closable
                    onClose={() => setError(null)}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                </div>
            ) : (
                renderCells()
            )}
        </div>
    );
}