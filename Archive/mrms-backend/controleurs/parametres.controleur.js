/**
 * Contrôleur pour gérer les paramètres de l'application
 */

const { sequelize } = require('../config/bdd');
const fs = require('fs');
const path = require('path');

// Définir les paramètres par défaut
const parametresParDefaut = {
    application: {
        nomApplication: 'MRMS',
        version: '1.0.0',
        theme: 'clair',
        langueParDefaut: 'Français'
    },
    rendezvous: {
        heureDebut: '08:00',
        heureFin: '18:00',
        dureeParDefaut: 30,
        intervalleCreneaux: 30,
        joursOuvrables: [1, 2, 3, 4, 5] // Lundi à Vendredi
    },
    notifications: {
        activerEmailsAutomatiques: true,
        activerSMSAutomatiques: false,
        emailExpediteur: 'contact@mrms.com',
        delaiRappel: 24 // heures avant rendez-vous
    }
};

// Chemin vers le fichier de paramètres
const parametresFichier = path.join(__dirname, '..', 'donnees', 'parametres.json');

// Fonction pour charger les paramètres
const chargerParametres = () => {
    try {
        // Vérifier si le fichier existe
        if (!fs.existsSync(parametresFichier)) {
            // Créer le dossier 'donnees' s'il n'existe pas
            const dossierDonnees = path.join(__dirname, '..', 'donnees');
            if (!fs.existsSync(dossierDonnees)) {
                fs.mkdirSync(dossierDonnees, { recursive: true });
            }

            // Créer le fichier avec les paramètres par défaut
            fs.writeFileSync(parametresFichier, JSON.stringify(parametresParDefaut, null, 2));
            return parametresParDefaut;
        }

        // Lire et parser le fichier
        const contenu = fs.readFileSync(parametresFichier, 'utf8');
        return JSON.parse(contenu);
    } catch (erreur) {
        console.error('Erreur lors du chargement des paramètres:', erreur);
        return parametresParDefaut;
    }
};

// Fonction pour sauvegarder les paramètres
const sauvegarderParametres = (parametres) => {
    try {
        // Créer le dossier 'donnees' s'il n'existe pas
        const dossierDonnees = path.join(__dirname, '..', 'donnees');
        if (!fs.existsSync(dossierDonnees)) {
            fs.mkdirSync(dossierDonnees, { recursive: true });
        }

        // Écrire les paramètres dans le fichier
        fs.writeFileSync(parametresFichier, JSON.stringify(parametres, null, 2));
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la sauvegarde des paramètres:', erreur);
        return false;
    }
};

/**
 * Obtenir tous les paramètres
 * @route GET /api/parametres
 */
exports.obtenirParametres = (req, res) => {
    try {
        const parametres = chargerParametres();
        res.status(200).json(parametres);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des paramètres:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des paramètres" });
    }
};

/**
 * Mettre à jour les paramètres
 * @route PUT /api/parametres
 */
exports.mettreAJourParametres = (req, res) => {
    try {
        const nouveauxParametres = req.body;

        // Validation de base
        if (!nouveauxParametres || typeof nouveauxParametres !== 'object') {
            return res.status(400).json({ message: "Format de paramètres invalide" });
        }

        // Charger les paramètres existants
        const parametresExistants = chargerParametres();

        // Fusionner avec les nouveaux paramètres (mise à jour récursive)
        const mettreAJourRecursif = (existant, nouveau) => {
            for (const cle in nouveau) {
                if (typeof nouveau[cle] === 'object' && nouveau[cle] !== null && existant[cle]) {
                    mettreAJourRecursif(existant[cle], nouveau[cle]);
                } else {
                    existant[cle] = nouveau[cle];
                }
            }
        };

        mettreAJourRecursif(parametresExistants, nouveauxParametres);

        // Sauvegarder les paramètres mis à jour
        const sauvegarde = sauvegarderParametres(parametresExistants);

        if (!sauvegarde) {
            return res.status(500).json({ message: "Erreur lors de la sauvegarde des paramètres" });
        }

        res.status(200).json({
            message: "Paramètres mis à jour avec succès",
            parametres: parametresExistants
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour des paramètres:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres" });
    }
};

/**
 * Obtenir les paramètres des rendez-vous
 * @route GET /api/parametres/rendezvous
 */
exports.obtenirParametresRendezVous = (req, res) => {
    try {
        const parametres = chargerParametres();
        res.status(200).json(parametres.rendezvous || parametresParDefaut.rendezvous);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des paramètres de rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des paramètres de rendez-vous" });
    }
};

/**
 * Mettre à jour les paramètres des rendez-vous
 * @route PUT /api/parametres/rendezvous
 */
exports.mettreAJourParametresRendezVous = (req, res) => {
    try {
        const nouveauxParametresRendezVous = req.body;

        // Validation de base
        if (!nouveauxParametresRendezVous || typeof nouveauxParametresRendezVous !== 'object') {
            return res.status(400).json({ message: "Format de paramètres invalide" });
        }

        // Validation spécifique
        if (nouveauxParametresRendezVous.dureeParDefaut &&
            (nouveauxParametresRendezVous.dureeParDefaut < 5 || nouveauxParametresRendezVous.dureeParDefaut > 120)) {
            return res.status(400).json({ message: "La durée par défaut doit être entre 5 et 120 minutes" });
        }

        // Charger les paramètres existants
        const parametres = chargerParametres();

        // Mettre à jour les paramètres de rendez-vous
        parametres.rendezvous = {
            ...parametres.rendezvous,
            ...nouveauxParametresRendezVous
        };

        // Sauvegarder les paramètres mis à jour
        const sauvegarde = sauvegarderParametres(parametres);

        if (!sauvegarde) {
            return res.status(500).json({ message: "Erreur lors de la sauvegarde des paramètres" });
        }

        res.status(200).json({
            message: "Paramètres de rendez-vous mis à jour avec succès",
            parametresRendezVous: parametres.rendezvous
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour des paramètres de rendez-vous:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres de rendez-vous" });
    }
};

/**
 * Obtenir les paramètres des notifications
 * @route GET /api/parametres/notifications
 */
exports.obtenirParametresNotifications = (req, res) => {
    try {
        const parametres = chargerParametres();
        res.status(200).json(parametres.notifications || parametresParDefaut.notifications);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des paramètres de notifications:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des paramètres de notifications" });
    }
};

/**
 * Mettre à jour les paramètres des notifications
 * @route PUT /api/parametres/notifications
 */
exports.mettreAJourParametresNotifications = (req, res) => {
    try {
        const nouveauxParametresNotifications = req.body;

        // Validation de base
        if (!nouveauxParametresNotifications || typeof nouveauxParametresNotifications !== 'object') {
            return res.status(400).json({ message: "Format de paramètres invalide" });
        }

        // Validation spécifique pour l'email
        if (nouveauxParametresNotifications.emailExpediteur &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nouveauxParametresNotifications.emailExpediteur)) {
            return res.status(400).json({ message: "Format d'email non valide" });
        }

        // Charger les paramètres existants
        const parametres = chargerParametres();

        // Mettre à jour les paramètres de notifications
        parametres.notifications = {
            ...parametres.notifications,
            ...nouveauxParametresNotifications
        };

        // Sauvegarder les paramètres mis à jour
        const sauvegarde = sauvegarderParametres(parametres);

        if (!sauvegarde) {
            return res.status(500).json({ message: "Erreur lors de la sauvegarde des paramètres" });
        }

        res.status(200).json({
            message: "Paramètres de notifications mis à jour avec succès",
            parametresNotifications: parametres.notifications
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour des paramètres de notifications:', erreur);
        res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres de notifications" });
    }
};