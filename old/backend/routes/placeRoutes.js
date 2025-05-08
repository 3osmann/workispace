
/**
 * Configuration des routes pour la gestion des lieux
 * Ce fichier définit toutes les routes API pour les lieux
 */
const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");
const { protect, admin } = require("../middleware/auth");
const { placeValidation, idValidation } = require("../middleware/validate");

/**
 * Routes pour les lieux
 * Définition des endpoints pour la gestion des lieux dans l'API
 */

/**
 * @route GET /api/places
 * @desc Récupérer tous les lieux
 * @access Public - Aucune authentification requise
 */
router.get("/", getAllPlaces);

/**
 * @route GET /api/places/:id
 * @desc Récupérer un lieu spécifique par son ID
 * @access Public - Aucune authentification requise
 */
router.get("/:id", idValidation, getPlaceById);

/**
 * @route POST /api/places
 * @desc Créer un nouveau lieu
 * @access Public - Aucune authentification requise
 */
router.post("/", placeValidation, createPlace);

/**
 * @route PUT /api/places/:id
 * @desc Mettre à jour un lieu existant
 * @access Public - Aucune authentification requise
 */
router.put("/:id", idValidation, placeValidation, updatePlace);

/**
 * @route DELETE /api/places/:id
 * @desc Supprimer un lieu
 * @access Public - Aucune authentification requise
 */
router.delete("/:id", idValidation, deletePlace);

module.exports = router;
