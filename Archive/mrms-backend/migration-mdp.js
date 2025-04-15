/**
 * Script de migration des mots de passe
 *
 * Ce script convertit les mots de passe en texte brut en hashes bcrypt.
 * Exécutez-le avec: node migration-mdp.js
 */

const { sequelize } = require('./config/bdd');
const bcrypt = require('bcryptjs');

const migrerMotsDePasse = async () => {
    try {
        console.log('Début de la migration des mots de passe...');

        // Récupérer tous les utilisateurs
        const [utilisateurs] = await sequelize.query('SELECT id, nomUtilisateur, motDePasse FROM utilisateurs');

        console.log(`${utilisateurs.length} utilisateurs trouvés.`);

        let compteurMigres = 0;
        let compteurDejaHashes = 0;

        // Pour chaque utilisateur, vérifier si le mot de passe est hashé
        for (const utilisateur of utilisateurs) {
            // Si le mot de passe commence par $2a$ ou $2b$, c'est un hash bcrypt
            if (!utilisateur.motDePasse.startsWith('$2a$') && !utilisateur.motDePasse.startsWith('$2b$')) {
                console.log(`Migration du mot de passe pour l'utilisateur "${utilisateur.nomUtilisateur}" (ID: ${utilisateur.id})...`);

                // Hasher le mot de passe
                const sel = await bcrypt.genSalt(10);
                const motDePasseHashe = await bcrypt.hash(utilisateur.motDePasse, sel);

                // Mettre à jour le mot de passe dans la base de données
                await sequelize.query(
                    'UPDATE utilisateurs SET motDePasse = ? WHERE id = ?',
                    {
                        replacements: [motDePasseHashe, utilisateur.id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );

                console.log(`Mot de passe migré avec succès pour l'utilisateur "${utilisateur.nomUtilisateur}"`);
                compteurMigres++;
            } else {
                console.log(`Le mot de passe de l'utilisateur "${utilisateur.nomUtilisateur}" est déjà hashé.`);
                compteurDejaHashes++;
            }
        }

        console.log('\n----- Résumé de la migration -----');
        console.log(`Total des utilisateurs: ${utilisateurs.length}`);
        console.log(`Mots de passe migrés: ${compteurMigres}`);
        console.log(`Mots de passe déjà hashés: ${compteurDejaHashes}`);
        console.log('Migration des mots de passe terminée avec succès');
    } catch (erreur) {
        console.error('Erreur lors de la migration des mots de passe:', erreur);
        console.error(erreur.stack);
    } finally {
        // Fermer la connexion à la base de données
        await sequelize.close();
    }
};

// Exécuter la migration
migrerMotsDePasse();