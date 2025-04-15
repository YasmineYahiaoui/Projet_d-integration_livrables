/**
 * Script d'initialisation de la base de données MRMS
 *
 * Ce script permet de créer et de peupler la base de données avec des données initiales.
 * Utilisez-le avec la commande: node config/init-bdd.js
 */

const { sequelize } = require('./bdd');
const Utilisateur = require('../modeles/utilisateur');
const TypePatient = require('../modeles/typePatient');
const Langue = require('../modeles/langue');
const PreferenceContact = require('../modeles/preferenceContact');
const StatutRendezVous = require('../modeles/statutRendezVous');
const TypeNotification = require('../modeles/typeNotification');
const Client = require('../modeles/client');
const RendezVous = require('../modeles/rendezvous');
const FAQ = require('../modeles/faq');
const bcrypt = require('bcryptjs');

// Fonction pour initialiser la base de données
const initialiserBDD = async (force = false) => {
    try {
        console.log('Début de l\'initialisation de la base de données...');

        // Synchroniser les modèles avec la base de données
        // force: true va supprimer toutes les tables existantes
        await sequelize.sync({ force });
        console.log('Base de données synchronisée');

        // Créer les utilisateurs par défaut
        if (force) {
            // Utiliser create pour chaque utilisateur au lieu de bulkCreate
            // pour s'assurer que les hooks de hachage s'appliquent correctement
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

            // Créer les types de patients
            await TypePatient.bulkCreate([
                { nom: 'Régulier' },
                { nom: 'Urgence' },
                { nom: 'Nouveau' },
                { nom: 'Suivi' }
            ]);
            console.log('Types de patients créés');

            // Créer les langues
            await Langue.bulkCreate([
                { nom: 'Français' },
                { nom: 'Anglais' },
                { nom: 'Arabe' },
                { nom: 'Espagnol' }
            ]);
            console.log('Langues créées');

            // Créer les préférences de contact
            await PreferenceContact.bulkCreate([
                { nom: 'Email' },
                { nom: 'SMS' },
                { nom: 'Appel téléphonique' },
                { nom: 'Aucun contact' }
            ]);
            console.log('Préférences de contact créées');

            // Créer les statuts de rendez-vous
            await StatutRendezVous.bulkCreate([
                { nom: 'Programmé' },
                { nom: 'Terminé' },
                { nom: 'Annulé' },
                { nom: 'Non présenté' }
            ]);
            console.log('Statuts de rendez-vous créés');

            // Créer les types de notification
            await TypeNotification.bulkCreate([
                { nom: 'Email' },
                { nom: 'SMS' },
                { nom: 'Les deux' },
                { nom: 'Aucune' }
            ]);
            console.log('Types de notification créés');

            // Créer quelques clients de démonstration
            await Client.bulkCreate([
                {
                    prenom: 'Jean',
                    nom: 'Dupont',
                    email: 'jean.dupont@example.com',
                    telephone: '0612345678',
                    typePatientId: 1,
                    langueId: 1,
                    preferenceContactId: 1,
                    notesMedicales: 'Patient atteint d\'hypertension légère. Traitement en cours.'
                },
                {
                    prenom: 'Marie',
                    nom: 'Martin',
                    email: 'marie.martin@example.com',
                    telephone: '0687654321',
                    typePatientId: 3,
                    langueId: 1,
                    preferenceContactId: 2,
                    notesMedicales: 'Première consultation pour douleurs lombaires.'
                },
                {
                    prenom: 'Ahmed',
                    nom: 'Hassan',
                    email: 'ahmed.hassan@example.com',
                    telephone: '0698765432',
                    typePatientId: 2,
                    langueId: 3,
                    preferenceContactId: 1,
                    notesMedicales: 'Patient diabétique. Suivi régulier requis.'
                },
                {
                    prenom: 'Sophie',
                    nom: 'Leroux',
                    email: 'sophie.leroux@example.com',
                    telephone: '0654321098',
                    typePatientId: 4,
                    langueId: 1,
                    preferenceContactId: 3,
                    notesMedicales: 'Suivi post-opératoire. Opération du genou il y a 3 semaines.'
                }
            ]);
            console.log('Clients de démonstration créés');

            // Créer quelques rendez-vous de démonstration
            const dateAujourdhui = new Date().toISOString().split('T')[0];
            const dateDemain = new Date(Date.now() + 86400000).toISOString().split('T')[0];
            const dateApresDemain = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

            await RendezVous.bulkCreate([
                {
                    clientId: 1,
                    date: dateAujourdhui,
                    heure: '09:00',
                    duree: 30,
                    typeNotificationId: 1,
                    statutId: 1,
                    notes: 'Contrôle de la tension artérielle',
                    creeParId: 2
                },
                {
                    clientId: 2,
                    date: dateAujourdhui,
                    heure: '10:00',
                    duree: 45,
                    typeNotificationId: 2,
                    statutId: 1,
                    notes: 'Première consultation pour douleurs lombaires',
                    creeParId: 2
                },
                {
                    clientId: 3,
                    date: dateDemain,
                    heure: '14:30',
                    duree: 30,
                    typeNotificationId: 3,
                    statutId: 1,
                    notes: 'Contrôle du diabète',
                    creeParId: 2
                },
                {
                    clientId: 4,
                    date: dateApresDemain,
                    heure: '11:15',
                    duree: 30,
                    typeNotificationId: 1,
                    statutId: 1,
                    notes: 'Suivi post-opératoire',
                    creeParId: 2
                }
            ]);
            console.log('Rendez-vous de démonstration créés');

            // Créer quelques FAQ de démonstration
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
                },
                {
                    question: 'Comment ajouter un nouveau type de patient ?',
                    reponse: null,
                    estRepondu: false
                }
            ]);
            console.log('FAQ de démonstration créées');
        }

        console.log('Initialisation de la base de données terminée avec succès');
    } catch (erreur) {
        console.error('Erreur lors de l\'initialisation de la base de données:', erreur);
        process.exit(1);
    }
};

// Exécuter l'initialisation si le script est lancé directement
if (require.main === module) {
    // Demander confirmation avant de réinitialiser la base de données
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Voulez-vous réinitialiser complètement la base de données ? (o/N) ', async (reponse) => {
        const force = reponse.toLowerCase() === 'o';

        if (force) {
            console.log('ATTENTION: Toutes les données existantes seront supprimées !');

            readline.question('Êtes-vous vraiment sûr ? (o/N) ', async (confirmation) => {
                if (confirmation.toLowerCase() === 'o') {
                    await initialiserBDD(true);
                } else {
                    console.log('Opération annulée');
                }
                readline.close();
                process.exit(0);
            });
        } else {
            await initialiserBDD(false);
            readline.close();
            process.exit(0);
        }
    });
} else {
    // Exportation pour utilisation programmatique
    module.exports = initialiserBDD;
}