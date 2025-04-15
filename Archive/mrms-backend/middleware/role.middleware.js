/**
 * Middleware pour vérifier le rôle de l'utilisateur
 */

/**
 * Vérifie si l'utilisateur a le rôle de médecin
 */
exports.estMedecin = (req, res, next) => {
    // req.utilisateur est défini par le middleware d'authentification
    if (req.utilisateur && req.utilisateur.role === 'Médecin') {
        return next();
    }

    return res.status(403).json({
        message: "Accès refusé. Cette fonctionnalité est réservée aux médecins."
    });
};

/**
 * Vérifie si l'utilisateur a le rôle d'administrateur
 */
exports.estAdministrateur = (req, res, next) => {
    // req.utilisateur est défini par le middleware d'authentification
    if (req.utilisateur && req.utilisateur.role === 'Administrateur') {
        return next();
    }

    return res.status(403).json({
        message: "Accès refusé. Cette fonctionnalité est réservée aux administrateurs."
    });
};

/**
 * Vérifie si l'utilisateur est un médecin ou un administrateur
 */
exports.estMedecinOuAdministrateur = (req, res, next) => {
    // req.utilisateur est défini par le middleware d'authentification
    if (req.utilisateur &&
        (req.utilisateur.role === 'Médecin' || req.utilisateur.role === 'Administrateur')) {
        return next();
    }

    return res.status(403).json({
        message: "Accès refusé. Vous n'avez pas les droits nécessaires."
    });
};