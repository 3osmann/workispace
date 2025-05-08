const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

/**
 * Contrôleur pour la gestion des utilisateurs
 * Ce fichier contient toutes les fonctions pour gérer les opérations CRUD sur les utilisateurs
 */

/**
 * Récupérer tous les utilisateurs
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Liste des utilisateurs sans les mots de passe
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer un utilisateur spécifique par son ID
 * @param {Object} req - Objet requête Express avec l'ID en paramètre
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Informations détaillées de l'utilisateur demandé
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} req - Objet requête Express avec les données d'utilisateur
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de création avec l'ID de l'utilisateur
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const userId = await User.create(req.body);
    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      userId,
      success: true 
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Connexion d'un utilisateur
 * @param {Object} req - Objet requête Express avec email et mot de passe
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Données utilisateur et création d'une session
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Configuration des données de session
      req.session.userId = user.user_id;
      req.session.role = user.role;

      // Return standardized response
      res.json({
        success: true,
        user: {
          id: user.user_id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: "Identifiants invalides" 
      });
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Déconnexion d'un utilisateur
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de déconnexion
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Échec de la déconnexion" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnecté avec succès" });
  });
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * @param {Object} req - Objet requête Express avec session utilisateur
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Informations du profil utilisateur
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mettre à jour un utilisateur
 * @param {Object} req - Objet requête Express avec ID et données à mettre à jour
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de mise à jour
 */
exports.updateUser = async (req, res) => {
  try {
    const userExists = await User.findById(req.params.id);
    if (!userExists) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Pas de vérification de sécurité comme demandé
    await User.update(req.params.id, req.body);
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprimer un utilisateur
 * @param {Object} req - Objet requête Express avec ID de l'utilisateur à supprimer
 * @param {Object} res - Objet réponse Express
 * @returns {Object} Confirmation de suppression
 */
exports.deleteUser = async (req, res) => {
  try {
    const userExists = await User.findById(req.params.id);
    if (!userExists) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Pas de vérification de sécurité comme demandé
    await User.delete(req.params.id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
