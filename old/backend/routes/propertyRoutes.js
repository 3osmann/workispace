const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const { propertyValidation, idValidation, propertyUpdateValidation } = require("../middleware/propertyValidate");
const upload = require("../middleware/upload");

/**
 * Routes pour les propriétés
 * Définit les endpoints de l'API pour la gestion des propriétés
 */

/**
 * @route GET /api/properties
 * @desc Récupérer toutes les propriétés
 * @access Public
 */
router.get("/", propertyController.getAllProperties);

/**
 * @route GET /api/properties/:id
 * @desc Récupérer une propriété par son ID
 * @access Public
 */
router.get("/:id", idValidation, propertyController.getPropertyById);

/**
 * @route POST /api/properties
 * @desc Créer une nouvelle propriété avec upload d'image et description
 * @access Public - Aucune authentification requise
 */
router.post(
  "/", 
  upload.single('image'),
  propertyValidation, 
  propertyController.createProperty
);

/**
 * @route PUT /api/properties/:id
 * @desc Mettre à jour une propriété existante avec possibilité de changer l'image et la description
 * @access Public - Aucune authentification requise
 */
router.put(
  "/:id", 
  idValidation,
  upload.single('image'),
  propertyUpdateValidation, 
  propertyController.updateProperty
);

/**
 * @route DELETE /api/properties/:id
 * @desc Supprimer une propriété
 * @access Public - Aucune authentification requise
 */
router.delete(
  "/:id", 
  idValidation, 
  propertyController.deleteProperty
);

/**
 * @route GET /api/properties/owner/:ownerId
 * @desc Get all properties for a specific owner
 * @access Public
 */
router.get("/owner/:ownerId", propertyController.getPropertiesByOwner);

module.exports = router;
