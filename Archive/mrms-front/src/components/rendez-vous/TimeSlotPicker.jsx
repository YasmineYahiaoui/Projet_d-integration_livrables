import { useState, useEffect } from 'react';
import { format, parse, compareAsc } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TimeSlotPicker({ timeSlots = [], selectedTime, onSelectTimeSlot }) {
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [filteredSlots, setFilteredSlots] = useState([]);

    // Generate default time slots if none are provided
    const getDefaultTimeSlots = () => {
        const defaultSlots = [];
        for (let hour = 8; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                defaultSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            }
        }
        return defaultSlots;
    };

    // Process and sort time slots when component mounts or timeSlots changes
    useEffect(() => {
        // Use provided slots or generate defaults if empty
        const slots = Array.isArray(timeSlots) && timeSlots.length > 0
            ? timeSlots
            : getDefaultTimeSlots();

        // Sort the slots by time
        const sortedSlots = [...slots].sort((a, b) => {
            try {
                const timeA = parse(a, 'HH:mm', new Date());
                const timeB = parse(b, 'HH:mm', new Date());
                return compareAsc(timeA, timeB);
            } catch (error) {
                console.error('Error parsing time:', error);
                return 0;
            }
        });

        // Filter by selected period
        filterSlotsByPeriod(sortedSlots, selectedPeriod);
    }, [timeSlots]);

    // Filter slots when period changes
    useEffect(() => {
        // Use provided slots or defaults
        const slots = Array.isArray(timeSlots) && timeSlots.length > 0
            ? timeSlots
            : getDefaultTimeSlots();

        filterSlotsByPeriod(slots, selectedPeriod);
    }, [selectedPeriod, timeSlots]);

    // Helper function to filter time slots by period
    const filterSlotsByPeriod = (slots, period) => {
        if (!Array.isArray(slots)) {
            setFilteredSlots([]);
            return;
        }

        const filtered = slots.filter(timeSlot => {
            try {
                const hourParts = timeSlot.split(':');
                if (hourParts.length < 2) return true;

                const hour = parseInt(hourParts[0], 10);

                if (period === 'morning') {
                    return hour >= 8 && hour < 12;
                } else if (period === 'afternoon') {
                    return hour >= 12 && hour < 17;
                } else if (period === 'evening') {
                    return hour >= 17 && hour <= 20;
                }

                return true;
            } catch (error) {
                console.error('Error filtering time slot:', error);
                return true;
            }
        });

        setFilteredSlots(filtered);
    };

    // Gérer le clic sur un créneau
    const handleTimeSlotClick = (timeSlot) => {
        if (onSelectTimeSlot) {
            onSelectTimeSlot(timeSlot);
        }
    };

    // Check if there are any time slots (either provided or defaults)
    const hasTimeSlots = Array.isArray(timeSlots) && timeSlots.length > 0;
    const messageText = hasTimeSlots
        ? "Sélectionnez un créneau horaire."
        : "Aucun créneau n'est disponible pour cette date. Les créneaux par défaut sont affichés, mais leur disponibilité n'est pas garantie.";

    return (
        <div className="space-y-4">
            {/* Message about time slots */}
            <div className={`p-3 rounded-md ${hasTimeSlots ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                <p className="text-sm">{messageText}</p>
            </div>

            {/* Filtres par période */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSelectedPeriod('all')}
                    className={`px-3 py-1 text-sm rounded-full ${
                        selectedPeriod === 'all'
                            ? 'bg-[#5CB1B1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Tous
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedPeriod('morning')}
                    className={`px-3 py-1 text-sm rounded-full ${
                        selectedPeriod === 'morning'
                            ? 'bg-[#5CB1B1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Matin (8h-12h)
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedPeriod('afternoon')}
                    className={`px-3 py-1 text-sm rounded-full ${
                        selectedPeriod === 'afternoon'
                            ? 'bg-[#5CB1B1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Après-midi (12h-17h)
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedPeriod('evening')}
                    className={`px-3 py-1 text-sm rounded-full ${
                        selectedPeriod === 'evening'
                            ? 'bg-[#5CB1B1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Soir (après 17h)
                </button>
            </div>

            {/* Grille des créneaux */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {filteredSlots.map(timeSlot => (
                    <button
                        key={timeSlot}
                        type="button"
                        onClick={() => handleTimeSlotClick(timeSlot)}
                        className={`p-2 text-center rounded-md text-sm font-medium ${
                            selectedTime === timeSlot
                                ? 'bg-[#5CB1B1] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {timeSlot}
                    </button>
                ))}
            </div>

            {filteredSlots.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                    Aucun créneau disponible pour cette période. Veuillez sélectionner une autre période.
                </p>
            )}
        </div>
    );
}