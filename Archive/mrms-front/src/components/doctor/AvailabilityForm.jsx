// /components/doctors/AvailabilityForm.js
'use client';

import { useState } from 'react';

export default function AvailabilityForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        date: '',
        heureDebut: '08:00',
        heureFin: '18:00',
        recurrence: 'aucune'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.date) {
            setError('La date est requise');
            return false;
        }

        if (!formData.heureDebut || !formData.heureFin) {
            setError('Les heures de début et de fin sont requises');
            return false;
        }

        if (formData.heureDebut >= formData.heureFin) {
            setError('L\'heure de début doit être antérieure à l\'heure de fin');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            await onSubmit(formData);
        } catch (error) {
            setError('Erreur lors de l\'enregistrement de la disponibilité');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Nouvelle disponibilité</h3>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">
                        Récurrence
                    </label>
                    <select
                        id="recurrence"
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm"
                    >
                        <option value="aucune">Aucune (jour unique)</option>
                        <option value="quotidienne">Quotidienne</option>
                        <option value="hebdomadaire">Hebdomadaire</option>
                        <option value="mensuelle">Mensuelle</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700">
                        Heure de début <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="heureDebut"
                        name="heureDebut"
                        value={formData.heureDebut}
                        onChange={handleChange}
                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700">
                        Heure de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="heureFin"
                        name="heureFin"
                        value={formData.heureFin}
                        onChange={handleChange}
                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1]"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5CB1B1] hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}