
const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

/**
 * Contrôleur pour la gestion des lieux
 * Ce fichier contient toutes les fonctions pour gérer les opérations CRUD sur les lieux
 */

/**
 * Récupérer tous les lieux
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Liste de tous les lieux
 */
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.getAll();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer un lieu spécifique par son ID
 * @param {Object} req - Objet requête Express avec l'ID en paramètre
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Informations détaillées du lieu demandé
 */
exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Créer un nouveau lieu
 * @param {Object} req - Objet requête Express avec les données du lieu
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de création avec l'ID du lieu
 */
exports.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const placeId = await Place.create(req.body);
    res.status(201).json({
      id: placeId,
      ...req.body,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Mettre à jour un lieu existant
 * @param {Object} req - Objet requête Express avec l'ID et les données à mettre à jour
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de mise à jour
 */
exports.updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await Place.update(req.params.id, req.body);
    res.json({ message: "Lieu mis à jour avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprimer un lieu
 * @param {Object} req - Objet requête Express avec l'ID du lieu à supprimer
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de suppression
 */
exports.deletePlace = async (req, res) => {
  try {
    await Place.delete(req.params.id);
    res.json({ message: "Lieu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
