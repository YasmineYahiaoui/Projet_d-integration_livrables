/**
 * Utilitaires pour la validation des formulaires
 */

/**
 * Vérifier si une valeur est vide (null, undefined, chaîne vide, tableau vide, objet vide)
 * @param {any} value - Valeur à vérifier
 * @returns {boolean} True si la valeur est vide
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Valider un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si l'email est valide
 */
export const isValidEmail = (email) => {
    if (!email) return false;

    // Regex pour la validation d'email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valider un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;

    // Regex pour la validation de téléphone (format international)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

/**
 * Valider une date
 * @param {string} date - Date à valider (format YYYY-MM-DD)
 * @returns {boolean} True si la date est valide
 */
export const isValidDate = (date) => {
    if (!date) return false;

    // Vérifier le format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    // Vérifier si la date est valide
    const d = new Date(date);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === date;
};

/**
 * Valider une heure
 * @param {string} time - Heure à valider (format HH:MM)
 * @returns {boolean} True si l'heure est valide
 */
export const isValidTime = (time) => {
    if (!time) return false;

    // Vérifier le format HH:MM
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

/**
 * Valider un mot de passe (au moins 6 caractères)
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} True si le mot de passe est valide
 */
export const isValidPassword = (password) => {
    if (!password) return false;
    return password.length >= 6;
};

/**
 * Vérifier si deux mots de passe correspondent
 * @param {string} password - Mot de passe
 * @param {string} confirmPassword - Confirmation du mot de passe
 * @returns {boolean} True si les mots de passe correspondent
 */
export const doPasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

/**
 * Vérifier la longueur minimale d'une chaîne
 * @param {string} str - Chaîne à vérifier
 * @param {number} minLength - Longueur minimale
 * @returns {boolean} True si la chaîne a la longueur minimale
 */
export const hasMinLength = (str, minLength) => {
    if (!str) return false;
    return str.length >= minLength;
};

/**
 * Vérifier la longueur maximale d'une chaîne
 * @param {string} str - Chaîne à vérifier
 * @param {number} maxLength - Longueur maximale
 * @returns {boolean} True si la chaîne a la longueur maximale
 */
export const hasMaxLength = (str, maxLength) => {
    if (!str) return true;
    return str.length <= maxLength;
};

/**
 * Valider un nom d'utilisateur (lettres, chiffres, tirets, underscore)
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {boolean} True si le nom d'utilisateur est valide
 */
export const isValidUsername = (username) => {
    if (!username) return false;

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
};

/**
 * Valider un objet formulaire complet avec des règles personnalisées
 * @param {Object} data - Données du formulaire
 * @param {Object} rules - Règles de validation
 * @returns {Object} Erreurs de validation (vide si valide)
 */
export const validateForm = (data, rules) => {
    const errors = {};

    for (const field in rules) {
        if (rules.hasOwnProperty(field)) {
            const fieldRules = rules[field];
            const value = data[field];

            // Required
            if (fieldRules.required && isEmpty(value)) {
                errors[field] = fieldRules.required === true
                    ? 'Ce champ est requis'
                    : fieldRules.required;
                continue;
            }

            // Skip other validations if empty and not required
            if (isEmpty(value) && !fieldRules.required) continue;

            // Email
            if (fieldRules.email && !isValidEmail(value)) {
                errors[field] = fieldRules.email === true
                    ? 'Email invalide'
                    : fieldRules.email;
            }

            // Phone
            if (fieldRules.phone && !isValidPhone(value)) {
                errors[field] = fieldRules.phone === true
                    ? 'Numéro de téléphone invalide'
                    : fieldRules.phone;
            }

            // Min length
            if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength.value)) {
                errors[field] = fieldRules.minLength.message ||
                    `Ce champ doit contenir au moins ${fieldRules.minLength.value} caractères`;
            }

            // Max length
            if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength.value)) {
                errors[field] = fieldRules.maxLength.message ||
                    `Ce champ doit contenir au maximum ${fieldRules.maxLength.value} caractères`;
            }

            // Custom validator
            if (fieldRules.validator && typeof fieldRules.validator.func === 'function') {
                if (!fieldRules.validator.func(value, data)) {
                    errors[field] = fieldRules.validator.message || 'Champ invalide';
                }
            }
        }
    }

    return errors;
};

/**
 * Valider un formulaire et retourner si valide
 * @param {Object} data - Données du formulaire
 * @param {Object} rules - Règles de validation
 * @returns {boolean} True si le formulaire est valide
 */
export const isFormValid = (data, rules) => {
    const errors = validateForm(data, rules);
    return Object.keys(errors).length === 0;
};