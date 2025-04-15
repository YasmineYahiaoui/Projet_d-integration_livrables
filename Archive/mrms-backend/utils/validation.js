/**
 * Utilitaires de validation pour l'API
 */

/**
 * Valider une adresse email
 * @param {string} email - Adresse email à valider
 * @returns {boolean} - true si l'email est valide, false sinon
 */
exports.estEmailValide = (email) => {
    if (!email) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valider un numéro de téléphone
 * @param {string} telephone - Numéro de téléphone à valider
 * @returns {boolean} - true si le téléphone est valide, false sinon
 */
exports.estTelephoneValide = (telephone) => {
    if (!telephone) return false;

    // Format international ou national avec divers séparateurs
    const regex = /^(?:\+\d{1,3}|0)\s*(?:\d\s*){9,}$/;
    return regex.test(telephone);
};

/**
 * Valider un format de date (YYYY-MM-DD)
 * @param {string} date - Date à valider
 * @returns {boolean} - true si la date est valide, false sinon
 */
exports.estDateValide = (date) => {
    if (!date) return false;

    // Vérifier le format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;

    // Vérifier que c'est une date valide
    const jsDate = new Date(date);
    return !isNaN(jsDate.getTime());
};

/**
 * Valider un format d'heure (HH:MM)
 * @param {string} heure - Heure à valider
 * @returns {boolean} - true si l'heure est valide, false sinon
 */
exports.estHeureValide = (heure) => {
    if (!heure) return false;

    // Vérifier le format HH:MM
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(heure);
};

/**
 * Sanitiser une chaîne de caractères (supprimer les caractères spéciaux)
 * @param {string} texte - Texte à sanitiser
 * @returns {string} - Texte sanitisé
 */
exports.sanitiserTexte = (texte) => {
    if (!texte) return '';

    // Supprimer les balises HTML et les caractères spéciaux
    return texte
        .replace(/<[^>]*>?/gm, '')
        .replace(/[<>]/g, '');
};

/**
 * Valider les informations d'un client
 * @param {Object} client - Objet client à valider
 * @returns {Object} - Objet contenant les éventuelles erreurs
 */
exports.validerClient = (client) => {
    const erreurs = {};

    // Validation du nom et prénom
    if (!client.nom || client.nom.trim() === '') {
        erreurs.nom = "Le nom est obligatoire";
    }

    if (!client.prenom || client.prenom.trim() === '') {
        erreurs.prenom = "Le prénom est obligatoire";
    }

    // Validation de l'email si fourni
    if (client.email && !this.estEmailValide(client.email)) {
        erreurs.email = "Format d'email non valide";
    }

    // Validation du téléphone si fourni
    if (client.telephone && !this.estTelephoneValide(client.telephone)) {
        erreurs.telephone = "Format de téléphone non valide";
    }

    return {
        estValide: Object.keys(erreurs).length === 0,
        erreurs
    };
};

/**
 * Valider les informations d'un rendez-vous
 * @param {Object} rendezvous - Objet rendez-vous à valider
 * @returns {Object} - Objet contenant les éventuelles erreurs
 */
exports.validerRendezVous = (rendezvous) => {
    const erreurs = {};

    // Validation du client
    if (!rendezvous.clientId) {
        erreurs.clientId = "L'ID du client est obligatoire";
    }

    // Validation de la date
    if (!rendezvous.date || !this.estDateValide(rendezvous.date)) {
        erreurs.date = "Format de date non valide (YYYY-MM-DD)";
    }

    // Validation de l'heure
    if (!rendezvous.heure || !this.estHeureValide(rendezvous.heure)) {
        erreurs.heure = "Format d'heure non valide (HH:MM)";
    }

    // Validation de la durée
    if (rendezvous.duree && (rendezvous.duree < 5 || rendezvous.duree > 240)) {
        erreurs.duree = "La durée doit être entre 5 et 240 minutes";
    }

    return {
        estValide: Object.keys(erreurs).length === 0,
        erreurs
    };
};