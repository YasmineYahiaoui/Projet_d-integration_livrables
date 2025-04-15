/**
 * Modèle TypeNotification pour les différents types de notification
 */

const { sequelize, Sequelize } = require('../config/bdd');

const TypeNotification = sequelize.define('TypeNotification', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Le nom du type de notification ne peut pas être vide" }
        }
    }
}, {
    tableName: 'typesNotification',
    timestamps: false
});

// Initialiser les types de notification par défaut
TypeNotification.afterSync(async () => {
    try {
        const count = await TypeNotification.count();
        if (count === 0) {
            await TypeNotification.bulkCreate([
                { nom: 'Email' },
                { nom: 'SMS' },
                { nom: 'Les deux' },
                { nom: 'Aucune' }
            ]);
            console.log('Types de notification par défaut créés');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des types de notification:', erreur);
    }
});

module.exports = TypeNotification;