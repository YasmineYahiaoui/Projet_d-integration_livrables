'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useUI } from '@/contexts/UIContext';

export default function MedicalNotesEditor({ patientId, appointmentId, existingNote, onNoteSaved }) {
    const [formData, setFormData] = useState({
        contenu: existingNote?.contenu || '',
        diagnostic: existingNote?.diagnostic || '',
        traitement: existingNote?.traitement || '',
        prive: existingNote?.prive || false
    });

    const [loading, setLoading] = useState(false);
    const { addToast } = useUI();

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
            addToast({
                type: 'error',
                message: 'Le contenu de la note est requis'
            });
            return;
        }

        try {
            setLoading(true);

            const endpoint = appointmentId
                ? `/api/medecin/rendez-vous/${appointmentId}/notes`
                : `/api/medecin/patients/${patientId}/notes`;

            const response = await api.post(endpoint, formData);

            addToast({
                type: 'success',
                message: 'Note médicale enregistrée avec succès'
            });

            if (onNoteSaved) {
                onNoteSaved(response.data.noteMedicale);
            }

            // Clear form if it's a new note
            if (!existingNote) {
                setFormData({
                    contenu: '',
                    diagnostic: '',
                    traitement: '',
                    prive: false
                });
            }
        } catch (error) {
            console.error('Error saving medical note:', error);
            addToast({
                type: 'error',
                message: 'Erreur lors de l\'enregistrement de la note médicale'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
                    Note médicale <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="contenu"
                    name="contenu"
                    rows={4}
                    value={formData.contenu}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    placeholder="Observations, symptômes, etc."
                />
            </div>

            <div>
                <label htmlFor="diagnostic" className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnostic
                </label>
                <input
                    type="text"
                    id="diagnostic"
                    name="diagnostic"
                    value={formData.diagnostic}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                />
            </div>

            <div>
                <label htmlFor="traitement" className="block text-sm font-medium text-gray-700 mb-1">
                    Traitement prescrit
                </label>
                <textarea
                    id="traitement"
                    name="traitement"
                    rows={3}
                    value={formData.traitement}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                    placeholder="Médicaments, posologie, recommandations..."
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="prive"
                    name="prive"
                    checked={formData.prive}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                />
                <label htmlFor="prive" className="ml-2 block text-sm text-gray-900">
                    Note privée (non visible par le patient)
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer la note'}
                </button>
            </div>
        </form>
    );
}