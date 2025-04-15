import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PatientSummary({ patients = [] }) {
    // Ensure patients is always an array
    const patientsArray = Array.isArray(patients) ? patients : [];

    // Format date helper
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'PPP', { locale: fr });
        } catch (error) {
            return 'Date inconnue';
        }
    };

    // Helper to safely get patient name
    const getPatientName = (patient) => {
        return `${patient.nom || ''} ${patient.prenom || ''}`.trim() || 'Patient sans nom';
    };

    // Helper to safely get patient language
    const getPatientLanguage = (patient) => {
        if (!patient.langue) return 'Non spécifié';
        return typeof patient.langue === 'object' ? patient.langue.nom : patient.langue;
    };

    // Helper to safely get patient status
    const getPatientStatus = (patient) => {
        if (!patient.statut) return 'Actif';
        return typeof patient.statut === 'object' ? patient.statut.nom : patient.statut;
    };

    // Helper to get contact preference
    const getContactPreference = (patient) => {
        if (!patient.preferenceContact) return 'Non spécifié';
        return typeof patient.preferenceContact === 'object' ?
            patient.preferenceContact.nom : patient.preferenceContact;
    };

    return (
        <div>
            {patientsArray.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Aucun patient récent à afficher.
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {patientsArray.map((patient) => (
                        <li key={patient.id} className="py-3">
                            <Link
                                href={`/patients/${patient.id}`}
                                className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors"
                            >
                                <div className="flex-shrink-0 mr-3">
                                    <span className="h-8 w-8 rounded-full bg-[#5CB1B1]/20 flex items-center justify-center">
                                        <span className="text-[#5CB1B1] text-lg font-semibold">
                                            {(patient.prenom || patient.nom || '?').charAt(0)}
                                        </span>
                                    </span>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between">
                                        <div className="text-sm font-medium text-gray-900">
                                            {getPatientName(patient)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {patient.dateCreation ? formatDate(patient.dateCreation) : ''}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        <div className="flex flex-col">
                                            {patient.email && (
                                                <span>{patient.email}</span>
                                            )}
                                            {patient.telephone && (
                                                <span>{patient.telephone}</span>
                                            )}
                                            <span>
                                                <span className="font-medium">Langue:</span> {getPatientLanguage(patient)}
                                            </span>
                                            <span>
                                                <span className="font-medium">Contact:</span> {getContactPreference(patient)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}