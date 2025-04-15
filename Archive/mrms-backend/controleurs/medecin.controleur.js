// doctor.controleur.js

const { Op } = require('sequelize');
const Utilisateur = require('../modeles/utilisateur');
const Client = require('../modeles/client');
const RendezVous = require('../modeles/rendezvous');
const StatutRendezVous = require('../modeles/statutRendezVous');
const DossierMedical = require('../modeles/dossierMedical');
const NoteMedicale = require('../modeles/noteMedicale');
const Disponibilite = require('../modeles/disponibilite');

/**
 * Obtenir le profil du médecin
 * @route GET /api/medecin/profil
 */
exports.obtenirProfil = async (req, res) => {
    try {
        const medecin = await Utilisateur.findByPk(req.utilisateur.id, {
            attributes: ['id', 'nomUtilisateur', 'nom', 'prenom', 'email', 'telephone', 'specialite']
        });

        if (!medecin) {
            return res.status(404).json({ message: "Profil médecin non trouvé" });
        }

        res.status(200).json(medecin);
    } catch (erreur) {
        console.error('Erreur lors de la récupération du profil médecin:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du profil médecin" });
    }
};

/**
 * Mettre à jour le profil du médecin
 * @route PUT /api/medecin/profil
 */
exports.mettreAJourProfil = async (req, res) => {
    try {
        const { nom, prenom, email, telephone, specialite } = req.body;

        const medecin = await Utilisateur.findByPk(req.utilisateur.id);

        if (!medecin) {
            return res.status(404).json({ message: "Profil médecin non trouvé" });
        }

        await medecin.update({
            nom: nom || medecin.nom,
            prenom: prenom || medecin.prenom,
            email: email || medecin.email,
            telephone: telephone || medecin.telephone,
            specialite: specialite || medecin.specialite
        });

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            medecin
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du profil médecin:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil médecin" });
    }
};

/**
 * Obtenir les rendez-vous du médecin
 * @route GET /api/medecin/rendez-vous
 */
exports.obtenirRendezVous = async (req, res) => {
    try {
        const { date, statutId, page = 1, limite = 10 } = req.query;

        // Construire les conditions de recherche
        const conditions = {};

        if (date) {
            conditions.date = date;
        }

        if (statutId) {
            conditions.statutId = statutId;
        }

        // Calcul de la pagination
        const offset = (page - 1) * limite;

        const { count, rows: rendezVous } = await RendezVous.findAndCountAll({
            where: conditions,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
                { model: StatutRendezVous, as: 'statut' }
            ],
            order: [['date', 'ASC'], ['heure', 'ASC']],
            limit: parseInt(limite),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limite),
            currentPage: parseInt(page),
            rendezVous
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
};

/**
 * Obtenir les détails d'un rendez-vous
 * @route GET /api/medecin/rendez-vous/:id
 */
exports.obtenirRendezVousParId = async (req, res) => {
    try {
        const { id } = req.params;

        const rendezVous = await RendezVous.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
                { model: StatutRendezVous, as: 'statut' },
                { model: NoteMedicale, as: 'notes', where: { medecinId: req.utilisateur.id }, required: false }
            ]
        });

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        res.status(200).json(rendezVous);
    } catch (erreur) {
        console.error('Erreur lors de la récupération du rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous" });
    }
};

/**
 * Mettre à jour le statut d'un rendez-vous
 * @route PUT /api/medecin/rendez-vous/:id/statut
 */
exports.mettreAJourStatutRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const { statutId } = req.body;

        if (!statutId) {
            return res.status(400).json({ message: "Le statut est requis" });
        }

        const rendezVous = await RendezVous.findByPk(id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezVous.update({ statutId });

        res.status(200).json({
            message: "Statut du rendez-vous mis à jour avec succès",
            rendezVous
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du statut:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
};

/**
 * Ajouter une note médicale à un rendez-vous
 * @route POST /api/medecin/rendez-vous/:id/notes
 */
exports.ajouterNoteMedicale = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenu, diagnostic, traitement } = req.body;

        if (!contenu) {
            return res.status(400).json({ message: "Le contenu de la note est requis" });
        }

        const rendezVous = await RendezVous.findByPk(id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        const noteMedicale = await NoteMedicale.create({
            rendezVousId: id,
            medecinId: req.utilisateur.id,
            clientId: rendezVous.clientId,
            contenu,
            diagnostic,
            traitement
        });

        res.status(201).json({
            message: "Note médicale ajoutée avec succès",
            noteMedicale
        });
    } catch (erreur) {
        console.error('Erreur lors de l\'ajout de la note médicale:', erreur);
        res.status(500).json({ message: "Erreur lors de l'ajout de la note médicale" });
    }
};

/**
 * Obtenir les disponibilités du médecin
 * @route GET /api/medecin/disponibilites
 */
exports.obtenirDisponibilites = async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;

        const conditions = {
            medecinId: req.utilisateur.id
        };

        if (dateDebut && dateFin) {
            conditions.date = {
                [Op.between]: [dateDebut, dateFin]
            };
        } else if (dateDebut) {
            conditions.date = {
                [Op.gte]: dateDebut
            };
        } else if (dateFin) {
            conditions.date = {
                [Op.lte]: dateFin
            };
        }

        const disponibilites = await Disponibilite.findAll({
            where: conditions,
            order: [['date', 'ASC'], ['heureDebut', 'ASC']]
        });

        res.status(200).json(disponibilites);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des disponibilités:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des disponibilités" });
    }
};

/**
 * Définir une nouvelle disponibilité
 * @route POST /api/medecin/disponibilites
 */
exports.definirDisponibilite = async (req, res) => {
    try {
        const { date, heureDebut, heureFin, recurrence } = req.body;

        if (!date || !heureDebut || !heureFin) {
            return res.status(400).json({
                message: "La date, l'heure de début et l'heure de fin sont requises"
            });
        }

        if (heureDebut >= heureFin) {
            return res.status(400).json({
                message: "L'heure de début doit être inférieure à l'heure de fin"
            });
        }

        const disponibilite = await Disponibilite.create({
            medecinId: req.utilisateur.id,
            date,
            heureDebut,
            heureFin,
            recurrence: recurrence || 'aucune'
        });

        res.status(201).json({
            message: "Disponibilité définie avec succès",
            disponibilite
        });
    } catch (erreur) {
        console.error('Erreur lors de la définition de la disponibilité:', erreur);
        res.status(500).json({ message: "Erreur lors de la définition de la disponibilité" });
    }
};

/**
 * Supprimer une disponibilité
 * @route DELETE /api/medecin/disponibilites/:id
 */
exports.supprimerDisponibilite = async (req, res) => {
    try {
        const { id } = req.params;

        const disponibilite = await Disponibilite.findOne({
            where: {
                id,
                medecinId: req.utilisateur.id
            }
        });

        if (!disponibilite) {
            return res.status(404).json({ message: "Disponibilité non trouvée" });
        }

        await disponibilite.destroy();

        res.status(200).json({ message: "Disponibilité supprimée avec succès" });
    } catch (erreur) {
        console.error('Erreur lors de la suppression de la disponibilité:', erreur);
        res.status(500).json({ message: "Erreur lors de la suppression de la disponibilité" });
    }
};

/**
 * Obtenir la liste des patients du médecin
 * @route GET /api/medecin/patients
 */
exports.obtenirPatients = async (req, res) => {
    try {
        const { recherche, page = 1, limite = 10 } = req.query;

        // Obtenir tous les rendez-vous passés du médecin
        const rendezVousMedecin = await RendezVous.findAll({
            where: {
                creeParId: req.utilisateur.id
            },
            attributes: ['clientId']
        });

        // Extraire les IDs des clients
        const clientIds = [...new Set(rendezVousMedecin.map(rv => rv.clientId))];

        // Construire les conditions de recherche
        const conditions = {
            id: {
                [Op.in]: clientIds
            }
        };

        if (recherche) {
            conditions[Op.or] = [
                { nom: { [Op.like]: `%${recherche}%` } },
                { prenom: { [Op.like]: `%${recherche}%` } },
                { email: { [Op.like]: `%${recherche}%` } }
            ];
        }

        // Calcul de la pagination
        const offset = (page - 1) * limite;

        const { count, rows: patients } = await Client.findAndCountAll({
            where: conditions,
            order: [['nom', 'ASC'], ['prenom', 'ASC']],
            limit: parseInt(limite),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limite),
            currentPage: parseInt(page),
            patients
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des patients:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des patients" });
    }
};

/**
 * Obtenir les détails d'un patient
 * @route GET /api/medecin/patients/:id
 */
exports.obtenirPatientParId = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Client.findByPk(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient non trouvé" });
        }

        // Récupérer l'historique des rendez-vous avec ce patient
        const historiqueRendezVous = await RendezVous.findAll({
            where: { clientId: id },
            include: [
                { model: StatutRendezVous, as: 'statut' }
            ],
            order: [['date', 'DESC'], ['heure', 'DESC']]
        });

        // Récupérer les notes médicales pour ce patient
        const notesMedicales = await NoteMedicale.findAll({
            where: {
                clientId: id,
                medecinId: req.utilisateur.id
            },
            order: [['dateCreation', 'DESC']]
        });

        res.status(200).json({
            patient,
            historiqueRendezVous,
            notesMedicales
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération du patient:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du patient" });
    }
};

/**
 * Mettre à jour les notes médicales d'un patient
 * @route PUT /api/medecin/patients/:id/notes-medicales
 */
exports.mettreAJourNotesMedicales = async (req, res) => {
    try {
        const { id } = req.params;
        const { notesMedicales } = req.body;

        const patient = await Client.findByPk(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient non trouvé" });
        }

        await patient.update({ notesMedicales });

        res.status(200).json({
            message: "Notes médicales mises à jour avec succès",
            patient
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour des notes médicales:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour des notes médicales" });
    }
};