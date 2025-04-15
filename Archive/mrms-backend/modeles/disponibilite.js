// modeles/disponibilite.js
const { sequelize, Sequelize } = require('../config/bdd');
const Utilisateur = require('./utilisateur');

const Disponibilite = sequelize.define('Disponibilite', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    medecinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'id'
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    heureDebut: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
    },
    heureFin: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
    },
    recurrence: {
        type: Sequelize.ENUM('aucune', 'quotidienne', 'hebdomadaire', 'mensuelle'),
        defaultValue: 'aucune'
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
    tableName: 'disponibilites',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification'
});

Disponibilite.belongsTo(Utilisateur, { foreignKey: 'medecinId', as: 'medecin' });

module.exports = Disponibilite;