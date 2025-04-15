/**
 * Routes pour la gestion des paramètres
 */

const express = require('express');
const router = express.Router();
const parametresControleur = require('../controleurs/parametres.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifierToken);

// Obtenir les paramètres globaux
router.get('/', parametresControleur.obtenirParametres);

// Mettre à jour les paramètres (accessible aux administrateurs uniquement)
router.put('/', roleMiddleware.estAdministrateur, parametresControleur.mettreAJourParametres);

// Paramètres des rendez-vous
router.get('/rendezvous', parametresControleur.obtenirParametresRendezVous);
router.put('/rendezvous', roleMiddleware.estAdministrateur, parametresControleur.mettreAJourParametresRendezVous);

// Paramètres des notifications
router.get('/notifications', parametresControleur.obtenirParametresNotifications);
router.put('/notifications', roleMiddleware.estAdministrateur, parametresControleur.mettreAJourParametresNotifications);

module.exports = router;