
const { body, param } = require("express-validator");

/**
 * Middleware de validation pour les propriétés
 * Définit les règles de validation pour les différentes opérations sur les propriétés
 */

/**
 * Validation pour la création et la mise à jour des propriétés
 */
exports.propertyValidation = [
  // Validation des champs obligatoires
  body("title")
    .notEmpty()
    .withMessage("Le titre est obligatoire")
    .isLength({ max: 255 })
    .withMessage("Le titre ne peut pas dépasser 255 caractères"),
  
  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),
  
  body("address")
    .notEmpty()
    .withMessage("L'adresse est obligatoire")
    .isLength({ max: 255 })
    .withMessage("L'adresse ne peut pas dépasser 255 caractères"),
  
  body("country")
    .optional()
    .isString()
    .withMessage("Le pays doit être une chaîne de caractères")
    .isLength({ max: 100 })
    .withMessage("Le pays ne peut pas dépasser 100 caractères"),
  
  body("region")
    .optional()
    .isString()
    .withMessage("La région doit être une chaîne de caractères")
    .isLength({ max: 100 })
    .withMessage("La région ne peut pas dépasser 100 caractères"),
  
  body("price")
    .notEmpty()
    .withMessage("Le prix est obligatoire")
    .isNumeric()
    .withMessage("Le prix doit être un nombre"),
  
  body("type")
    .notEmpty()
    .withMessage("Le type est obligatoire")
    .isLength({ max: 50 })
    .withMessage("Le type ne peut pas dépasser 50 caractères"),
  
  body("property_type")
    .notEmpty()
    .withMessage("Le type de propriété est obligatoire")
    .isIn(["residential", "office"])
    .withMessage("Le type de propriété doit être 'residential' ou 'office'"),
  
  // L'image est maintenant gérée via upload de fichier, donc la validation d'URL est optionnelle
  body("image_url")
    .optional()
    .isURL()
    .withMessage("L'URL de l'image doit être une URL valide"),
  
  body("rating")
    .notEmpty()
    .withMessage("La note est obligatoire")
    .isFloat({ min: 0, max: 5 })
    .withMessage("La note doit être un nombre entre 0 et 5"),
  
  // Validation des champs optionnels pour les propriétés résidentielles
  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de chambres doit être un entier positif"),
  
  body("bathrooms")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le nombre de salles de bain doit être un nombre positif"),
  
  // Validation des champs optionnels pour les bureaux
  body("workstations")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de postes de travail doit être un entier positif"),
  
  body("meeting_rooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de salles de réunion doit être un entier positif"),
  
  // Validation des équipements (amenities)
  body("wifi").optional().isBoolean().withMessage("Wifi doit être un booléen"),
  body("parking").optional().isBoolean().withMessage("Parking doit être un booléen"),
  body("coffee").optional().isBoolean().withMessage("Café doit être un booléen"),
  body("reception").optional().isBoolean().withMessage("Réception doit être un booléen"),
  body("secured").optional().isBoolean().withMessage("Sécurité doit être un booléen"),
  body("accessible").optional().isBoolean().withMessage("Accessibilité doit être un booléen"),
  body("printers").optional().isBoolean().withMessage("Imprimantes doit être un booléen"),
  body("kitchen").optional().isBoolean().withMessage("Cuisine doit être un booléen"),
  body("flexible_hours").optional().isBoolean().withMessage("Horaires flexibles doit être un booléen"),
];

/**
 * Validation pour les paramètres d'ID dans les routes
 */
exports.idValidation = [
  param("id").isString().withMessage("L'ID doit être une chaîne de caractères")
];

/**
 * Validation simplifiée pour la mise à jour des propriétés (tous les champs sont optionnels)
 */
exports.propertyUpdateValidation = [
  body("title")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Le titre ne peut pas dépasser 255 caractères"),
  
  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),
  
  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne peut pas dépasser 255 caractères"),
  
  body("country")
    .optional()
    .isString()
    .withMessage("Le pays doit être une chaîne de caractères")
    .isLength({ max: 100 })
    .withMessage("Le pays ne peut pas dépasser 100 caractères"),
  
  body("region")
    .optional()
    .isString()
    .withMessage("La région doit être une chaîne de caractères")
    .isLength({ max: 100 })
    .withMessage("La région ne peut pas dépasser 100 caractères"),
  
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Le prix doit être un nombre"),
  
  body("type")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Le type ne peut pas dépasser 50 caractères"),
  
  body("property_type")
    .optional()
    .isIn(["residential", "office"])
    .withMessage("Le type de propriété doit être 'residential' ou 'office'"),
  
  body("image_url")
    .optional()
    .isURL()
    .withMessage("L'URL de l'image doit être une URL valide"),
  
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("La note doit être un nombre entre 0 et 5"),
  
  // La même validation pour les autres champs optionnels
  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de chambres doit être un entier positif"),
  
  body("bathrooms")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le nombre de salles de bain doit être un nombre positif"),
  
  body("workstations")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de postes de travail doit être un entier positif"),
  
  body("meeting_rooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le nombre de salles de réunion doit être un entier positif"),
  
  // Validation des équipements (amenities)
  body("wifi").optional().isBoolean().withMessage("Wifi doit être un booléen"),
  body("parking").optional().isBoolean().withMessage("Parking doit être un booléen"),
  body("coffee").optional().isBoolean().withMessage("Café doit être un booléen"),
  body("reception").optional().isBoolean().withMessage("Réception doit être un booléen"),
  body("secured").optional().isBoolean().withMessage("Sécurité doit être un booléen"),
  body("accessible").optional().isBoolean().withMessage("Accessibilité doit être un booléen"),
  body("printers").optional().isBoolean().withMessage("Imprimantes doit être un booléen"),
  body("kitchen").optional().isBoolean().withMessage("Cuisine doit être un booléen"),
  body("flexible_hours").optional().isBoolean().withMessage("Horaires flexibles doit être un booléen"),
];
