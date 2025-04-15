/**
 * Modèle Langue pour les différentes langues des patients
 */

const { sequelize, Sequelize } = require('../config/bdd');

const Langue = sequelize.define('Langue', {
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
            notEmpty: { msg: "Le nom de la langue ne peut pas être vide" }
        }
    }
}, {
    tableName: 'langues',
    timestamps: false
});

// Initialiser les langues par défaut
Langue.afterSync(async () => {
    try {
        const count = await Langue.count();
        if (count === 0) {
            await Langue.bulkCreate([
                { nom: 'Français' },
                { nom: 'Anglais' },
                { nom: 'Arabe' },
                { nom: 'Espagnol' }
            ]);
            console.log('Langues par défaut créées');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des langues:', erreur);
    }
});

module.exports = Langue;