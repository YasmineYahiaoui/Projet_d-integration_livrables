/**
 * Routes pour la gestion des FAQs
 */

const express = require('express');
const router = express.Router();
const faqControleur = require('../controleurs/faq.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Routes accessibles sans authentification
router.get('/publiques', faqControleur.obtenirFAQsPubliques);

// Toutes les autres routes nécessitent une authentification
router.use(verifierToken);

// Routes pour obtenir et soumettre des questions
router.get('/', faqControleur.obtenirToutesFAQs);
router.post('/', faqControleur.soumettreQuestion);

// Routes pour gérer les réponses (administrateurs uniquement)
router.put('/:id', roleMiddleware.estAdministrateur, faqControleur.repondreQuestion);
router.delete('/:id', roleMiddleware.estAdministrateur, faqControleur.supprimerQuestion);

module.exports = router;