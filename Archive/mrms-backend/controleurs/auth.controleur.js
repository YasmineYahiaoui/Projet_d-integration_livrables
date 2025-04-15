/**
 * Contrôleur pour gérer l'authentification des utilisateurs
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/config');
const Utilisateur = require('../modeles/utilisateur');
const Client = require('../modeles/client');

/**
 * Connecter un utilisateur
 * @route POST /api/auth/connexion
 */
exports.connexion = async (req, res) => {
    try {
        console.log('=== CONNEXION ATTEMPT ===');
        console.log('Request body:', req.body);

        const { nomUtilisateur, motDePasse } = req.body;
        console.log('Extracted credentials:', { nomUtilisateur, password: motDePasse ? '****' : undefined });

        // Vérifier si les champs sont remplis
        if (!nomUtilisateur || !motDePasse) {
            console.log('Authentication failed: Missing required fields');
            return res.status(400).json({
                message: "Le nom d'utilisateur et le mot de passe sont requis"
            });
        }

        // Trouver l'utilisateur
        console.log('Searching for user in database:', nomUtilisateur);
        const utilisateur = await Utilisateur.findOne({ where: { nomUtilisateur } });
        console.log('User found in database:', utilisateur ? 'Yes' : 'No');

        if (!utilisateur) {
            console.log('Authentication failed: User not found');
            return res.status(401).json({
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }

        // Vérifier le mot de passe
        console.log('Verifying password...');
        const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
        console.log('Password valid:', motDePasseValide ? 'Yes' : 'No');

        if (!motDePasseValide) {
            console.log('Authentication failed: Invalid password');
            return res.status(401).json({
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }

        // Ajouter clientId dans le token pour les patients
        const tokenData = {
            id: utilisateur.id,
            role: utilisateur.role
        };

        if (utilisateur.role === 'Patient' && utilisateur.clientId) {
            tokenData.clientId = utilisateur.clientId;
        }

        // Créer le token JWT
        console.log('Creating JWT token for user:', utilisateur.id);
        const token = jwt.sign(
            tokenData,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );
        console.log('JWT token created successfully');

        // Envoyer la réponse
        console.log('Authentication successful');
        res.status(200).json({
            id: utilisateur.id,
            nomUtilisateur: utilisateur.nomUtilisateur,
            role: utilisateur.role,
            clientId: utilisateur.clientId,
            token
        });
    } catch (erreur) {
        console.error('=== ERROR DURING AUTHENTICATION ===');
        console.error('Error details:', erreur);
        console.error('Error message:', erreur.message);
        console.error('Error stack:', erreur.stack);

        res.status(500).json({
            message: "Erreur lors de la connexion",
            details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
        });
    }
};

/**
 * Inscrire un nouveau patient
 * @route POST /api/auth/inscription-patient
 */
exports.inscriptionPatient = async (req, res) => {
    try {
        console.log('=== PATIENT REGISTRATION ===');
        console.log('Request body:', req.body);

        const { prenom, nom, email, telephone, motDePasse } = req.body;

        // Vérifier si les champs obligatoires sont présents
        if (!prenom || !nom || !email || !motDePasse) {
            return res.status(400).json({
                message: "Le prénom, le nom, l'email et le mot de passe sont obligatoires"
            });
        }

        // Vérifier si l'email est déjà utilisé (pour un patient ou un utilisateur)
        const utilisateurExistant = await Utilisateur.findOne({ where: { nomUtilisateur: email } });

        if (utilisateurExistant) {
            return res.status(400).json({
                message: "Cette adresse email est déjà utilisée"
            });
        }

        // Créer le client (patient)
        const nouveauClient = await Client.create({
            prenom,
            nom,
            email,
            telephone: telephone || null,
            typePatientId: 3, // Type "Nouveau" par défaut
            langueId: 1, // Langue "Français" par défaut
            preferenceContactId: 1, // Préférence "Email" par défaut
            notesMedicales: null
        });

        // IMPORTANT: Do NOT manually hash password here
        // Let the model's beforeCreate hook handle it
        const nouvelUtilisateur = await Utilisateur.create({
            nomUtilisateur: email, // Utiliser l'email comme nom d'utilisateur
            motDePasse: motDePasse, // Raw password - will be hashed by model hook
            role: 'Patient',
            clientId: nouveauClient.id
        });

        // Créer le token JWT
        const token = jwt.sign(
            {
                id: nouvelUtilisateur.id,
                role: 'Patient',
                clientId: nouveauClient.id
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(201).json({
            message: "Compte patient créé avec succès",
            id: nouvelUtilisateur.id,
            nomUtilisateur: email,
            role: 'Patient',
            clientId: nouveauClient.id,
            token
        });
    } catch (erreur) {
        console.error('=== ERROR DURING PATIENT REGISTRATION ===');
        console.error('Error details:', erreur);
        console.error('Error message:', erreur.message);
        console.error('Error stack:', erreur.stack);

        // Gestion des erreurs spécifiques
        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        if (erreur.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: "Un compte avec ces informations existe déjà"
            });
        }

        res.status(500).json({
            message: "Erreur lors de l'inscription",
            details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
        });
    }
};

/**
 * Déconnecter un utilisateur (invalider le token côté client)
 * @route POST /api/auth/deconnexion
 */
exports.deconnexion = (req, res) => {
    console.log('User logged out');
    // La déconnexion est gérée côté client en supprimant le token
    res.status(200).json({ message: "Déconnexion réussie" });
};

/**
 * Obtenir les informations de l'utilisateur connecté
 * @route GET /api/auth/moi
 */
exports.obtenirUtilisateurCourant = async (req, res) => {
    try {
        console.log('Getting current user info, user ID:', req.utilisateur.id);

        // L'ID de l'utilisateur est extrait du token par le middleware auth
        const utilisateur = await Utilisateur.findByPk(req.utilisateur.id, {
            attributes: ['id', 'nomUtilisateur', 'role', 'clientId', 'dateCreation']
        });

        console.log('User found:', utilisateur ? 'Yes' : 'No');

        if (!utilisateur) {
            console.log('User not found in database despite valid token');
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Si c'est un patient, récupérer les informations du client associé
        let clientInfo = null;
        if (utilisateur.role === 'Patient' && utilisateur.clientId) {
            clientInfo = await Client.findByPk(utilisateur.clientId, {
                attributes: ['id', 'prenom', 'nom', 'email', 'telephone']
            });
        }

        console.log('Returning user data');
        res.status(200).json({
            ...utilisateur.toJSON(),
            client: clientInfo
        });
    } catch (erreur) {
        console.error('Error getting current user info:', erreur);
        console.error('Error stack:', erreur.stack);

        res.status(500).json({
            message: "Erreur lors de la récupération des informations utilisateur",
            details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
        });
    }
};