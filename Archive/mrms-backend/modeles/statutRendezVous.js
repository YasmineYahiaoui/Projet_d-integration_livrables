/**
 * Modèle StatutRendezVous pour les différents statuts de rendez-vous
 */

const { sequelize, Sequelize } = require('../config/bdd');

const StatutRendezVous = sequelize.define('StatutRendezVous', {
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
            notEmpty: { msg: "Le nom du statut de rendez-vous ne peut pas être vide" }
        }
    }
}, {
    tableName: 'statutsRendezVous',
    timestamps: false
});

// Initialiser les statuts de rendez-vous par défaut
StatutRendezVous.afterSync(async () => {
    try {
        const count = await StatutRendezVous.count();
        if (count === 0) {
            await StatutRendezVous.bulkCreate([
                { nom: 'Programmé' },
                { nom: 'Terminé' },
                { nom: 'Annulé' },
                { nom: 'Non présenté' }
            ]);
            console.log('Statuts de rendez-vous par défaut créés');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des statuts de rendez-vous:', erreur);
    }
});

module.exports = StatutRendezVous;