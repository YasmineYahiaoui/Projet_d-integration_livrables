// modeles/noteMedicale.js
const { sequelize, Sequelize } = require('../config/bdd');
const Utilisateur = require('./utilisateur');
const Client = require('./client');
const RendezVous = require('./rendezvous');

const NoteMedicale = sequelize.define('NoteMedicale', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rendezVousId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: RendezVous,
            key: 'id'
        }
    },
    medecinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'id'
        }
    },
    clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id'
        }
    },
    contenu: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    diagnostic: {
        type: Sequelize.STRING,
        allowNull: true
    },
    traitement: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    prive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    tableName: 'notes_medicales',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification'
});

NoteMedicale.belongsTo(RendezVous, { foreignKey: 'rendezVousId', as: 'rendezVous' });
NoteMedicale.belongsTo(Utilisateur, { foreignKey: 'medecinId', as: 'medecin' });
NoteMedicale.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

module.exports = NoteMedicale;
// test 
