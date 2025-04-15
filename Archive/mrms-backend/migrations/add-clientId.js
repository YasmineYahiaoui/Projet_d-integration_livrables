/**
 * Migration pour ajouter la colonne clientId au modèle Utilisateur
 */

const { sequelize } = require('../config/bdd');

async function runMigration() {
    try {
        console.log('Début de la migration: ajout de la colonne clientId...');

        // Vérifier si la colonne existe déjà
        const [columns] = await sequelize.query(`PRAGMA table_info(utilisateurs);`);
        const clientIdExists = columns.some(col => col.name === 'clientId');

        if (!clientIdExists) {
            // Ajouter la colonne
            await sequelize.query(`ALTER TABLE utilisateurs ADD COLUMN clientId INTEGER;`);
            console.log('Colonne clientId ajoutée avec succès');
        } else {
            console.log('La colonne clientId existe déjà');
        }

        // Vérifier si le rôle 'Patient' est disponible dans l'énumération
        const [roles] = await sequelize.query(`SELECT type FROM sqlite_master 
                                            WHERE tbl_name = 'utilisateurs' 
                                            AND sql LIKE '%ENUM%'`);

        if (roles.length > 0) {
            const roleType = roles[0].type || '';
            if (!roleType.includes("'Patient'")) {
                console.log("Le type ENUM doit être modifié pour inclure 'Patient'.");
                console.log("Cette opération nécessite de recréer la table. Exécutez node config/init-bdd.js avec l'option force=true.");
            } else {
                console.log("Le rôle 'Patient' est déjà présent dans l'énumération");
            }
        }

        console.log('Migration terminée');
    } catch (erreur) {
        console.error('Erreur lors de la migration:', erreur);
    } finally {
        await sequelize.close();
    }
}

// Exécuter la migration si le script est lancé directement
if (require.main === module) {
    runMigration();
}

module.exports = runMigration;