import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import appointmentService from '@/services/appointmentService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AppointmentList({ rendezVous = [], pagination, onPageChange, onDelete }) {
    // Ensure rendezVous is always an array and handle the backend structure correctly
    const appointmentsArray = Array.isArray(rendezVous)
        ? rendezVous
        : (rendezVous.rendezvous ? rendezVous.rendezvous : []);

    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [recherche, setRecherche] = useState('');
    const [filtreStatut, setFiltreStatut] = useState('');
    const [filtreDate, setFiltreDate] = useState('');

    // Formater la date pour l'affichage
    const formaterDate = (dateString, heureString) => {
        try {
            // Handle different date formats
            // If we have separate date and time fields
            if (heureString) {
                const date = new Date(`${dateString}T${heureString}`);
                return format(date, 'PPPpp', { locale: fr });
            }
            // If we have a combined date time string
            const date = new Date(dateString);
            return format(date, 'PPPpp', { locale: fr });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date invalide';
        }
    };

    // Gérer la recherche
    const handleSearch = (e) => {
        e.preventDefault();

        const filtres = {
            search: recherche,
            status: filtreStatut,
            date: filtreDate
        };

        if (onPageChange) {
            onPageChange(1, filtres);
        }
    };

    // Obtenir la couleur du statut
    const getStatusColor = (statut) => {
        switch (statut) {
            case 'Confirmé':
                return 'bg-green-100 text-green-800';
            case 'Annulé':
                return 'bg-red-100 text-red-800';
            case 'Terminé':
                return 'bg-purple-100 text-purple-800';
            case 'Programmé':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div>
            {/* Filtres */}
            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Rechercher un patient..."
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        <div className="md:w-48">
                            <select
                                value={filtreStatut}
                                onChange={(e) => setFiltreStatut(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="Programmé">Programmé</option>
                                <option value="Confirmé">Confirmé</option>
                                <option value="Annulé">Annulé</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>

                        <div className="md:w-48">
                            <input
                                type="date"
                                value={filtreDate}
                                onChange={(e) => setFiltreDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                            >
                                Filtrer
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Liste des rendez-vous */}
            {chargement ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                </div>
            ) : erreur ? (
                <div className="p-6 text-center">
                    <p className="text-red-500">{erreur}</p>
                    <button
                        onClick={() => onPageChange && onPageChange(1)}
                        className="mt-4 px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            ) : appointmentsArray.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-gray-500">Aucun rendez-vous trouvé.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patient
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date et heure
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
                        {appointmentsArray.map((rdv) => (
                            <tr key={rdv.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {rdv.client
                                                ? `${rdv.client.nom || ''} ${rdv.client.prenom || ''}`
                                                : (rdv.patient && `${rdv.patient.nom || ''} ${rdv.patient.prenom || ''}`)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {rdv.dateHeure
                                            ? formaterDate(rdv.dateHeure)
                                            : formaterDate(rdv.date, rdv.heure)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{rdv.type || 'Non spécifié'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(rdv.statut?.nom || rdv.statut)}`}>
                                        {rdv.statut?.nom || rdv.statut || 'Programmé'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/rendez-vous/${rdv.id}`}
                                        className="text-[#5CB1B1] hover:text-[#4A9494] mr-3"
                                    >
                                        Voir
                                    </Link>
                                    <Link
                                        href={`/rendez-vous/${rdv.id}/modifier`}
                                        className="text-[#5CB1B1] hover:text-[#4A9494]"
                                    >
                                        Modifier
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!chargement && !erreur && pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
                        à{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
                        </span>{' '}
                        sur <span className="font-medium">{pagination.totalItems}</span> rendez-vous
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`px-3 py-1 rounded ${
                                pagination.page === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-[#5CB1B1] hover:bg-[#5CB1B1]/10'
                            }`}
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className={`px-3 py-1 rounded ${
                                pagination.page === pagination.totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-[#5CB1B1] hover:bg-[#5CB1B1]/10'
                            }`}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
/*Modification version 1.1.1 */
