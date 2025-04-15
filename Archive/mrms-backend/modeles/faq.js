/**
 * Modèle FAQ pour les questions fréquemment posées
 */

const { sequelize, Sequelize } = require('../config/bdd');

const FAQ = sequelize.define('FAQ', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La question ne peut pas être vide" }
        }
    },
    reponse: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    estRepondu: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    tableName: 'faq',
    timestamps: true,
    // Renommer createdAt et updatedAt en français
    createdAt: 'dateCreation',
    updatedAt: 'dateModification',
    hooks: {
        beforeUpdate: (faq) => {
            faq.dateModification = new Date();
        }
    }
});

// Initialiser quelques FAQ par défaut
FAQ.afterSync(async () => {
    try {
        const count = await FAQ.count();
        if (count === 0) {
            await FAQ.bulkCreate([
                {
                    question: 'Comment réinitialiser mon mot de passe ?',
                    reponse: 'Contactez l\'administrateur système pour réinitialiser votre mot de passe.',
                    estRepondu: true
                },
                {
                    question: 'Est-il possible d\'exporter les données des patients ?',
                    reponse: 'Cette fonctionnalité est actuellement en cours de développement.',
                    estRepondu: true
                },
                {
                    question: 'Comment annuler un rendez-vous ?',
                    reponse: 'Accédez à la section "Gestion des rendez-vous", trouvez le rendez-vous que vous souhaitez annuler et cliquez sur le bouton "Annuler".',
                    estRepondu: true
                },
                {
                    question: 'Quelle est la différence entre les rôles Administrateur et Médecin ?',
                    reponse: 'L\'Administrateur peut gérer les rendez-vous et les informations de base des patients, tandis que le Médecin a également accès aux paramètres médicaux des patients.',
                    estRepondu: true
                }
            ]);
            console.log('FAQ par défaut créées');
        }
    } catch (erreur) {
        console.error('Erreur lors de la création des FAQ:', erreur);
    }
});

module.exports = FAQ;