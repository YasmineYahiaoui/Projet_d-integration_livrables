// /components/doctors/PatientsList.js
import Link from 'next/link';

export default function PatientsList({ patients, limit }) {
    // Show only the first `limit` patients if specified
    const displayedPatients = limit ? patients.slice(0, limit) : patients;

    return displayedPatients.length === 0 ? (
        <div className="text-center py-6">
            <p className="text-gray-500">Aucun patient trouvé</p>
        </div>
    ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernier RDV
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {displayedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {patient.nom} {patient.prenom}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {patient.dateNaissance ? new Date(patient.dateNaissance).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.email || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{patient.telephone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {patient.dernierRdv ? new Date(patient.dernierRdv).toLocaleDateString() : 'Aucun'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/medecin/patients/${patient.id}`} className="text-[#5CB1B1] hover:text-[#4A9494] mr-3">
                                Dossier
                            </Link>
                            <Link href={`/medecin/rendez-vous/nouveau?patientId=${patient.id}`} className="text-[#5CB1B1] hover:text-[#4A9494]">
                                RDV
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {limit && patients.length > limit && (
                <div className="px-6 py-3 bg-gray-50 text-right">
                    <Link href="/medecin/patients" className="text-[#5CB1B1] hover:text-[#4A9494] text-sm font-medium">
                        Voir tous les patients
                    </Link>
                </div>
            )}
        </div>
    );
}