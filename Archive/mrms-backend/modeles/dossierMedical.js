// modeles/dossierMedical.js
const { sequelize, Sequelize } = require('../config/bdd');
const Client = require('./client');

const DossierMedical = sequelize.define('DossierMedical', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Client,
            key: 'id'
        }
    },
    antecedents: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    allergies: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    medicationsActuelles: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    groupeSanguin: {
        type: Sequelize.STRING,
        allowNull: true
    },
    taille: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    poids: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    dateNaissance: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    sexe: {
        type: Sequelize.ENUM('M', 'F', 'Autre'),
        allowNull: true
    },
    dateCreation: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    dateModification: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'dossiers_medicaux',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification'
});

DossierMedical.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Client.hasOne(DossierMedical, { foreignKey: 'clientId', as: 'dossierMedical' });

module.exports = DossierMedical;