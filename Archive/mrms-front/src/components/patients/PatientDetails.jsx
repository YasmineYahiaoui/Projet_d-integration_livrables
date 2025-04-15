import { useAuth } from '@/hooks/useAuth';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    LanguageIcon,
    IdentificationIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function PatientDetails({ patient }) {
    const { estMedecin } = useAuth();

    // Format date au format français
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifié';

        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Informations du patient</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informations personnelles */}
                <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">Informations personnelles</h3>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Nom complet</p>
                                <p className="text-sm text-gray-500">{patient.nom} {patient.prenom}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-500">{patient.email || 'Non spécifié'}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <PhoneIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Téléphone</p>
                                <p className="text-sm text-gray-500">{patient.telephone || 'Non spécifié'}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <IdentificationIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Date de naissance</p>
                                <p className="text-sm text-gray-500">{patient.dateNaissance ? formatDate(patient.dateNaissance) : 'Non spécifiée'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Préférences */}
                <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">Préférences et informations supplémentaires</h3>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <LanguageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Langue préférée</p>
                                <p className="text-sm text-gray-500">{patient.langue ? patient.langue.nom : 'Non spécifiée'}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Préférence de contact</p>
                                <p className="text-sm text-gray-500">{patient.preferenceContact ? patient.preferenceContact.nom : 'Non spécifiée'}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Type de patient</p>
                                <p className="text-sm text-gray-500">{patient.typePatient ? patient.typePatient.nom : 'Non spécifié'}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Date d'inscription</p>
                                <p className="text-sm text-gray-500">{formatDate(patient.dateCreation)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informations additionnelles (visible uniquement par les médecins) */}
            {estMedecin && estMedecin() && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Informations médicales</h3>

                    <div className="bg-yellow-50 rounded-md p-4">
                        <p className="text-sm text-yellow-800 italic">
                            Note: Les informations affichées dans cette section sont uniquement visibles par les médecins.
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Allergies connues</p>
                        <p className="text-sm text-gray-500">
                            {patient.allergies || 'Aucune allergie connue'}
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Antécédents médicaux</p>
                        <p className="text-sm text-gray-500">
                            {patient.antecedentsMedicaux || 'Aucun antécédent médical enregistré'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}