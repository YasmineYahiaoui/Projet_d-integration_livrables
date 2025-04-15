/**
 * Routes pour le tableau de bord
 */

const express = require('express');
const router = express.Router();
const tableauBordControleur = require('../controleurs/tableauBord.controleur');
const verifierToken = require('../middleware/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifierToken);

// Routes du tableau de bord
router.get('/statistiques', tableauBordControleur.obtenirStatistiquesDashboard);
router.get('/rendezvous-recents', tableauBordControleur.obtenirRendezvousRecents);
router.get('/patients-recents', tableauBordControleur.obtenirPatientsRecents);

module.exports = router;