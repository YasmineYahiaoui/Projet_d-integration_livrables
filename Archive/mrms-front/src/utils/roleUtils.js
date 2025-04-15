/**
 * Utilitaires pour la gestion des rôles et des permissions
 */

// Définition des rôles disponibles
export const ROLES = {
    ADMIN: 'Administrateur',
    MEDECIN: 'Médecin'
};

// Liste des permissions par rôle
export const PERMISSIONS = {
    VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.MEDECIN],

    // Gestion des patients
    VIEW_PATIENTS: [ROLES.ADMIN, ROLES.MEDECIN],
    CREATE_PATIENT: [ROLES.ADMIN, ROLES.MEDECIN],
    UPDATE_PATIENT: [ROLES.ADMIN, ROLES.MEDECIN],
    DELETE_PATIENT: [ROLES.ADMIN, ROLES.MEDECIN],

    // Notes médicales (réservées aux médecins)
    VIEW_MEDICAL_NOTES: [ROLES.MEDECIN],
    CREATE_MEDICAL_NOTES: [ROLES.MEDECIN],
    UPDATE_MEDICAL_NOTES: [ROLES.MEDECIN],

    // Gestion des rendez-vous
    VIEW_APPOINTMENTS: [ROLES.ADMIN, ROLES.MEDECIN],
    CREATE_APPOINTMENT: [ROLES.ADMIN, ROLES.MEDECIN],
    UPDATE_APPOINTMENT: [ROLES.ADMIN, ROLES.MEDECIN],
    DELETE_APPOINTMENT: [ROLES.ADMIN, ROLES.MEDECIN],

    // Gestion des utilisateurs (réservée aux admins)
    VIEW_USERS: [ROLES.ADMIN],
    CREATE_USER: [ROLES.ADMIN],
    UPDATE_USER: [ROLES.ADMIN],
    DELETE_USER: [ROLES.ADMIN],

    // Paramètres
    VIEW_SETTINGS: [ROLES.ADMIN, ROLES.MEDECIN],
    UPDATE_SETTINGS: [ROLES.ADMIN],

    // FAQ
    VIEW_FAQ: [ROLES.ADMIN, ROLES.MEDECIN],
    CREATE_FAQ_QUESTION: [ROLES.ADMIN, ROLES.MEDECIN],
    ANSWER_FAQ_QUESTION: [ROLES.ADMIN],
    DELETE_FAQ_QUESTION: [ROLES.ADMIN]
};

/**
 * Vérifier si un rôle a une permission spécifique
 * @param {string} role - Rôle de l'utilisateur
 * @param {string} permission - Permission à vérifier
 * @returns {boolean} True si le rôle a la permission
 */
export const hasPermission = (role, permission) => {
    if (!role || !permission) return false;

    return PERMISSIONS[permission]?.includes(role) || false;
};

/**
 * Vérifier si un utilisateur a une permission spécifique
 * @param {Object} utilisateur - Utilisateur à vérifier
 * @param {string} permission - Permission à vérifier
 * @returns {boolean} True si l'utilisateur a la permission
 */
export const userHasPermission = (utilisateur, permission) => {
    if (!utilisateur || !utilisateur.role || !permission) return false;

    return hasPermission(utilisateur.role, permission);
};

/**
 * Vérifier si un utilisateur a toutes les permissions spécifiées
 * @param {Object} utilisateur - Utilisateur à vérifier
 * @param {string[]} permissions - Liste des permissions à vérifier
 * @returns {boolean} True si l'utilisateur a toutes les permissions
 */
export const userHasAllPermissions = (utilisateur, permissions) => {
    if (!utilisateur || !utilisateur.role || !permissions || !Array.isArray(permissions)) return false;

    return permissions.every(permission => userHasPermission(utilisateur, permission));
};

/**
 * Vérifier si un utilisateur a au moins une des permissions spécifiées
 * @param {Object} utilisateur - Utilisateur à vérifier
 * @param {string[]} permissions - Liste des permissions à vérifier
 * @returns {boolean} True si l'utilisateur a au moins une permission
 */
export const userHasAnyPermission = (utilisateur, permissions) => {
    if (!utilisateur || !utilisateur.role || !permissions || !Array.isArray(permissions)) return false;

    return permissions.some(permission => userHasPermission(utilisateur, permission));
};

/**
 * Vérifier si un utilisateur est administrateur
 * @param {Object} utilisateur - Utilisateur à vérifier
 * @returns {boolean} True si l'utilisateur est administrateur
 */
export const isAdmin = (utilisateur) => {
    if (!utilisateur || !utilisateur.role) return false;

    return utilisateur.role === ROLES.ADMIN;
};

/**
 * Vérifier si un utilisateur est médecin
 * @param {Object} utilisateur - Utilisateur à vérifier
 * @returns {boolean} True si l'utilisateur est médecin
 */
export const isMedecin = (utilisateur) => {
    if (!utilisateur || !utilisateur.role) return false;

    return utilisateur.role === ROLES.MEDECIN;
};

/**
 * Obtenir toutes les permissions d'un rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string[]} Liste des permissions du rôle
 */
export const getPermissionsForRole = (role) => {
    if (!role) return [];

    return Object.entries(PERMISSIONS)
        .filter(([_, roles]) => roles.includes(role))
        .map(([permission]) => permission);
};

/**
 * Obtenir toutes les permissions d'un utilisateur
 * @param {Object} utilisateur - Utilisateur
 * @returns {string[]} Liste des permissions de l'utilisateur
 */
export const getUserPermissions = (utilisateur) => {
    if (!utilisateur || !utilisateur.role) return [];

    return getPermissionsForRole(utilisateur.role);
};