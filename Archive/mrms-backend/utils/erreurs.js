/**
 * Utilitaires de gestion des erreurs pour l'API
 */

/**
 * Classe personnalisée pour les erreurs de l'API
 */
class APIErreur extends Error {
    constructor(message, statusCode = 500, erreurs = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.erreurs = erreurs;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Gestionnaire d'erreurs central pour les routes Express
 */
exports.gestionnaireErreurs = (err, req, res, next) => {
    console.error('Erreur:', err);

    // Si c'est une erreur API personnalisée
    if (err instanceof APIErreur) {
        return res.status(err.statusCode).json({
            message: err.message,
            erreurs: err.erreurs
        });
    }

    // Erreurs Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: "Données invalides",
            erreurs: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: "Violation de contrainte d'unicité",
            erreurs: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            message: "Référence à une entité inexistante",
            erreurs: [err.message]
        });
    }

    // Erreurs JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: "Token non valide"
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: "Session expirée. Veuillez vous reconnecter."
        });
    }

    // Erreur par défaut
    return res.status(500).json({
        message: "Erreur serveur interne",
        erreur: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

/**
 * Créer une erreur 404 (ressource non trouvée)
 */
exports.erreur404 = (message = "Ressource non trouvée") => {
    return new APIErreur(message, 404);
};

/**
 * Créer une erreur 400 (requête invalide)
 */
exports.erreur400 = (message = "Requête invalide", erreurs = null) => {
    return new APIErreur(message, 400, erreurs);
};

/**
 * Créer une erreur 401 (non authentifié)
 */
exports.erreur401 = (message = "Non authentifié") => {
    return new APIErreur(message, 401);
};

/**
 * Créer une erreur 403 (non autorisé)
 */
exports.erreur403 = (message = "Accès refusé") => {
    return new APIErreur(message, 403);
};

/**
 * Créer une erreur 500 (erreur serveur)
 */
exports.erreur500 = (message = "Erreur serveur interne") => {
    return new APIErreur(message, 500);
};

// Exporter la classe d'erreur et les fonctions utilitaires
exports.APIErreur = APIErreur;