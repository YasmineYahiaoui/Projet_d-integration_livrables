/**
 * Routes pour l'authentification des utilisateurs
 */

const express = require('express');
const router = express.Router();
const authControleur = require('../controleurs/auth.controleur');
const verifierToken = require('../middleware/auth.middleware');

// Route pour la connexion
router.post('/connexion', authControleur.connexion);

// Route pour l'inscription des patients
router.post('/inscription-patient', authControleur.inscriptionPatient);

// Route pour la déconnexion
router.post('/deconnexion', authControleur.deconnexion);

// Route pour obtenir les informations de l'utilisateur connecté
router.get('/moi', verifierToken, authControleur.obtenirUtilisateurCourant);

module.exports = router;