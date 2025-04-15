/**
 * Contrôleur pour gérer les statistiques du tableau de bord
 */

const { Op, Sequelize } = require('sequelize');
const Client = require('../modeles/client');
const RendezVous = require('../modeles/rendezvous');
const TypePatient = require('../modeles/typePatient');
const StatutRendezVous = require('../modeles/statutRendezVous');

/**
 * Obtenir les statistiques générales pour le tableau de bord
 * @route GET /api/tableauBord/statistiques
 */
exports.obtenirStatistiquesDashboard = async (req, res) => {
    try {
        // Obtenir le nombre total de patients
        const totalPatients = await Client.count();

        // Obtenir le nombre de rendez-vous à venir (aujourd'hui et au-delà)
        const dateAujourdhui = new Date().toISOString().split('T')[0];
        const rendezvousAVenir = await RendezVous.count({
            where: {
                date: { [Op.gte]: dateAujourdhui },
                statutId: 1 // Programmé
            }
        });

        // Obtenir le nombre de rendez-vous par statut
        // FIX: Spécifier explicitement la colonne d'ID pour éviter l'ambiguïté
        const rendezvousParStatut = await RendezVous.findAll({
            attributes: [
                'statutId',
                [Sequelize.fn('COUNT', Sequelize.col('RendezVous.id')), 'total']
            ],
            include: [
                {
                    model: StatutRendezVous,
                    as: 'statut',
                    attributes: ['nom']
                }
            ],
            group: ['statutId'],
            raw: true,
            nest: true
        });

        // Obtenir le nombre de patients par type
        // FIX: Spécifier explicitement la colonne d'ID pour éviter l'ambiguïté
        const patientsParType = await Client.findAll({
            attributes: [
                'typePatientId',
                [Sequelize.fn('COUNT', Sequelize.col('Client.id')), 'total']
            ],
            include: [
                {
                    model: TypePatient,
                    as: 'typePatient',
                    attributes: ['nom']
                }
            ],
            group: ['typePatientId'],
            raw: true,
            nest: true
        });

        // Obtenir les rendez-vous du jour
        const rendezvousDuJour = await RendezVous.findAll({
            where: {
                date: dateAujourdhui
            },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom', 'telephone']
                },
                {
                    model: StatutRendezVous,
                    as: 'statut',
                    attributes: ['id', 'nom']
                }
            ],
            order: [['heure', 'ASC']],
            limit: 10
        });

        // Calculer le nombre de rendez-vous par mois pour l'année en cours
        const debutAnnee = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        const finAnnee = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

        const rendezvousParMois = await RendezVous.findAll({
            attributes: [
                [Sequelize.fn('substr', Sequelize.col('date'), 1, 7), 'mois'],
                [Sequelize.fn('COUNT', Sequelize.col('RendezVous.id')), 'total']
            ],
            where: {
                date: {
                    [Op.between]: [debutAnnee, finAnnee]
                }
            },
            group: [Sequelize.fn('substr', Sequelize.col('date'), 1, 7)],
            order: [[Sequelize.fn('substr', Sequelize.col('date'), 1, 7), 'ASC']],
            raw: true
        });

        res.status(200).json({
            totalPatients,
            rendezvousAVenir,
            rendezvousParStatut,
            patientsParType,
            rendezvousDuJour,
            rendezvousParMois
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des statistiques:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
};

/**
 * Obtenir les rendez-vous récents
 * @route GET /api/tableauBord/rendezvous-recents
 */
exports.obtenirRendezvousRecents = async (req, res) => {
    try {
        const { limite = 5 } = req.query;

        const rendezvousRecents = await RendezVous.findAll({
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'prenom', 'nom']
                },
                {
                    model: StatutRendezVous,
                    as: 'statut',
                    attributes: ['id', 'nom']
                }
            ],
            order: [['dateCreation', 'DESC']],
            limit: parseInt(limite)
        });

        res.status(200).json(rendezvousRecents);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des rendez-vous récents:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous récents" });
    }
};

/**
 * Obtenir les patients récents
 * @route GET /api/tableauBord/patients-recents
 */
exports.obtenirPatientsRecents = async (req, res) => {
    try {
        const { limite = 5 } = req.query;

        const patientsRecents = await Client.findAll({
            include: [
                {
                    model: TypePatient,
                    as: 'typePatient',
                    attributes: ['id', 'nom']
                }
            ],
            order: [['dateCreation', 'DESC']],
            limit: parseInt(limite)
        });

        // Si l'utilisateur est un administrateur, supprimer les notes médicales
        if (req.utilisateur.role === 'Administrateur') {
            patientsRecents.forEach(patient => {
                patient.notesMedicales = undefined;
            });
        }

        res.status(200).json(patientsRecents);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des patients récents:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des patients récents" });
    }
};