/**
 * Routes pour la gestion des clients (patients)
 */

const express = require('express');
const router = express.Router();
const clientsControleur = require('../controleurs/clients.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifierToken);

// Routes pour obtenir les données de référence (accessibles à tous les utilisateurs authentifiés)
router.get('/types', clientsControleur.obtenirTypesPatients);
router.get('/langues', clientsControleur.obtenirLangues);
router.get('/preferences-contact', clientsControleur.obtenirPreferencesContact);

// IMPORTANT: Route '/nouveau' doit être définie AVANT '/:id' pour éviter les conflits
router.get('/nouveau', clientsControleur.obtenirFormulaireNouveauClient);

// Routes pour la gestion des clients
router.get('/', clientsControleur.obtenirTousLesClients);
router.get('/:id', clientsControleur.obtenirClientParId);

// Routes pour ajouter/modifier/supprimer des clients
router.post('/', clientsControleur.creerClient);
router.put('/:id', clientsControleur.mettreAJourClient);
router.delete('/:id', clientsControleur.supprimerClient);

module.exports = router;