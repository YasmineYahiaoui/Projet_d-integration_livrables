/**
 * Modèle RendezVous pour représenter les rendez-vous du système
 */

const { sequelize, Sequelize } = require('../config/bdd');
const Client = require('./client');
const Utilisateur = require('./utilisateur');
const TypeNotification = require('./typeNotification');
const StatutRendezVous = require('./statutRendezVous');

const RendezVous = sequelize.define('RendezVous', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id'
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: { msg: "Format de date non valide" }
        }
    },
    heure: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: "Format d'heure non valide (HH:MM)"
            }
        }
    },
    duree: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30, // durée par défaut en minutes
        validate: {
            min: {
                args: [5],
                msg: "La durée minimale est de 5 minutes"
            }
        }
    },
    typeNotificationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: TypeNotification,
            key: 'id'
        }
    },
    statutId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Programmé par défaut
        references: {
            model: StatutRendezVous,
            key: 'id'
        }
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    creeParId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'id'
        }
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
    tableName: 'rendezvous',
    timestamps: true,
    // Renommer createdAt et updatedAt en français
    createdAt: 'dateCreation',
    updatedAt: 'dateModification',
    hooks: {
        beforeUpdate: (rendezvous) => {
            rendezvous.dateModification = new Date();
        }
    }
});

// Définir les relations
RendezVous.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
RendezVous.belongsTo(Utilisateur, { foreignKey: 'creeParId', as: 'creePar' });
RendezVous.belongsTo(TypeNotification, { foreignKey: 'typeNotificationId', as: 'typeNotification' });
RendezVous.belongsTo(StatutRendezVous, { foreignKey: 'statutId', as: 'statut' });

// Créer des index pour les recherches fréquentes
RendezVous.addHook('afterSync', async () => {
    try {
        await sequelize.query(
            'CREATE INDEX IF NOT EXISTS idx_date_heure ON rendezvous (date, heure);'
        );
        await sequelize.query(
            'CREATE INDEX IF NOT EXISTS idx_client_id ON rendezvous (clientId);'
        );
    } catch (erreur) {
        console.error('Erreur lors de la création des index:', erreur);
    }
});

module.exports = RendezVous;