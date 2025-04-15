/**
 * Modèle PreferenceContact pour les différentes préférences de contact
 */

const { sequelize, Sequelize } = require('../config/bdd');

const PreferenceContact = sequelize.define('PreferenceContact', {
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
            notEmpty: { msg: "Le nom de la préférence de contact ne peut pas être vide" }
        }
    }
}, {
    tableName: 'preferencesContact',
    timestamps: false
});

// Initialiser les préférences de contact par défaut
PreferenceContact.afterSync(async () => {
    try {
        const count = await PreferenceContact.count();
        if (count === 0) {
            await PreferenceContact.bulkCreate([
                { nom: 'Email' },
                { nom: 'SMS' },
                { nom: 'Appel téléphonique' },
                { nom: 'Aucun contact' }
            ]);
            console.log('Préférences de contact par défaut créées');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des préférences de contact:', erreur);
    }
});

module.exports = PreferenceContact;