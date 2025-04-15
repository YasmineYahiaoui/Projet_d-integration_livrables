/**
 * Modèle TypePatient pour les différents types de patients
 */

const { sequelize, Sequelize } = require('../config/bdd');

const TypePatient = sequelize.define('TypePatient', {
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
            notEmpty: { msg: "Le nom du type de patient ne peut pas être vide" }
        }
    }
}, {
    tableName: 'typesPatients',
    timestamps: false
});

// Initialiser les types de patients par défaut
TypePatient.afterSync(async () => {
    try {
        const count = await TypePatient.count();
        if (count === 0) {
            await TypePatient.bulkCreate([
                { nom: 'Régulier' },
                { nom: 'Urgence' },
                { nom: 'Nouveau' },
                { nom: 'Suivi' }
            ]);
            console.log('Types de patients par défaut créés');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des types de patients:', erreur);
    }
});

module.exports = TypePatient;