/**
 * Middleware pour vérifier l'authentification de l'utilisateur
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

/**
 * Vérifie si l'utilisateur est authentifié via le token JWT
 */
const verifierToken = (req, res, next) => {
    // Récupérer le token du header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    // Si aucun token n'est fourni
    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Ajouter les informations de l'utilisateur à la requête
        req.utilisateur = decoded;

        // Passer au middleware suivant
        next();
    } catch (erreur) {
        console.error('Erreur de vérification du token:', erreur);

        if (erreur.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expirée. Veuillez vous reconnecter." });
        }

        return res.status(401).json({ message: "Token non valide." });
    }
};

module.exports = verifierToken;