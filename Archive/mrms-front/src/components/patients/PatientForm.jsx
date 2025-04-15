import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import patientService from '@/services/patientService';

export default function PatientForm({ patient, mode = 'creation' }) {
    const router = useRouter();
    const { estMedecin } = useAuth();
    const isEditing = mode === 'edition';

    // État pour les données du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        dateNaissance: '',
        typePatient: '',
        langue: '',
        preferenceContact: '',
        noteMedecin: '',
        allergies: '',
        antecedentsMedicaux: ''
    });

    // Chargement des données du patient pour l'édition
    useEffect(() => {
        if (isEditing && patient) {
            setFormData({
                nom: patient.nom || '',
                prenom: patient.prenom || '',
                email: patient.email || '',
                telephone: patient.telephone || '',
                dateNaissance: patient.dateNaissance ? new Date(patient.dateNaissance).toISOString().split('T')[0] : '',
                typePatient: patient.typePatient || '',
                langue: patient.langue || '',
                preferenceContact: patient.preferenceContact || '',
                noteMedecin: patient.noteMedecin || '',
                allergies: patient.allergies || '',
                antecedentsMedicaux: patient.antecedentsMedicaux || ''
            });
        }
    }, [patient, isEditing]);

    // États pour les données de référence
    const [typesPatient, setTypesPatient] = useState([]);
    const [langues, setLangues] = useState([]);
    const [preferencesContact, setPreferencesContact] = useState([]);

    // États pour la gestion du formulaire
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [validation, setValidation] = useState({});

    // Charger les données de référence
    useEffect(() => {
        const chargerDonneesReference = async () => {
            try {
                const [typesResponse, languesResponse, preferencesResponse] = await Promise.all([
                    patientService.getPatientTypes(),
                    patientService.getLanguages(),
                    patientService.getContactPreferences()
                ]);

                setTypesPatient(typesResponse);
                setLangues(languesResponse);
                setPreferencesContact(preferencesResponse);
            } catch (error) {
                console.error('Erreur lors du chargement des données de référence:', error);
                setErreur('Impossible de charger certaines données. Veuillez réessayer.');
            }
        };

        chargerDonneesReference();
    }, []);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Réinitialiser l'erreur de validation pour ce champ
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Valider le formulaire
    const validerFormulaire = () => {
        const erreurs = {};

        // Validation des champs obligatoires
        if (!formData.nom.trim()) erreurs.nom = 'Le nom est requis';
        if (!formData.prenom.trim()) erreurs.prenom = 'Le prénom est requis';

        // Validation de l'email
        if (formData.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                erreurs.email = 'L\'adresse email n\'est pas valide';
            }
        }

        // Validation du téléphone (si renseigné)
        if (formData.telephone.trim()) {
            const telRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!telRegex.test(formData.telephone.trim())) {
                erreurs.telephone = 'Le numéro de téléphone n\'est pas valide';
            }
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        try {
            setChargement(true);
            setErreur('');

            if (isEditing) {
                // Mise à jour d'un patient existant
                await patientService.updatePatient(patient.id, formData);
                router.push(`/patients/${patient.id}`);
            } else {
                // Création d'un nouveau patient
                const nouveauPatient = await patientService.createPatient(formData);
                router.push(`/patients/${nouveauPatient.id}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du patient:', error);
            setErreur('Une erreur est survenue lors de l\'enregistrement du patient. Veuillez réessayer.');
        } finally {
            setChargement(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Message d'erreur général */}
            {erreur && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{erreur}</p>
                </div>
            )}

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Informations personnelles</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    validation.nom ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                            />
                            {validation.nom && (
                                <p className="mt-1 text-sm text-red-600">{validation.nom}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    validation.prenom ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                            />
                            {validation.prenom && (
                                <p className="mt-1 text-sm text-red-600">{validation.prenom}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    validation.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                            />
                            {validation.email && (
                                <p className="mt-1 text-sm text-red-600">{validation.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                id="telephone"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    validation.telephone ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                            />
                            {validation.telephone && (
                                <p className="mt-1 text-sm text-red-600">{validation.telephone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                                Date de naissance
                            </label>
                            <input
                                type="date"
                                id="dateNaissance"
                                name="dateNaissance"
                                value={formData.dateNaissance}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Préférences */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Préférences</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="typePatient" className="block text-sm font-medium text-gray-700 mb-1">
                                Type de patient
                            </label>
                            <select
                                id="typePatient"
                                name="typePatient"
                                value={formData.typePatient}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="">Sélectionner un type</option>
                                {typesPatient.map(type => (
                                    <option key={type.id} value={type.nom}>
                                        {type.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="langue" className="block text-sm font-medium text-gray-700 mb-1">
                                Langue préférée
                            </label>
                            <select
                                id="langue"
                                name="langue"
                                value={formData.langue}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="">Sélectionner une langue</option>
                                {langues.map(langue => (
                                    <option key={langue.id} value={langue.nom}>
                                        {langue.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="preferenceContact" className="block text-sm font-medium text-gray-700 mb-1">
                                Préférence de contact
                            </label>
                            <select
                                id="preferenceContact"
                                name="preferenceContact"
                                value={formData.preferenceContact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                            >
                                <option value="">Sélectionner une préférence</option>
                                {preferencesContact.map(preference => (
                                    <option key={preference.id} value={preference.nom}>
                                        {preference.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informations médicales (visible uniquement par les médecins) */}
            {estMedecin() && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-gray-900">Informations médicales</h2>
                            <div className="bg-yellow-50 rounded-full px-3 py-1 text-xs font-medium text-yellow-800">
                                Visible uniquement par les médecins
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="noteMedecin" className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes du médecin
                                </label>
                                <textarea
                                    id="noteMedecin"
                                    name="noteMedecin"
                                    value={formData.noteMedecin}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    placeholder="Notes confidentielles pour le suivi du patient"
                                />
                            </div>

                            <div>
                                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                                    Allergies connues
                                </label>
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    placeholder="Allergies du patient (médicaments, aliments, etc.)"
                                />
                            </div>

                            <div>
                                <label htmlFor="antecedentsMedicaux" className="block text-sm font-medium text-gray-700 mb-1">
                                    Antécédents médicaux
                                </label>
                                <textarea
                                    id="antecedentsMedicaux"
                                    name="antecedentsMedicaux"
                                    value={formData.antecedentsMedicaux}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    placeholder="Antécédents médicaux du patient"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    disabled={chargement}
                    className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                >
                    {chargement ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le patient'}
                </button>
            </div>
        </form>
    );
}