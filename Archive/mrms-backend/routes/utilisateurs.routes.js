/**
 * Routes pour la gestion des utilisateurs
 */

const express = require('express');
const router = express.Router();
const utilisateursControleur = require('../controleurs/utilisateurs.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifierToken);

// Routes accessibles uniquement aux administrateurs
router.get('/', roleMiddleware.estAdministrateur, utilisateursControleur.obtenirTousLesUtilisateurs);
router.post('/', roleMiddleware.estAdministrateur, utilisateursControleur.creerUtilisateur);
router.get('/:id', roleMiddleware.estAdministrateur, utilisateursControleur.obtenirUtilisateurParId);
router.put('/:id', roleMiddleware.estAdministrateur, utilisateursControleur.mettreAJourUtilisateur);
router.delete('/:id', roleMiddleware.estAdministrateur, utilisateursControleur.supprimerUtilisateur);

// Route pour changer son propre mot de passe (accessible à tous les utilisateurs authentifiés)
router.put('/mot-de-passe/changer', utilisateursControleur.changerMotDePasse);

module.exports = router;