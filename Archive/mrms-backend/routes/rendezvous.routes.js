/**
 * Routes pour la gestion des rendez-vous
 */

const express = require('express');
const router = express.Router();
const rendezvousControleur = require('../controleurs/rendezvous.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifierToken);

// Routes pour obtenir les données de référence
router.get('/statuts', rendezvousControleur.obtenirStatutsRendezVous);
router.get('/types-notification', rendezvousControleur.obtenirTypesNotification);

// Routes pour la gestion des disponibilités
router.get('/disponibilite', rendezvousControleur.verifierDisponibilite);
router.get('/creneaux-disponibles', rendezvousControleur.obtenirCreneauxDisponibles);

// Routes pour la gestion des rendez-vous
router.get('/', rendezvousControleur.obtenirTousLesRendezVous);
router.get('/:id', rendezvousControleur.obtenirRendezVousParId);
router.post('/', rendezvousControleur.creerRendezVous);
router.put('/:id', rendezvousControleur.mettreAJourRendezVous);
router.delete('/:id', rendezvousControleur.supprimerRendezVous);

module.exports = router;