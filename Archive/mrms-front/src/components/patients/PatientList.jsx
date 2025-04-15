import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import patientService from '@/services/patientService';
import { useUI } from '@/contexts/UIContext';

export default function PatientList({ patients, pagination, onPageChange, onDelete }) {
    // Ensure patients is always an array
    const patientArray = Array.isArray(patients) ? patients : [];

    const { estMedecin } = useAuth();
    const [suppressionEnCours, setSuppressionEnCours] = useState(false);
    const [patientASupprimer, setPatientASupprimer] = useState(null);
    const { addToast } = useUI();

    // Confirmation de suppression
    const confirmerSuppression = (patient) => {
        setPatientASupprimer(patient);
        setSuppressionEnCours(true);
    };

    // Annuler la suppression
    const annulerSuppression = () => {
        setPatientASupprimer(null);
        setSuppressionEnCours(false);
    };

    // Supprimer le patient
    const supprimerPatient = async () => {
        if (!patientASupprimer) return;

        try {
            await patientService.deletePatient(patientASupprimer.id);

            // Notification de succès
            addToast({
                type: 'success',
                message: `Le patient ${patientASupprimer.nom} ${patientASupprimer.prenom} a été supprimé avec succès.`
            });

            // Fermer la modale
            setSuppressionEnCours(false);
            setPatientASupprimer(null);

            // Rafraîchir la liste
            if (onDelete) onDelete(patientASupprimer.id);
        } catch (error) {
            console.error('Erreur lors de la suppression du patient:', error);
            addToast({
                type: 'error',
                message: 'Une erreur est survenue lors de la suppression du patient.'
            });
        }
    };

    // Helper to safely get a string from a possible object
    const getNameFromObjectOrString = (obj) => {
        if (!obj) return 'Non spécifié';
        if (typeof obj === 'string') return obj;
        if (obj.nom) return obj.nom;
        return 'Non spécifié';
    };

    // Si aucun patient
    if (patientArray.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Aucun patient trouvé.</p>
                <Link
                    href="/patients/nouveau"
                    className="inline-flex items-center px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors"
                >
                    Ajouter un patient
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Langue
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {patientArray.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {patient.nom} {patient.prenom}
                                        </div>
                                        {estMedecin && estMedecin() && patient.noteMedecin && (
                                            <div className="text-xs text-gray-500 italic">
                                                A des notes médicales
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{patient.email}</div>
                                <div className="text-sm text-gray-500">{patient.telephone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {getNameFromObjectOrString(patient.typePatient)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getNameFromObjectOrString(patient.langue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/patients/${patient.id}`}
                                    className="text-[#5CB1B1] hover:text-[#4A9494] mr-4"
                                >
                                    Voir
                                </Link>
                                <Link
                                    href={`/patients/${patient.id}/modifier`}
                                    className="text-[#5CB1B1] hover:text-[#4A9494] mr-4"
                                    title="Modifier"
                                >
                                    <PencilIcon className="h-5 w-5 inline" />
                                </Link>
                                <button
                                    onClick={() => confirmerSuppression(patient)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Supprimer"
                                >
                                    <TrashIcon className="h-5 w-5 inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
                        à{' '}
                        <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
            </span>{' '}
                        sur <span className="font-medium">{pagination.totalItems}</span> patients
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

            {/* Modal de confirmation de suppression */}
            {suppressionEnCours && patientASupprimer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirmer la suppression
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Êtes-vous sûr de vouloir supprimer le patient {patientASupprimer.nom} {patientASupprimer.prenom} ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={annulerSuppression}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={supprimerPatient}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}