/**
 * Script utilitaire pour récupérer les identifiants d'administrateur
 * Exécuter avec: node scripts/get-admin-creds.js
 *
 * ATTENTION: À utiliser uniquement en développement, ne pas exposer en production
 */

// Charger les variables d'environnement
require('dotenv').config();

// Dépendances
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configuration de la base de données
const BDD_CHEMIN = process.env.BDD_CHEMIN || path.join(__dirname, '../donnees/mrms.sqlite');

// Connexion à la base de données
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: BDD_CHEMIN,
    logging: false
});

async function getAdminCredentials() {
    try {
        // Vérifier la connexion à la base de données
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');

        // Requête directe pour éviter de charger les modèles complets
        const utilisateurs = await sequelize.query(
            "SELECT id, nomUtilisateur, role FROM Utilisateurs WHERE role = 'Administrateur'",
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (utilisateurs.length === 0) {
            console.log('Aucun administrateur trouvé dans la base de données.');

            // Option pour créer un admin si aucun n'existe
            console.log('\nVoulez-vous créer un administrateur par défaut?');
            console.log('Si oui, exécutez la commande:');
            console.log('node config/init-bdd.js');

            return;
        }

        console.log('\n=== ADMINISTRATEURS TROUVÉS ===');
        utilisateurs.forEach(admin => {
            console.log(`ID: ${admin.id}`);
            console.log(`Nom d'utilisateur: ${admin.nomUtilisateur}`);
            console.log(`Rôle: ${admin.role}`);
            console.log('---');
        });

        console.log('\nPour vous connecter, utilisez:');
        console.log(`Nom d'utilisateur: ${utilisateurs[0].nomUtilisateur}`);
        console.log('Mot de passe: (Par défaut pour un nouveau système: "mdp123")');
        console.log('\nAttention: Si vous avez changé le mot de passe, utilisez celui que vous avez défini.');

    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs:', error);
    } finally {
        // Fermer la connexion à la base de données
        await sequelize.close();
    }
}

// Exécuter la fonction
getAdminCredentials();