/**
 * Contrôleur pour gérer les opérations liées aux FAQs
 */

const FAQ = require('../modeles/faq');

/**
 * Obtenir toutes les FAQs (avec ou sans réponse)
 * @route GET /api/faq
 */
exports.obtenirToutesFAQs = async (req, res) => {
    try {
        const { estRepondu } = req.query;

        // Construire les conditions de recherche
        const conditions = {};

        // Filtre par statut de réponse
        if (estRepondu !== undefined) {
            conditions.estRepondu = estRepondu === 'true';
        }

        // Récupérer les FAQs
        const faqs = await FAQ.findAll({
            where: conditions,
            order: [['estRepondu', 'ASC'], ['dateCreation', 'DESC']]
        });

        res.status(200).json(faqs);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des FAQs:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des FAQs" });
    }
};

/**
 * Obtenir les FAQs publiques (seulement celles avec réponse)
 * @route GET /api/faq/publiques
 */
exports.obtenirFAQsPubliques = async (req, res) => {
    try {
        // Récupérer uniquement les FAQs répondues
        const faqs = await FAQ.findAll({
            where: { estRepondu: true },
            order: [['dateCreation', 'DESC']]
        });

        res.status(200).json(faqs);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des FAQs publiques:', erreur);
        res.status(500).json({ message: "Erreur lors de la récupération des FAQs publiques" });
    }
};

/**
 * Soumettre une nouvelle question
 * @route POST /api/faq
 */
exports.soumettreQuestion = async (req, res) => {
    try {
        const { question } = req.body;

        // Validation de la question
        if (!question) {
            return res.status(400).json({ message: "La question est obligatoire" });
        }

        // Créer la nouvelle FAQ
        const nouvelleFAQ = await FAQ.create({
            question,
            reponse: null,
            estRepondu: false
        });

        res.status(201).json({
            message: "Question soumise avec succès",
            faq: nouvelleFAQ
        });
    } catch (erreur) {
        console.error('Erreur lors de la soumission de la question:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de la soumission de la question" });
    }
};

/**
 * Répondre à une question
 * @route PUT /api/faq/:id
 */
exports.repondreQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { reponse } = req.body;

        // Validation de la réponse
        if (!reponse) {
            return res.status(400).json({ message: "La réponse est obligatoire" });
        }

        // Trouver la FAQ
        const faq = await FAQ.findByPk(id);

        if (!faq) {
            return res.status(404).json({ message: "Question non trouvée" });
        }

        // Mettre à jour la FAQ
        await faq.update({
            reponse,
            estRepondu: true
        });

        res.status(200).json({
            message: "Réponse ajoutée avec succès",
            faq
        });
    } catch (erreur) {
        console.error('Erreur lors de l\'ajout de la réponse:', erreur);

        if (erreur.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Données invalides",
                erreurs: erreur.errors.map(e => e.message)
            });
        }

        res.status(500).json({ message: "Erreur lors de l'ajout de la réponse" });
    }
};

/**
 * Supprimer une question
 * @route DELETE /api/faq/:id
 */
exports.supprimerQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si la FAQ existe
        const faq = await FAQ.findByPk(id);

        if (!faq) {
            return res.status(404).json({ message: "Question non trouvée" });
        }

        // Supprimer la FAQ
        await faq.destroy();

        res.status(200).json({ message: "Question supprimée avec succès" });
    } catch (erreur) {
        console.error('Erreur lors de la suppression de la question:', erreur);
        res.status(500).json({ message: "Erreur lors de la suppression de la question" });
    }
};