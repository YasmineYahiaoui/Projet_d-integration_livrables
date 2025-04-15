// routes/patient.routes.js
/**
 * Routes pour la gestion des patients connectés
 */

const express = require('express');
const router = express.Router();
const patientControleur = require('../controleurs/patient.controleur');
const verifierToken = require('../middleware/auth.middleware');

// Middleware pour vérifier le rôle patient
const verifierRolePatient = (req, res, next) => {
    if (req.utilisateur && req.utilisateur.role === 'Patient') {
        return next();
    }
    return res.status(403).json({ message: "Accès non autorisé. Rôle Patient requis." });
};

// Toutes les routes nécessitent une authentification et le rôle Patient
router.use(verifierToken);
router.use(verifierRolePatient);

// Routes pour le profil patient
router.get('/mon-profil', patientControleur.obtenirMonProfil);
router.put('/mon-profil', patientControleur.mettreAJourMonProfil);

// Routes pour les rendez-vous du patient
router.get('/mes-rendez-vous', patientControleur.obtenirMesRendezVous);
router.post('/prendre-rendez-vous', patientControleur.prendreRendezVous);
router.put('/annuler-rendez-vous/:id', patientControleur.annulerRendezVous);
router.get('/creneaux-disponibles', patientControleur.obtenirCreneauxDisponibles);

// Nouvelle route pour le dossier médical
router.get('/dossier-medical', patientControleur.obtenirDossierMedical);

// Routes pour obtenir des informations utiles
router.get('/medecins', patientControleur.obtenirMedecins);

module.exports = router;