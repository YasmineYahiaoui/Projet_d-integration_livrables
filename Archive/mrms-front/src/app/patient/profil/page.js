// /app/patient/profil/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import patientService from '@/services/patientService';
import { useUI } from '@/contexts/UIContext';

export default function PatientProfilePage() {
    const router = useRouter();
    const { addToast } = useUI();

    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        dateNaissance: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await patientService.getMyProfile();
                console.log('API profile data:', data);

                setUserData(data);

                // Accéder aux données du client depuis l'objet client
                setFormData({
                    nom: data.client?.nom || '',
                    prenom: data.client?.prenom || '',
                    email: data.client?.email || '',
                    telephone: data.client?.telephone || '',
                    dateNaissance: data.dateNaissance || ''
                });
            } catch (error) {
                console.error('Profile fetch error:', error);
                addToast({
                    type: 'error',
                    message: error.userMessage || 'Erreur lors du chargement de votre profil'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [addToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            await patientService.updateMyProfile(formData);

            addToast({
                type: 'success',
                message: 'Profil mis à jour avec succès'
            });
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.userMessage || 'Erreur lors de la mise à jour du profil');
            addToast({
                type: 'error',
                message: error.userMessage || 'Erreur lors de la mise à jour du profil'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Informations personnelles</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="px-4 py-3 bg-red-50 text-red-500 text-sm rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            id="prenom"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            id="nom"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        id="telephone"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        id="dateNaissance"
                                        name="dateNaissance"
                                        value={formData.dateNaissance}
                                        onChange={handleChange}
                                        className="mt-1 block w-full shadow-sm focus:ring-[#5CB1B1] focus:border-[#5CB1B1] sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#5CB1B1] hover:bg-[#4A9494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5CB1B1] disabled:opacity-50"
                                    >
                                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}