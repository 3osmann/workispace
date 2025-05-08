/**
 * Middleware de validation des données
 * Ce fichier contient les fonctions de validation pour toutes les routes de l'API
 * Utilise express-validator pour vérifier et valider les données entrantes
 */
const { body, validationResult, param } = require("express-validator");

/**
 * Validation des données pour l'inscription d'un utilisateur
 * Vérifie que tous les champs requis sont présents et valides selon les règles définies
 */
exports.registerValidation = [
  body("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .trim()
    .escape(),
  
  body("prenom")
    .notEmpty()
    .withMessage("Le prénom est obligatoire")
    .trim()
    .escape(),
  
  body("email")
    .isEmail()
    .withMessage("L'email est invalide")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  
  body("role")
    .optional()
    .isIn(["admin", "user", "owner"])  // Added "owner" to the list of valid roles
    .withMessage("Le rôle doit être 'admin', 'user' ou 'owner'"),
];

/**
 * Validation des données pour la connexion d'un utilisateur
 * Vérifie que l'email est valide et le mot de passe est présent
 */
exports.loginValidation = [
  body("email").isEmail().withMessage("L'email est invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est obligatoire"),
];

/**
 * Validation des données pour la création ou mise à jour d'un lieu
 * Vérifie que les données sont valides selon les règles métier
 */
exports.placeValidation = [
  body("nom_place")
    .notEmpty()
    .withMessage("Le nom du lieu est obligatoire")
    .isLength({ max: 255 })
    .withMessage("Le nom est trop long"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("La description est trop longue"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("La longitude est invalide"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("La latitude est invalide"),
  body("url_img").optional().isURL().withMessage("L'URL de l'image est invalide"),
  body("url_web").optional().isURL().withMessage("L'URL du site web est invalide"),
];

/**
 * Validation de l'ID dans les paramètres de l'URL
 * Vérifie que l'ID est un nombre entier valide
 */
exports.idValidation = [param("id").isInt().withMessage("Le format de l'ID est invalide")];