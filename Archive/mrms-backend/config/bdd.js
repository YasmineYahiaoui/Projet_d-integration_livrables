/**
 * Configuration de la base de données SQLite avec Sequelize
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const { BDD_CHEMIN } = require('./config');

// Créer une instance Sequelize avec SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', BDD_CHEMIN),
    logging: false, // Mettre à true pour voir les requêtes SQL dans la console
});

module.exports = {
    sequelize,
    Sequelize
};