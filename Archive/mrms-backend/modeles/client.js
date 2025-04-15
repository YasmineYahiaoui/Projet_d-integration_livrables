/**
 * Modèle Client pour représenter les patients du système
 */

const { sequelize, Sequelize } = require('../config/bdd');
const TypePatient = require('./typePatient');
const Langue = require('./langue');
const PreferenceContact = require('./preferenceContact');

const Client = sequelize.define('Client', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    prenom: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le prénom ne peut pas être vide" }
        }
    },
    nom: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le nom ne peut pas être vide" }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isEmail: { msg: "Format d'email non valide" }
        }
    },
    telephone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    typePatientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: TypePatient,
            key: 'id'
        }
    },
    langueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Langue,
            key: 'id'
        }
    },
    preferenceContactId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PreferenceContact,
            key: 'id'
        }
    },
    notesMedicales: {
        type: Sequelize.TEXT,
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
    tableName: 'clients',
    timestamps: true,
    // Renommer createdAt et updatedAt en français
    createdAt: 'dateCreation',
    updatedAt: 'dateModification',
    hooks: {
        beforeUpdate: (client) => {
            client.dateModification = new Date();
        }
    }
});

// Définir les relations
Client.belongsTo(TypePatient, { foreignKey: 'typePatientId', as: 'typePatient' });
Client.belongsTo(Langue, { foreignKey: 'langueId', as: 'langue' });
Client.belongsTo(PreferenceContact, { foreignKey: 'preferenceContactId', as: 'preferenceContact' });

// Créer un index sur le nom et prénom pour les recherches
Client.addHook('afterSync', async () => {
    try {
        await sequelize.query(
            'CREATE INDEX IF NOT EXISTS idx_nom_prenom ON clients (nom, prenom);'
        );
    } catch (erreur) {
        console.error('Erreur lors de la création de l\'index:', erreur);
    }
});

module.exports = Client;