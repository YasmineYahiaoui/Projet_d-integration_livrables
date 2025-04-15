// /components/doctors/AvailabilityCalendar.js
'use client';

import { useState } from 'react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AvailabilityCalendar({ availabilities, onDelete }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Generate the days of the week
    const generateWeekDays = (date) => {
        const startDay = startOfWeek(date, { weekStartsOn: 1 });
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDay, i);
            weekDays.push(day);
        }

        return weekDays;
    };

    const weekDays = generateWeekDays(currentDate);

    // Group availabilities by day
    const groupAvailabilitiesByDay = () => {
        const grouped = {};

        weekDays.forEach(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            grouped[dayStr] = availabilities.filter(avail => avail.date === dayStr);
        });

        return grouped;
    };

    const groupedAvailabilities = groupAvailabilitiesByDay();

    // Navigate to previous/next week
    const previousWeek = () => {
        setCurrentDate(prevDate => addDays(prevDate, -7));
    };

    const nextWeek = () => {
        setCurrentDate(prevDate => addDays(prevDate, 7));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={previousWeek}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Semaine précédente
                </button>
                <h3 className="text-lg font-medium text-gray-900">
                    Semaine du {format(weekDays[0], 'dd MMMM', { locale: fr })}
                </h3>
                <button
                    onClick={nextWeek}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Semaine suivante
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                    <div key={day.toString()} className="text-center">
                        <div className="font-medium text-sm">
                            {format(day, 'EEEE', { locale: fr })}
                        </div>
                        <div className="text-xs text-gray-500">
                            {format(day, 'dd/MM', { locale: fr })}
                        </div>
                    </div>
                ))}

                {weekDays.map(day => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const dayAvailabilities = groupedAvailabilities[dayStr] || [];

                    return (
                        <div
                            key={dayStr}
                            className={`border rounded-md p-2 h-40 overflow-y-auto ${
                                dayAvailabilities.length > 0 ? 'border-[#5CB1B1]/30' : 'border-gray-200'
                            }`}
                        >
                            {dayAvailabilities.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                                    Non disponible
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {dayAvailabilities.map(avail => (
                                        <div
                                            key={avail.id}
                                            className="bg-[#5CB1B1]/10 rounded p-2 text-xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-[#5CB1B1]">
                                                    {avail.heureDebut} - {avail.heureFin}
                                                </div>
                                                <button
                                                    onClick={() => onDelete(avail.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {avail.recurrence !== 'aucune' && (
                                                <div className="mt-1 text-gray-500">
                                                    Récurrence: {avail.recurrence}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}