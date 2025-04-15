import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addMinutes, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import appointmentService from '@/services/appointmentService';
import patientService from '@/services/patientService';
import TimeSlotPicker from '@/components/rendez-vous/TimeSlotPicker';
import { useUI } from '@/contexts/UIContext';

export default function AppointmentForm({ appointment, mode = 'creation' }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientIdFromUrl = searchParams.get('patientId');
    const isEditing = mode === 'edition';
    const { addToast } = useUI();

    // État pour les données du formulaire
    const [formData, setFormData] = useState({
        patientId: patientIdFromUrl || '',
        date: '',
        heure: '',
        duree: '30',
        type: '',
        notes: '',
        statut: 'Planifié',
        notifications: []
    });

    // État pour les données de référence
    const [patients, setPatients] = useState([]);
    const [statuts, setStatuts] = useState([]);
    const [typesNotification, setTypesNotification] = useState([]);
    const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
    const [patientSelectionne, setPatientSelectionne] = useState(null);

    // États pour la gestion du formulaire
    const [chargement, setChargement] = useState(false);
    const [chargementCreneaux, setChargementCreneaux] = useState(false);
    const [erreur, setErreur] = useState('');
    const [validation, setValidation] = useState({});
    const [etape, setEtape] = useState(1);
    const [forceAllowEmptySlots, setForceAllowEmptySlots] = useState(false);

    // Helper function to extract key data from appointment object
    const extractAppointmentData = (appt) => {
        if (!appt) return null;

        // Extract date and time
        let dateValue = '';
        let timeValue = '';

        if (appt.date) {
            dateValue = appt.date;
        } else if (appt.dateHeure) {
            try {
                const dateObj = new Date(appt.dateHeure);
                dateValue = format(dateObj, 'yyyy-MM-dd');
                timeValue = format(dateObj, 'HH:mm');
            } catch (error) {
                console.error('Error parsing dateHeure:', error);
            }
        }

        if (appt.heure && !timeValue) {
            timeValue = appt.heure;
        }

        // Handle status - it can be an object with a nom property or a string
        const statusValue = appt.statutNom ||
            (typeof appt.statut === 'object' && appt.statut !== null ?
                appt.statut.nom : appt.statut) || "Planifié";

        // Handle patient/client ID
        const patientIdValue = appt.patientId ||
            appt.clientId ||
            (appt.patient?.id || appt.client?.id);

        // Handle notifications - they can be objects or strings
        const notificationsArray = Array.isArray(appt.notifications) ?
            appt.notifications.map(n => typeof n === 'object' && n !== null ? n.nom : n) : [];

        return {
            patientId: patientIdValue?.toString() || "",
            date: dateValue,
            heure: timeValue,
            duree: appt.duree?.toString() || "30",
            type: appt.type || "",
            notes: appt.notes || '',
            statut: statusValue,
            notifications: notificationsArray
        };
    };

    // Charger les données initiales
    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                setChargement(true);

                // Charger les patients, statuts et types de notification
                const [patientsData, statutsData, notificationsData] = await Promise.all([
                    patientService.getPatients(),
                    appointmentService.getAppointmentStatuses(),
                    appointmentService.getNotificationTypes()
                ]);

                // Fix 1: Handle nested API structure - patients are in data.patients
                const patientsArray = Array.isArray(patientsData?.data?.patients)
                    ? patientsData.data.patients
                    : Array.isArray(patientsData?.data)
                        ? patientsData.data
                        : [];
                setPatients(patientsArray);

                // Fix 2: Ensure statuts is always an array
                setStatuts(Array.isArray(statutsData) ? statutsData : []);

                // Fix 3: Ensure typesNotification is always an array
                setTypesNotification(Array.isArray(notificationsData) ? notificationsData : []);

                // Si c'est une édition, charger les données du rendez-vous
                if (isEditing && appointment) {
                    const normalizedData = extractAppointmentData(appointment);
                    setFormData(normalizedData);

                    // Find selected patient
                    const patientId = normalizedData.patientId;
                    const patient = patientsArray.find(p => p.id.toString() === patientId);

                    if (patient) {
                        setPatientSelectionne(patient);
                    } else if (appointment.patient || appointment.client) {
                        // If no matching patient is found but we have patient/client data
                        setPatientSelectionne(appointment.patient || appointment.client);
                    }
                }
                // Si un patientId est fourni via l'URL, récupérer les informations du patient
                else if (patientIdFromUrl) {
                    const patient = patientsArray.find(p => p.id.toString() === patientIdFromUrl);
                    if (patient) {
                        setPatientSelectionne(patient);
                    }
                }

                // Log available patients for debugging
                console.log('Available patients:', patientsArray);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setErreur('Impossible de charger certaines données. Veuillez réessayer.');
            } finally {
                setChargement(false);
            }
        };

        chargerDonnees();
    }, [appointment, isEditing, patientIdFromUrl]);

    // Charger les créneaux disponibles lorsque la date change
    useEffect(() => {
        const chargerCreneaux = async () => {
            if (!formData.date) return;

            try {
                setChargementCreneaux(true);
                const response = await appointmentService.getAvailableTimeSlots(formData.date);
                // Fix 4: Ensure creneauxDisponibles is always an array
                setCreneauxDisponibles(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Erreur lors du chargement des créneaux disponibles:', error);
                addToast({
                    type: 'error',
                    message: 'Impossible de charger les créneaux disponibles'
                });
                // Set to empty array to show default slots
                setCreneauxDisponibles([]);
            } finally {
                setChargementCreneaux(false);
            }
        };

        chargerCreneaux();
    }, [formData.date, addToast]);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Pour les cases à cocher (notifications)
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    notifications: [...prev.notifications, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    notifications: prev.notifications.filter(notif => notif !== value)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Si le patient change, mettre à jour le patient sélectionné
            if (name === 'patientId') {
                const patient = patients.find(p => p.id.toString() === value);
                setPatientSelectionne(patient || null);
            }
        }

        // Réinitialiser l'erreur de validation pour ce champ
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Sélectionner un créneau horaire
    const handleSelectTimeSlot = (heure) => {
        setFormData(prev => ({
            ...prev,
            heure
        }));
    };

    // Valider l'étape 1 (sélection du patient)
    const validerEtape1 = () => {
        const erreurs = {};

        if (!formData.patientId) {
            erreurs.patientId = 'Veuillez sélectionner un patient';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Valider l'étape 2 (date et heure)
    const validerEtape2 = () => {
        const erreurs = {};

        if (!formData.date) {
            erreurs.date = 'Veuillez sélectionner une date';
        }

        if (!formData.heure) {
            erreurs.heure = 'Veuillez sélectionner une heure';
        }

        if (!formData.duree) {
            erreurs.duree = 'Veuillez sélectionner une durée';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Valider l'étape 3 (détails du rendez-vous)
    const validerEtape3 = () => {
        const erreurs = {};

        if (!formData.type) {
            erreurs.type = 'Veuillez sélectionner un type de rendez-vous';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Passer à l'étape suivante
    const passerEtapeSuivante = () => {
        if (etape === 1 && validerEtape1()) {
            setEtape(2);
        } else if (etape === 2 && validerEtape2()) {
            setEtape(3);
        }
    };

    // Revenir à l'étape précédente
    const revenir = () => {
        if (etape > 1) {
            setEtape(etape - 1);
        }
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (etape === 3 && !validerEtape3()) {
            return;
        }

        try {
            setChargement(true);
            setErreur('');

            // Combiner la date et l'heure
            const dateHeure = `${formData.date}T${formData.heure}`;

            // Vérifier si la date et l'heure sont valides
            if (!isValid(parseISO(dateHeure))) {
                setErreur('La date et l\'heure sélectionnées ne sont pas valides.');
                setChargement(false);
                return;
            }

            // Préparer les données pour l'API
            const donnees = {
                patientId: formData.patientId,
                date: formData.date,
                heure: formData.heure,
                duree: parseInt(formData.duree, 10),
                type: formData.type,
                notes: formData.notes,
                statut: formData.statut,
                notifications: formData.notifications
            };

            try {
                // Vérifier la disponibilité du créneau seulement si on n'a pas forcé l'acceptation
                if (!forceAllowEmptySlots) {
                    const disponibilite = await appointmentService.checkAvailability({
                        date: formData.date,
                        heure: formData.heure,
                        duree: formData.duree,
                        appointmentId: isEditing ? (appointment?.id || appointment?.rendezvous?.id) : undefined
                    });

                    if (!disponibilite.disponible) {
                        setErreur('Ce créneau n\'est pas disponible. Veuillez sélectionner un autre créneau ou forcer la réservation.');
                        setForceAllowEmptySlots(true);
                        setChargement(false);
                        return;
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de disponibilité:', error);
                // Continue if availability check fails but user has forced it
                if (!forceAllowEmptySlots) {
                    setErreur('Impossible de vérifier la disponibilité. Vous pouvez forcer la réservation.');
                    setForceAllowEmptySlots(true);
                    setChargement(false);
                    return;
                }
            }

            let resultat;
            if (isEditing && appointment) {
                // Mise à jour d'un rendez-vous existant
                const appointmentId = appointment.id || (appointment.rendezvous && appointment.rendezvous.id);
                resultat = await appointmentService.updateAppointment(appointmentId, donnees);
            } else {
                // Création d'un nouveau rendez-vous
                resultat = await appointmentService.createAppointment(donnees);
            }

            // Success toast
            addToast({
                type: 'success',
                message: isEditing ? 'Rendez-vous mis à jour avec succès' : 'Rendez-vous créé avec succès'
            });

            // Redirection vers la page du rendez-vous avec gestion appropriée des structures de réponse
            if (resultat && resultat.id) {
                router.push(`/rendez-vous/${resultat.id}`);
            } else if (resultat && resultat.rendezvous && resultat.rendezvous.id) {
                router.push(`/rendez-vous/${resultat.rendezvous.id}`);
            } else {
                // Fallback si aucun ID n'est trouvé
                console.warn('ID du rendez-vous non trouvé dans la réponse:', resultat);
                router.push('/rendez-vous');
                addToast({
                    type: 'warning',
                    message: 'Rendez-vous créé, mais impossible d\'accéder à sa page détaillée.'
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
            setErreur('Une erreur est survenue lors de l\'enregistrement du rendez-vous. Veuillez réessayer.');
            addToast({
                type: 'error',
                message: 'Erreur lors de l\'enregistrement du rendez-vous'
            });
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
                    {forceAllowEmptySlots && (
                        <button
                            type="button"
                            onClick={() => {
                                setForceAllowEmptySlots(true);
                                setErreur('');
                            }}
                            className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                        >
                            Forcer la réservation malgré la non-disponibilité
                        </button>
                    )}
                </div>
            )}

            {/* Étapes de création */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            type="button"
                            className={`py-4 px-6 font-medium text-sm ${
                                etape === 1
                                    ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => etape > 1 && setEtape(1)}
                        >
                            1. Patient
                        </button>
                        <button
                            type="button"
                            className={`py-4 px-6 font-medium text-sm ${
                                etape === 2
                                    ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => etape > 2 && setEtape(2)}
                            disabled={etape < 2}
                        >
                            2. Date et heure
                        </button>
                        <button
                            type="button"
                            className={`py-4 px-6 font-medium text-sm ${
                                etape === 3
                                    ? 'border-b-2 border-[#5CB1B1] text-[#5CB1B1]'
                                    : 'text-gray-500'
                            }`}
                            disabled={etape < 3}
                        >
                            3. Détails
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Étape 1: Sélection du patient */}
                    {etape === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Sélection du patient
                            </h2>

                            <div>
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Patient <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="patientId"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${
                                        validation.patientId ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                                    disabled={patientIdFromUrl !== null || isEditing}
                                >
                                    <option value="">Sélectionner un patient</option>
                                    {/* Fix 5: Add Array.isArray check before mapping patients */}
                                    {Array.isArray(patients) && patients.map(patient => (
                                        <option key={patient?.id || 'unknown'} value={patient?.id || ''}>
                                            {patient?.nom || 'Sans nom'} {patient?.prenom || ''}
                                        </option>
                                    ))}
                                </select>
                                {validation.patientId && (
                                    <p className="mt-1 text-sm text-red-600">{validation.patientId}</p>
                                )}
                            </div>

                            {patientSelectionne && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                                        Informations du patient
                                    </h3>
                                    <div className="text-sm text-gray-500">
                                        <p><span className="font-medium">Email:</span> {patientSelectionne.email || '-'}</p>
                                        <p><span className="font-medium">Téléphone:</span> {patientSelectionne.telephone || '-'}</p>
                                        <p><span className="font-medium">Préférence de contact:</span> {patientSelectionne.preferenceContact?.nom || '-'}</p>
                                        <p><span className="font-medium">Langue:</span> {patientSelectionne.langue?.nom || '-'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 2: Date et heure */}
                    {etape === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Date et heure du rendez-vous
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        className={`w-full px-3 py-2 border ${
                                            validation.date ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                                    />
                                    {validation.date && (
                                        <p className="mt-1 text-sm text-red-600">{validation.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-1">
                                        Durée (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="duree"
                                        name="duree"
                                        value={formData.duree}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border ${
                                            validation.duree ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">1 heure</option>
                                        <option value="90">1 heure 30 minutes</option>
                                        <option value="120">2 heures</option>
                                    </select>
                                    {validation.duree && (
                                        <p className="mt-1 text-sm text-red-600">{validation.duree}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Heure <span className="text-red-500">*</span>
                                </label>

                                {formData.date ? (
                                    chargementCreneaux ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5CB1B1]"></div>
                                        </div>
                                    ) : (
                                        <TimeSlotPicker
                                            timeSlots={creneauxDisponibles}
                                            selectedTime={formData.heure}
                                            onSelectTimeSlot={handleSelectTimeSlot}
                                        />
                                    )
                                ) : (
                                    <p className="text-gray-500">
                                        Veuillez d'abord sélectionner une date pour voir les créneaux disponibles.
                                    </p>
                                )}

                                {validation.heure && (
                                    <p className="mt-1 text-sm text-red-600">{validation.heure}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Étape 3: Détails du rendez-vous */}
                    {etape === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Détails du rendez-vous
                            </h2>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Type de rendez-vous <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${
                                        validation.type ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="Suivi">Suivi</option>
                                    <option value="Urgence">Urgence</option>
                                    <option value="Examen">Examen</option>
                                    <option value="Autre">Autre</option>
                                </select>
                                {validation.type && (
                                    <p className="mt-1 text-sm text-red-600">{validation.type}</p>
                                )}
                            </div>

                            {isEditing && (
                                <div>
                                    <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
                                        Statut
                                    </label>
                                    <select
                                        id="statut"
                                        name="statut"
                                        value={formData.statut}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    >
                                        {/* Fix 6: Add Array.isArray check before mapping statuts */}
                                        {Array.isArray(statuts) && statuts.map(statut => (
                                            <option key={typeof statut === 'object' ? statut.id : statut}
                                                    value={typeof statut === 'object' ? statut.nom : statut}>
                                                {typeof statut === 'object' ? statut.nom : statut}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]"
                                    placeholder="Notes supplémentaires pour ce rendez-vous..."
                                />
                            </div>

                            <div>
                                <span className="block text-sm font-medium text-gray-700 mb-3">
                                    Notifications
                                </span>
                                <div className="space-y-2">
                                    {/* Fix 7: Add Array.isArray check before mapping typesNotification */}
                                    {Array.isArray(typesNotification) && typesNotification.map(type => {
                                        const typeName = typeof type === 'object' ? type.nom : type;
                                        const typeId = typeof type === 'object' ? type.id : type;

                                        return (
                                            <div key={typeId} className="flex items-center">
                                                <input
                                                    id={`notification-${typeId}`}
                                                    name="notifications"
                                                    type="checkbox"
                                                    value={typeName}
                                                    checked={formData.notifications.includes(typeName)}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-[#5CB1B1] focus:ring-[#5CB1B1] border-gray-300 rounded"
                                                />
                                                <label htmlFor={`notification-${typeId}`} className="ml-3 text-sm text-gray-700">
                                                    {typeName}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium text-gray-900">Récapitulatif</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Patient:</span> {patientSelectionne ? `${patientSelectionne.nom} ${patientSelectionne.prenom}` : '-'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Date:</span> {formData.date ? format(new Date(formData.date), 'PPPP', { locale: fr }) : '-'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Heure:</span> {formData.heure || '-'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Durée:</span> {formData.duree ? `${formData.duree} minutes` : '-'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Type:</span> {formData.type || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between">
                <div>
                    {etape > 1 && (
                        <button
                            type="button"
                            onClick={revenir}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Retour
                        </button>
                    )}
                </div>
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={() => router.push('/rendez-vous')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>

                    {etape < 3 ? (
                        <button
                            type="button"
                            onClick={passerEtapeSuivante}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                        >
                            Continuer
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={chargement}
                            className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                        >
                            {chargement ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le rendez-vous'}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}