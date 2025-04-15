/**
 * Fichier principal du serveur pour l'API MRMS
 * Ce fichier initialise l'application Express et configure les middlewares
 */

// Importation des modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./config/bdd');
const { PORT } = require('./config/config');

// Importer les routes
const authRoutes = require('./routes/auth.routes');
const utilisateursRoutes = require('./routes/utilisateurs.routes');
const clientsRoutes = require('./routes/clients.routes');
const rendezvousRoutes = require('./routes/rendezvous.routes');
const parametresRoutes = require('./routes/parametres.routes');
const tableauBordRoutes = require('./routes/tableauBord.routes');
const faqRoutes = require('./routes/faq.routes');
const testRoute = require('./routes/test.route');
const patientRoutes = require('./routes/patient.routes');
const medecinRoutes = require('./routes/medecin.routes');

// Initialiser l'application Express
const app = express();

// Configurer les middlewares
app.use(helmet()); // Sécurité
app.use(cors()); // Permettre les requêtes cross-origin
app.use(express.json()); // Parser pour JSON
app.use(express.urlencoded({ extended: true })); // Parser pour les formulaires
app.use(morgan('dev')); // Logger les requêtes HTTP

// Routes de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API MRMS' });
});

// Enregistrer les routes
app.use('/api/test', testRoute);
app.use('/api/auth', authRoutes);
app.use('/api/utilisateurs', utilisateursRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/rendezvous', rendezvousRoutes);
app.use('/api/parametres', parametresRoutes);
app.use('/api/tableauBord', tableauBordRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medecin', medecinRoutes);
// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erreur serveur',
        erreur: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Synchroniser la base de données et démarrer le serveur
const demarrerServeur = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');

        // Synchroniser les modèles avec la base de données
        // En production, utilisez { force: false }
        await sequelize.sync({ force: false });
        console.log('Base de données synchronisée');

        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
        });
    } catch (erreur) {
        console.error('Impossible de se connecter à la base de données:', erreur);
        process.exit(1);
    }
};

demarrerServeur();