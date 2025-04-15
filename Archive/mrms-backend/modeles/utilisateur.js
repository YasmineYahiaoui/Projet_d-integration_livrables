/**
 * Modèle Utilisateur pour représenter les utilisateurs du système
 */

const { sequelize, Sequelize } = require('../config/bdd');
const bcrypt = require('bcryptjs');

const Utilisateur = sequelize.define('Utilisateur', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomUtilisateur: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Le nom d'utilisateur ne peut pas être vide" }
        }
    },
    motDePasse: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le mot de passe ne peut pas être vide" }
        }
    },
    role: {
        type: Sequelize.ENUM('Administrateur', 'Médecin', 'Patient'),
        allowNull: false,
        defaultValue: 'Administrateur'
    },
    clientId: {
        type: Sequelize.INTEGER,
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
    tableName: 'utilisateurs',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification',
    hooks: {
        beforeCreate: async (utilisateur) => {
            if (utilisateur.motDePasse) {
                const sel = await bcrypt.genSalt(10);
                utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, sel);
            }
        },
        beforeUpdate: async (utilisateur) => {
            if (utilisateur.changed('motDePasse')) {
                const sel = await bcrypt.genSalt(10);
                utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, sel);
            }
        }
    }
});

// Méthode pour vérifier le mot de passe
Utilisateur.prototype.verifierMotDePasse = async function(motDePasse) {
    return await bcrypt.compare(motDePasse, this.motDePasse);
};

// Créer les utilisateurs par défaut si la table est vide
Utilisateur.afterSync(async () => {
    try {
        const count = await Utilisateur.count();
        if (count === 0) {
            await Utilisateur.create({
                nomUtilisateur: 'admin',
                motDePasse: 'mdp123',
                role: 'Administrateur'
            });

            await Utilisateur.create({
                nomUtilisateur: 'medecin',
                motDePasse: 'mdc123',
                role: 'Médecin'
            });

            console.log('Utilisateurs par défaut créés');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des utilisateurs par défaut:', erreur);
    }
});

module.exports = Utilisateur;