/**
 * Contrôleur pour gérer les opérations liées aux rendez-vous
 */

const { Op } = require('sequelize');
const RendezVous = require('../modeles/rendezvous');
const Client = require('../modeles/client');
const StatutRendezVous = require('../modeles/statutRendezVous');
const TypeNotification = require('../modeles/typeNotification');
const Utilisateur = require('../modeles/utilisateur');

/**
 * Obtenir tous les rendez-vous avec filtres optionnels
 * @route GET /api/rendezvous
 */
exports.obtenirTousLesRendezVous = async (req, res) => {
    try {
        const {
            date,
            clientId,
            statutId,
            debutPeriode,
            finPeriode,
            page = 1,
            limite = 10
        } = req.query;

        // Construire les conditions de recherche
        const conditions = {};

        // Filtre par date spécifique
        if (date) {
            conditions.date = date;
        }

        // Filtre par période de dates
        if (debutPeriode && finPeriode) {
            conditions.date = {
                [Op.between]: [debutPeriode, finPeriode]
            };
        } else if (debutPeriode) {
            conditions.date = {
                [Op.gte]: debutPeriode
            };
        } else if (finPeriode) {
            conditions.date = {
                [Op.lte]: finPeriode
            };
        }

        // Filtre par client
        if (clientId) {
            conditions.clientId = clientId;
        }

        // Filtre par statut
        if (statutId) {
            conditions.statutId = statutId;
        }

        // Calcul de la pagination
        const offset = (page - 1) * limite;

        // Récupérer les rendez-vous avec les associations
        const { count, rows: rendezvous } = await RendezVous.findAndCountAll({
            where: conditions,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ],
            order: [['date', 'ASC'], ['heure', 'ASC']],
            limit: parseInt(limite),
            offset: parseInt(offset)
        });

        // Renvoyer les résultats avec les informations de pagination
        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limite),
            currentPage: parseInt(page),
            rendezvous
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
};

/**
 * Obtenir un rendez-vous par ID
 * @route GET /api/rendezvous/:id
 */
exports.obtenirRendezVousParId = async (req, res) => {
    try {
        const { id } = req.params;

        const rendezvous = await RendezVous.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ]
        });

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        res.status(200).json(rendezvous);
    } catch (erreur) {
        console.error('Erreur lors de la récupération du rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous" });
    }
};

/**
 * Créer un nouveau rendez-vous
 * @route POST /api/rendezvous
 */
exports.creerRendezVous = async (req, res) => {
    try {
        const {
            clientId,
            date,
            heure,
            duree,
            typeNotificationId,
            statutId,
            notes
        } = req.body;

        // Validation des champs obligatoires
        if (!clientId || !date || !heure) {
            return res.status(400).json({
                message: "Le client, la date et l'heure sont obligatoires"
            });
        }

        // Vérifier si le client existe
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
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
            statutId: statutId || 1, // Statut par défaut (Programmé)
            notes,
            creeParId: req.utilisateur.id
        });

        // Récupérer le rendez-vous créé avec les associations
        const rendezvousComplet = await RendezVous.findByPk(nouveauRendezVous.id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
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
 * Mettre à jour un rendez-vous
 * @route PUT /api/rendezvous/:id
 */
exports.mettreAJourRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            clientId,
            date,
            heure,
            duree,
            typeNotificationId,
            statutId,
            notes
        } = req.body;

        // Trouver le rendez-vous
        const rendezvous = await RendezVous.findByPk(id);

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        // Vérifier si le client existe
        if (clientId) {
            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: "Client non trouvé" });
            }
        }

        // Vérifier si le créneau est disponible si la date ou l'heure change
        if ((date && date !== rendezvous.date) || (heure && heure !== rendezvous.heure)) {
            const creneauExistant = await RendezVous.findOne({
                where: {
                    date: date || rendezvous.date,
                    heure: heure || rendezvous.heure,
                    id: { [Op.not]: id },
                    [Op.not]: [{ statutId: 3 }] // Ignorer les rendez-vous annulés
                }
            });

            if (creneauExistant) {
                return res.status(400).json({
                    message: "Ce créneau est déjà réservé"
                });
            }
        }

        // Préparer les données à mettre à jour
        const donneesMiseAJour = {
            clientId: clientId || rendezvous.clientId,
            date: date || rendezvous.date,
            heure: heure || rendezvous.heure,
            duree: duree || rendezvous.duree,
            typeNotificationId: typeNotificationId || rendezvous.typeNotificationId,
            statutId: statutId || rendezvous.statutId,
            notes: notes !== undefined ? notes : rendezvous.notes
        };

        // Mettre à jour le rendez-vous
        await rendezvous.update(donneesMiseAJour);

        // Récupérer le rendez-vous mis à jour avec les associations
        const rendezvousMisAJour = await RendezVous.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
                },
                { model: StatutRendezVous, as: 'statut' },
                { model: TypeNotification, as: 'typeNotification' },
                {
                    model: Utilisateur,
                    as: 'creePar',
                    attributes: ['id', 'nomUtilisateur']
                }
            ]
        });

        res.status(200).json({
            message: "Rendez-vous mis à jour avec succès",
            rendezvous: rendezvousMisAJour
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du rendez-vous:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous" });
    }
};

/**
 * Supprimer un rendez-vous
 * @route DELETE /api/rendezvous/:id
 */
exports.supprimerRendezVous = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le rendez-vous existe
        const rendezvous = await RendezVous.findByPk(id);

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        // Supprimer le rendez-vous
        await rendezvous.destroy();

        res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } catch (erreur) {
        console.error('Erreur lors de la suppression du rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous" });
    }
};

/**
 * Vérifier la disponibilité d'un créneau
 * @route GET /api/rendezvous/disponibilite
 */
exports.verifierDisponibilite = async (req, res) => {
    try {
        const { date, heure, rendezvousId } = req.query;

        if (!date || !heure) {
            return res.status(400).json({
                message: "La date et l'heure sont obligatoires"
            });
        }

        // Construire la condition pour exclure le rendez-vous actuel si on vérifie pour une mise à jour
        const exclusion = rendezvousId ? { id: { [Op.not]: rendezvousId } } : {};

        // Vérifier si le créneau est disponible
        const creneauExistant = await RendezVous.findOne({
            where: {
                date,
                heure,
                ...exclusion,
                [Op.not]: [{ statutId: 3 }] // Ignorer les rendez-vous annulés
            }
        });

        res.status(200).json({
            disponible: !creneauExistant,
            message: creneauExistant ? "Ce créneau est déjà réservé" : "Ce créneau est disponible"
        });
    } catch (erreur) {
        console.error('Erreur lors de la vérification de disponibilité:', erreur);
        res.status(500).json({ message: "Erreur lors de la vérification de disponibilité" });
    }
};

/**
 * Obtenir les créneaux disponibles pour une date
 * @route GET /api/rendezvous/creneaux-disponibles
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
 * Obtenir tous les statuts de rendez-vous
 * @route GET /api/rendezvous/statuts
 */
exports.obtenirStatutsRendezVous = async (req, res) => {
    try {
        const statuts = await StatutRendezVous.findAll();
        res.status(200).json(statuts);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des statuts de rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des statuts de rendez-vous" });
    }
};

/**
 * Obtenir tous les types de notification
 * @route GET /api/rendezvous/types-notification
 */
exports.obtenirTypesNotification = async (req, res) => {
    try {
        const types = await TypeNotification.findAll();
        res.status(200).json(types);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des types de notification:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des types de notification" });
    }
};