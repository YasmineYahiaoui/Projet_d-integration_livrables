// /components/doctors/MedicalNoteForm.js
'use client';

import { useState } from 'react';

export default function MedicalNoteForm({ onSubmit, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        contenu: initialData.contenu || '',
        prive: initialData.prive || false,
        rendezVousId: initialData.rendezVousId || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.contenu.trim()) {
            setError('Le contenu de la note est requis');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await onSubmit(formData);
        } catch (error) {
            setError('Erreur lors de l\'enregistrement de la note');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
                {initialData.id ? 'Modifier la note médicale' : 'Nouvelle note médicale'}
            </h3>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="contenu" className="block text-sm font-medium text-gray-700">
                    Contenu de la note <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="contenu"
                    name="contenu"
                    rows={6}
                    value={formData.contenu}
                    onChange={handleChange}
                    className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                    placeholder="Saisissez vos observations médicales ici..."
                    required
                ></textarea>
            </div>

            <div className="flex items-center">
                <input
                    id="prive"
                    name="prive"
                    type="checkbox"
                    checked={formData.prive}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                />
                <label htmlFor="prive" className="ml-2 block text-sm text-gray-700">
                    Note privée (visible uniquement par le personnel médical)
                </label>
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