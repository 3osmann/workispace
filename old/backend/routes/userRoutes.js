
/**
 * Configuration des routes pour la gestion des utilisateurs
 * Ce fichier définit toutes les routes API pour les utilisateurs
 */
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validate");

/**
 * Routes utilisateurs
 * Routes principales pour la gestion des utilisateurs dans l'API
 */

/**
 * @route GET /api/users
 * @desc Récupérer tous les utilisateurs
 * @access Public - Aucune authentification requise
 */
router.get("/", getAllUsers); // http://localhost:3000/api/users

/**
 * @route GET /api/users/:id
 * @desc Récupérer un utilisateur spécifique par son ID
 * @access Public - Aucune authentification requise
 */
router.get("/:id", getUserById); //http://localhost:3000/api/users/1

/**
 * @route POST /api/users/register
 * @desc Créer un nouveau compte utilisateur
 * @access Public - Aucune authentification requise
 */
router.post("/register", registerValidation, register);

/**
 * @route POST /api/users/login
 * @desc Connecter un utilisateur (créer une session)
 * @access Public - Aucune authentification requise
 */
router.post("/login", loginValidation, login);

/**
 * @route POST /api/users/logout
 * @desc Déconnecter un utilisateur (détruire la session)
 * @access Public - Aucune authentification requise
 */
router.post("/logout", logout);

/**
 * @route GET /api/users/me
 * @desc Récupérer les informations de l'utilisateur connecté
 * @access Public - Aucune authentification requise (vérifie seulement la session)
 */
router.get("/me", getMe);

/**
 * @route PUT /api/users/:id
 * @desc Mettre à jour les informations d'un utilisateur
 * @access Public - Aucune authentification requise
 */
router.put("/:id", updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Supprimer un utilisateur
 * @access Public - Aucune authentification requise
 */
router.delete("/:id", deleteUser);

module.exports = router;
