// routes/medecin.routes.js
const express = require('express');
const router = express.Router();
const medecinControleur = require('../controleurs/medecin.controleur');
const verifierToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Middleware pour vérifier si l'utilisateur est un médecin
const estMedecin = (req, res, next) => {
    if (req.utilisateur.role === 'Médecin') {
        return next();
    }
    return res.status(403).json({ message: "Accès non autorisé. Rôle Médecin requis." });
};

// Toutes les routes nécessitent une authentification et le rôle Médecin
router.use(verifierToken);
router.use(estMedecin);

// Routes du profil médecin
router.get('/profil', medecinControleur.obtenirProfil);
router.put('/profil', medecinControleur.mettreAJourProfil);

// Routes des rendez-vous
router.get('/rendez-vous', medecinControleur.obtenirRendezVous);
router.get('/rendez-vous/:id', medecinControleur.obtenirRendezVousParId);
router.put('/rendez-vous/:id/statut', medecinControleur.mettreAJourStatutRendezVous);
router.post('/rendez-vous/:id/notes', medecinControleur.ajouterNoteMedicale);

// Routes des disponibilités
router.get('/disponibilites', medecinControleur.obtenirDisponibilites);
router.post('/disponibilites', medecinControleur.definirDisponibilite);
router.delete('/disponibilites/:id', medecinControleur.supprimerDisponibilite);

// Routes des patients
router.get('/patients', medecinControleur.obtenirPatients);
router.get('/patients/:id', medecinControleur.obtenirPatientParId);
router.put('/patients/:id/notes-medicales', medecinControleur.mettreAJourNotesMedicales);

module.exports = router;