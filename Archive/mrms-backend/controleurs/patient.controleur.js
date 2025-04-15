/**
 * Contrôleur pour gérer les opérations liées aux patients
 */

const DossierMedical = require('../modeles/dossierMedical');
const NoteMedicale = require('../modeles/noteMedicale');
const { formatResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');
const Client = require('../modeles/client');
const Utilisateur = require('../modeles/utilisateur');
const RendezVous = require('../modeles/rendezvous');
const StatutRendezVous = require('../modeles/statutRendezVous');
const TypeNotification = require('../modeles/typeNotification');
const TypePatient = require('../modeles/typePatient');
const Langue = require('../modeles/langue');
const PreferenceContact = require('../modeles/preferenceContact');

/**
 * Obtenir le profil du patient connecté
 * @route GET /api/patient/mon-profil
 */
exports.obtenirMonProfil = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        const client = await Client.findByPk(clientId, {
            include: [
                { model: TypePatient, as: 'typePatient' },
                { model: Langue, as: 'langue' },
                { model: PreferenceContact, as: 'preferenceContact' }
            ]
        });

        if (!client) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        // Exclure les notes médicales pour la sécurité
        const clientSansiNotes = { ...client.toJSON() };
        delete clientSansiNotes.notesMedicales;

        res.status(200).json(clientSansiNotes);
    } catch (erreur) {
        console.error('Erreur lors de la récupération du profil patient:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du profil patient" });
    }
};


exports.obtenirDossierMedical = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json(errorResponse("Profil patient non trouvé", 404));
        }

        // Rechercher le dossier médical
        let dossier = await DossierMedical.findOne({
            where: { clientId }
        });

        // Si le dossier n'existe pas, créer un dossier vide
        if (!dossier) {
            dossier = await DossierMedical.create({
                clientId,
                antecedents: '',
                allergies: '',
                medicationsActuelles: ''
            });
        }

        // Récupérer les notes médicales (non privées seulement)
        const notesMedicales = await NoteMedicale.findAll({
            where: {
                clientId,
                prive: false
            },
            order: [['dateCreation', 'DESC']]
        });

        res.status(200).json(formatResponse({
            dossier,
            notesMedicales
        }));
    } catch (erreur) {
        console.error('Erreur lors de la récupération du dossier médical:', erreur);
        res.status(500).json(errorResponse("Erreur lors de la récupération du dossier médical", 500));
    }
};

// Convertir les fonctions existantes pour utiliser formatResponse
exports.obtenirMesRendezVous = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json(errorResponse("Profil patient non trouvé", 404));
        }

        // Filtrer par statut (optionnel)
        const { statutId, page = 1, limite = 10 } = req.query;
        const conditions = { clientId };

        if (statutId) {
            conditions.statutId = statutId;
        }

        const { count, rows: rendezVous } = await RendezVous.findAndCountAll({
            where: conditions,
            include: [
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ],
            order: [
                ['date', 'DESC'],
                ['heure', 'ASC']
            ],
            limit: parseInt(limite),
            offset: (page - 1) * parseInt(limite)
        });

        res.status(200).json(formatResponse(rendezVous, { count, page, limite }));
    } catch (erreur) {
        console.error('Erreur lors de la récupération des rendez-vous du patient:', erreur);
        res.status(500).json(errorResponse("Erreur lors de la récupération des rendez-vous", 500));
    }
};

/**
 * Mettre à jour le profil du patient connecté
 * @route PUT /api/patient/mon-profil
 */
exports.mettreAJourMonProfil = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        const { email, telephone, preferenceContactId, langueId } = req.body;

        // Limiter les champs que le patient peut modifier
        const donneesMiseAJour = {};

        if (email) donneesMiseAJour.email = email;
        if (telephone) donneesMiseAJour.telephone = telephone;
        if (preferenceContactId) donneesMiseAJour.preferenceContactId = preferenceContactId;
        if (langueId) donneesMiseAJour.langueId = langueId;

        // Mettre à jour le profil
        const client = await Client.findByPk(clientId);

        if (!client) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        await client.update(donneesMiseAJour);

        // Récupérer le profil mis à jour avec les associations
        const clientMisAJour = await Client.findByPk(clientId, {
            include: [
                { model: TypePatient, as: 'typePatient' },
                { model: Langue, as: 'langue' },
                { model: PreferenceContact, as: 'preferenceContact' }
            ]
        });

        // Exclure les notes médicales pour la sécurité
        const clientSansNotes = { ...clientMisAJour.toJSON() };
        delete clientSansNotes.notesMedicales;

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            client: clientSansNotes
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du profil patient:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour du profil patient" });
    }
};

/**
 * Obtenir les rendez-vous du patient connecté
 * @route GET /api/patient/mes-rendez-vous
 */
exports.obtenirMesRendezVous = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        // Filtrer par statut (optionnel)
        const { statutId } = req.query;
        const conditions = { clientId };

        if (statutId) {
            conditions.statutId = statutId;
        }

        const rendezVous = await RendezVous.findAll({
            where: conditions,
            include: [
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ],
            order: [
                ['date', 'DESC'],
                ['heure', 'ASC']
            ]
        });

        res.status(200).json(rendezVous);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des rendez-vous du patient:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
};

/**
 * Prendre un rendez-vous en tant que patient
 * @route POST /api/patient/prendre-rendez-vous
 */
exports.prendreRendezVous = async (req, res) => {
    try {
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        const { date, heure, duree, typeNotificationId, notes } = req.body;

        // Validation des champs obligatoires
        if (!date || !heure) {
            return res.status(400).json({
                message: "La date et l'heure sont obligatoires"
            });
        }

        // Vérifier si le créneau est disponible
        const creneauExistant = await RendezVous.findOne({
            where: {
                date,
                heure,
                [Op.not]: [{ statutId: 3 }] // Ignorer les rendez-vous annulés
            }
        });

        if (creneauExistant) {
            return res.status(400).json({
                message: "Ce créneau est déjà réservé"
            });
        }

        // Créer le rendez-vous
        const nouveauRendezVous = await RendezVous.create({
            clientId,
            date,
            heure,
            duree: duree || 30, // Durée par défaut
            typeNotificationId: typeNotificationId || 1, // Type par défaut
            statutId: 1, // Statut par défaut (Programmé)
            notes,
            creeParId: req.utilisateur.id
        });

        // Récupérer le rendez-vous créé avec les associations
        const rendezvousComplet = await RendezVous.findByPk(nouveauRendezVous.id, {
            include: [
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ]
        });

        res.status(201).json({
            message: "Rendez-vous créé avec succès",
            rendezvous: rendezvousComplet
        });
    } catch (erreur) {
        console.error('Erreur lors de la création du rendez-vous:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la création du rendez-vous" });
    }
};

/**
 * Annuler un rendez-vous
 * @route PUT /api/patient/annuler-rendez-vous/:id
 */
exports.annulerRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const clientId = req.utilisateur.clientId;

        if (!clientId) {
            return res.status(404).json({ message: "Profil patient non trouvé" });
        }

        // Trouver le rendez-vous
        const rendezVous = await RendezVous.findOne({
            where: {
                id,
                clientId // S'assurer que le rendez-vous appartient bien au patient
            }
        });

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        // Vérifier si le rendez-vous peut être annulé (pas déjà terminé ou annulé)
        if (rendezVous.statutId === 2 || rendezVous.statutId === 3) {
            return res.status(400).json({
                message: "Ce rendez-vous ne peut pas être annulé car il est déjà terminé ou annulé"
            });
        }

        // Mettre à jour le statut du rendez-vous
        await rendezVous.update({ statutId: 3 }); // 3 = Annulé

        res.status(200).json({
            message: "Rendez-vous annulé avec succès"
        });
    } catch (erreur) {
        console.error('Erreur lors de l\'annulation du rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de l'annulation du rendez-vous" });
    }
};

/**
 * Obtenir les créneaux disponibles pour une date
 * @route GET /api/patient/creneaux-disponibles
 */
exports.obtenirCreneauxDisponibles = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "La date est obligatoire" });
        }

        // Récupérer tous les rendez-vous pour cette date
        const rendezvousDuJour = await RendezVous.findAll({
            where: {
                date,
                [Op.not]: [{ statutId: 3 }] // Ignorer les rendez-vous annulés
            },
            attributes: ['heure', 'duree']
        });

        // Définir les heures de début et de fin de journée (p. ex. 8h-18h)
        const heureDebut = 8; // 8h00
        const heureFin = 18; // 18h00
        const dureeDefaut = 30; // minutes

        // Générer tous les créneaux possibles
        const tousLesCreneaux = [];
        for (let heure = heureDebut; heure < heureFin; heure++) {
            for (let minute = 0; minute < 60; minute += dureeDefaut) {
                const heureStr = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                tousLesCreneaux.push(heureStr);
            }
        }

        // Filtrer les créneaux déjà réservés
        const creneauxReserves = rendezvousDuJour.map(rdv => rdv.heure);
        const creneauxDisponibles = tousLesCreneaux.filter(
            creneau => !creneauxReserves.includes(creneau)
        );

        res.status(200).json({
            date,
            creneauxDisponibles
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des créneaux disponibles:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des créneaux disponibles" });
    }
};

/**
 * Obtenir la liste des médecins
 * @route GET /api/patient/medecins
 */
exports.obtenirMedecins = async (req, res) => {
    try {
        const medecins = await Utilisateur.findAll({
            where: { role: 'Médecin' },
            attributes: ['id', 'nomUtilisateur']
        });

        res.status(200).json(medecins);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des médecins:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des médecins" });
    }
};