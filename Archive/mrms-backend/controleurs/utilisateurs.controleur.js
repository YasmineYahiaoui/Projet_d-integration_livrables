/**
 * Contrôleur pour gérer les opérations liées aux utilisateurs
 */

const bcrypt = require('bcryptjs');
const Utilisateur = require('../modeles/utilisateur');

/**
 * Obtenir tous les utilisateurs
 * @route GET /api/utilisateurs
 */
exports.obtenirTousLesUtilisateurs = async (req, res) => {
    try {
        // Exclure le mot de passe des résultats
        const utilisateurs = await Utilisateur.findAll({
            attributes: { exclude: ['motDePasse'] }
        });

        res.status(200).json(utilisateurs);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des utilisateurs:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

/**
 * Obtenir un utilisateur par ID
 * @route GET /api/utilisateurs/:id
 */
exports.obtenirUtilisateurParId = async (req, res) => {
    try {
        const { id } = req.params;

        const utilisateur = await Utilisateur.findByPk(id, {
            attributes: { exclude: ['motDePasse'] }
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(utilisateur);
    } catch (erreur) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
};

/**
 * Créer un nouvel utilisateur
 * @route POST /api/utilisateurs
 */
exports.creerUtilisateur = async (req, res) => {
    try {
        const { nomUtilisateur, motDePasse, role } = req.body;

        // Validation des champs obligatoires
        if (!nomUtilisateur || !motDePasse) {
            return res.status(400).json({
                message: "Le nom d'utilisateur et le mot de passe sont obligatoires"
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExistant = await Utilisateur.findOne({
            where: { nomUtilisateur }
        });

        if (utilisateurExistant) {
            return res.status(400).json({
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }

        // Vérifier que le rôle est valide
        if (role && !['Administrateur', 'Médecin'].includes(role)) {
            return res.status(400).json({
                message: "Rôle non valide. Les rôles acceptés sont 'Administrateur' et 'Médecin'"
            });
        }

        // Créer l'utilisateur
        const nouvelUtilisateur = await Utilisateur.create({
            nomUtilisateur,
            motDePasse,
            role: role || 'Administrateur' // Rôle par défaut
        });

        // Exclure le mot de passe de la réponse
        const { motDePasse: _, ...utilisateurSansMdp } = nouvelUtilisateur.toJSON();

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            utilisateur: utilisateurSansMdp
        });
    } catch (erreur) {
        console.error('Erreur lors de la création de l\'utilisateur:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        if (erreur.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }

        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

/**
 * Mettre à jour un utilisateur
 * @route PUT /api/utilisateurs/:id
 */
exports.mettreAJourUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomUtilisateur, motDePasse, role } = req.body;

        // Trouver l'utilisateur
        const utilisateur = await Utilisateur.findByPk(id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier que le rôle est valide
        if (role && !['Administrateur', 'Médecin'].includes(role)) {
            return res.status(400).json({
                message: "Rôle non valide. Les rôles acceptés sont 'Administrateur' et 'Médecin'"
            });
        }

        // Préparer les données à mettre à jour
        const donneesMiseAJour = {};

        if (nomUtilisateur) {
            // Vérifier si le nouveau nom d'utilisateur est déjà pris
            if (nomUtilisateur !== utilisateur.nomUtilisateur) {
                const utilisateurExistant = await Utilisateur.findOne({
                    where: { nomUtilisateur }
                });

                if (utilisateurExistant) {
                    return res.status(400).json({
                        message: "Ce nom d'utilisateur est déjà pris"
                    });
                }
            }

            donneesMiseAJour.nomUtilisateur = nomUtilisateur;
        }

        if (motDePasse) {
            donneesMiseAJour.motDePasse = motDePasse;
        }

        if (role) {
            donneesMiseAJour.role = role;
        }

        // Mettre à jour l'utilisateur
        await utilisateur.update(donneesMiseAJour);

        // Récupérer l'utilisateur mis à jour sans le mot de passe
        const utilisateurMisAJour = await Utilisateur.findByPk(id, {
            attributes: { exclude: ['motDePasse'] }
        });

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès",
            utilisateur: utilisateurMisAJour
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        if (erreur.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

/**
 * Supprimer un utilisateur
 * @route DELETE /api/utilisateurs/:id
 */
exports.supprimerUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'utilisateur existe
        const utilisateur = await Utilisateur.findByPk(id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Empêcher la suppression de son propre compte
        if (parseInt(id) === req.utilisateur.id) {
            return res.status(400).json({
                message: "Vous ne pouvez pas supprimer votre propre compte"
            });
        }

        // Supprimer l'utilisateur
        await utilisateur.destroy();

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (erreur) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', erreur);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
};

/**
 * Changer son propre mot de passe
 * @route PUT /api/utilisateurs/mot-de-passe/changer
 */
exports.changerMotDePasse = async (req, res) => {
    try {
        const { ancienMotDePasse, nouveauMotDePasse } = req.body;

        // Validation des champs obligatoires
        if (!ancienMotDePasse || !nouveauMotDePasse) {
            return res.status(400).json({
                message: "L'ancien et le nouveau mot de passe sont obligatoires"
            });
        }

        // Trouver l'utilisateur connecté
        const utilisateur = await Utilisateur.findByPk(req.utilisateur.id);

        // Vérifier l'ancien mot de passe
        const motDePasseValide = await utilisateur.verifierMotDePasse(ancienMotDePasse);
        if (!motDePasseValide) {
            return res.status(401).json({ message: "Ancien mot de passe incorrect" });
        }

        // Mettre à jour le mot de passe
        await utilisateur.update({ motDePasse: nouveauMotDePasse });

        res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } catch (erreur) {
        console.error('Erreur lors du changement de mot de passe:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors du changement de mot de passe" });
    }
};