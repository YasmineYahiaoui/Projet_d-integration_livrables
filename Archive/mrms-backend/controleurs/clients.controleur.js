/**
 * Contrôleur pour gérer les opérations liées aux clients (patients)
 */

const { Op } = require('sequelize');
const Client = require('../modeles/client');
const TypePatient = require('../modeles/typePatient');
const Langue = require('../modeles/langue');
const PreferenceContact = require('../modeles/preferenceContact');
const { formatResponse, errorResponse } = require('../utils/response');

/**
 * Obtenir tous les clients avec filtres optionnels
 * @route GET /api/clients
 */
exports.obtenirTousLesClients = async (req, res) => {
    try {
        const { recherche, typePatientId, langueId, page = 1, limite = 10 } = req.query;

        // Construire les conditions de recherche
        const conditions = {};

        // Recherche par nom ou prénom
        if (recherche) {
            conditions[Op.or] = [
                { nom: { [Op.like]: `%${recherche}%` } },
                { prenom: { [Op.like]: `%${recherche}%` } },
                { email: { [Op.like]: `%${recherche}%` } }
            ];
        }

        // Filtre par type de patient
        if (typePatientId) {
            conditions.typePatientId = typePatientId;
        }

        // Filtre par langue
        if (langueId) {
            conditions.langueId = langueId;
        }

        // Calcul de la pagination
        const offset = (page - 1) * limite;

        // Récupérer les clients avec les associations
        const { count, rows: clients } = await Client.findAndCountAll({
            where: conditions,
            include: [
                { model: TypePatient, as: 'typePatient' },
                { model: Langue, as: 'langue' },
                { model: PreferenceContact, as: 'preferenceContact' }
            ],
            order: [['nom', 'ASC'], ['prenom', 'ASC']],
            limit: parseInt(limite),
            offset: parseInt(offset)
        });

        // Si l'utilisateur est un administrateur, supprimer les notes médicales
        if (req.utilisateur.role === 'Administrateur') {
            clients.forEach(client => {
                client.notesMedicales = undefined;
            });
        }

        // Formater la réponse pour correspondre aux attentes du frontend
        // Renommer "clients" en "patients" pour la compatibilité frontend
        res.status(200).json(formatResponse(
            { patients: clients },
            { count, page, limite }
        ));
    } catch (erreur) {
        console.error('Erreur lors de la récupération des clients:', erreur);
        res.status(500).json(errorResponse("Erreur lors de la récupération des clients", 500));
    }
};

/**
 * Obtenir les données pour le formulaire de nouveau client
 * @route GET /api/clients/nouveau
 */
exports.obtenirFormulaireNouveauClient = async (req, res) => {
    try {
        // Récupérer les données de référence pour le formulaire
        const typesPatient = await TypePatient.findAll();
        const langues = await Langue.findAll();
        const preferencesContact = await PreferenceContact.findAll();

        res.status(200).json({
            typesPatient,
            langues,
            preferencesContact,
            message: "Données pour le formulaire de nouveau client récupérées avec succès"
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des données pour le formulaire:', erreur);
        res.status(500).json({
            message: "Erreur lors de la récupération des données pour le formulaire de nouveau client"
        });
    }
};

/**
 * Obtenir un client par ID
 * @route GET /api/clients/:id
 */
exports.obtenirClientParId = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findByPk(id, {
            include: [
                { model: TypePatient, as: 'typePatient' },
                { model: Langue, as: 'langue' },
                { model: PreferenceContact, as: 'preferenceContact' }
            ]
        });

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Si l'utilisateur est un administrateur, supprimer les notes médicales
        if (req.utilisateur.role === 'Administrateur') {
            client.notesMedicales = undefined;
        }

        res.status(200).json(client);
    } catch (erreur) {
        console.error('Erreur lors de la récupération du client:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération du client" });
    }
};

/**
 * Créer un nouveau client
 * @route POST /api/clients
 */
exports.creerClient = async (req, res) => {
    try {
        const {
            prenom,
            nom,
            email,
            telephone,
            typePatientId,
            langueId,
            preferenceContactId,
            notesMedicales
        } = req.body;

        // Validation des champs obligatoires
        if (!prenom || !nom) {
            return res.status(400).json({ message: "Le prénom et le nom sont obligatoires" });
        }

        // Si l'utilisateur est un administrateur et qu'il tente d'ajouter des notes médicales
        if (req.utilisateur.role === 'Administrateur' && notesMedicales) {
            return res.status(403).json({
                message: "Les administrateurs ne peuvent pas ajouter de notes médicales"
            });
        }

        // Créer le client
        const nouveauClient = await Client.create({
            prenom,
            nom,
            email,
            telephone,
            typePatientId: typePatientId || 1, // Type par défaut
            langueId: langueId || 1, // Langue par défaut
            preferenceContactId: preferenceContactId || 1, // Préférence par défaut
            notesMedicales: req.utilisateur.role === 'Médecin' ? notesMedicales : null
        });

        res.status(201).json({
            message: "Client créé avec succès",
            client: nouveauClient
        });
    } catch (erreur) {
        console.error('Erreur lors de la création du client:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la création du client" });
    }
};

/**
 * Mettre à jour un client
 * @route PUT /api/clients/:id
 */
exports.mettreAJourClient = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prenom,
            nom,
            email,
            telephone,
            typePatientId,
            langueId,
            preferenceContactId,
            notesMedicales
        } = req.body;

        // Trouver le client
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Préparer les données à mettre à jour
        const donneesMiseAJour = {
            prenom: prenom || client.prenom,
            nom: nom || client.nom,
            email,
            telephone,
            typePatientId: typePatientId || client.typePatientId,
            langueId: langueId || client.langueId,
            preferenceContactId: preferenceContactId || client.preferenceContactId
        };

        // Si l'utilisateur est un médecin, permettre la mise à jour des notes médicales
        if (req.utilisateur.role === 'Médecin') {
            donneesMiseAJour.notesMedicales = notesMedicales;
        }

        // Mettre à jour le client
        await client.update(donneesMiseAJour);

        // Récupérer le client mis à jour avec les associations
        const clientMisAJour = await Client.findByPk(id, {
            include: [
                { model: TypePatient, as: 'typePatient' },
                { model: Langue, as: 'langue' },
                { model: PreferenceContact, as: 'preferenceContact' }
            ]
        });

        // Si l'utilisateur est un administrateur, supprimer les notes médicales
        if (req.utilisateur.role === 'Administrateur') {
            clientMisAJour.notesMedicales = undefined;
        }

        res.status(200).json({
            message: "Client mis à jour avec succès",
            client: clientMisAJour
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du client:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour du client" });
    }
};

/**
 * Supprimer un client
 * @route DELETE /api/clients/:id
 */
exports.supprimerClient = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le client existe
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Supprimer le client
        await client.destroy();

        res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (erreur) {
        console.error('Erreur lors de la suppression du client:', erreur);
        res.status(500).json({ message: "Erreur lors de la suppression du client" });
    }
};

/**
 * Obtenir tous les types de patients
 * @route GET /api/clients/types
 */
exports.obtenirTypesPatients = async (req, res) => {
    try {
        const types = await TypePatient.findAll();
        res.status(200).json(types);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des types de patients:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des types de patients" });
    }
};

/**
 * Obtenir toutes les langues
 * @route GET /api/clients/langues
 */
exports.obtenirLangues = async (req, res) => {
    try {
        const langues = await Langue.findAll();
        res.status(200).json(langues);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des langues:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des langues" });
    }
};

/**
 * Obtenir toutes les préférences de contact
 * @route GET /api/clients/preferences-contact
 */
exports.obtenirPreferencesContact = async (req, res) => {
    try {
        const preferences = await PreferenceContact.findAll();
        res.status(200).json(preferences);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des préférences de contact:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des préférences de contact" });
    }
};