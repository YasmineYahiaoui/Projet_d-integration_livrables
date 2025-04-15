/**
 * Configuration des variables d'environnement pour l'application
 */

require('dotenv').config();

module.exports = {
    // Port du serveur
    PORT: process.env.PORT || 3000,

    // Configuration de la base de données
    BDD_CHEMIN: process.env.BDD_CHEMIN || 'donnees/mrms.sqlite',

    // Configuration JWT
    JWT_SECRET: process.env.JWT_SECRET || 'mrms-secret-key',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',

    // Environnement
    NODE_ENV: process.env.NODE_ENV || 'development'
};