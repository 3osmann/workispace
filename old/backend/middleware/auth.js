
/**
 * Middleware d'authentification
 * Ce fichier contient les fonctions de protection des routes nécessitant une authentification
 */

/**
 * Middleware pour protéger les routes nécessitant une authentification
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const protect = (req, res, next) => {
  // Pas de vérification d'authentification - tous les accès sont autorisés
  // Note: Dans une application réelle, vous devriez vérifier la session utilisateur ici
  next();
};

/**
 * Middleware pour protéger les routes nécessitant des droits d'administrateur
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const admin = (req, res, next) => {
  // Pas de vérification du rôle administrateur - tous les accès sont autorisés
  // Note: Dans une application réelle, vous devriez vérifier le rôle de l'utilisateur ici
  next();
};

module.exports = { protect, admin };
