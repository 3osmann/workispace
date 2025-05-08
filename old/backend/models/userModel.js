
// Importation de la connexion à la base de données depuis le fichier de configuration
const db = require("../config/db");
// Importation de la bibliothèque bcryptjs pour le hachage des mots de passe
const bcrypt = require("bcryptjs");

/**
 * Classe User qui gère toutes les opérations CRUD sur les utilisateurs
 * Cette classe fait le lien entre l'API et la base de données pour les utilisateurs
 */
class User {
  /**
   * Récupère tous les utilisateurs de la base de données (sans les mots de passe)
   * @returns {Promise<Array>} Liste de tous les utilisateurs avec leurs informations principales
   */
  static async findAll() {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role FROM users"
    );
    return rows; // Retourne tous les utilisateurs
  }

  /**
   * Crée un nouvel utilisateur dans la base de données
   * @param {Object} userData - Données de l'utilisateur à créer (nom, prenom, email, password, role)
   * @returns {Promise<number>} ID du nouvel utilisateur créé
   */
  static async create(userData) {
    // Hachage du mot de passe fourni par l'utilisateur pour sécuriser le stockage
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insertion du nouvel utilisateur dans la base de données
    const [result] = await db.query(
      `INSERT INTO users 
      (nom, prenom, email, password_hash, role) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        userData.nom,
        userData.prenom,
        userData.email,
        hashedPassword, // mot de passe haché
        userData.role || "user", // par défaut, le rôle est "user"
      ]
    );

    return result.insertId; // Retourne l'ID du nouvel utilisateur
  }

  /**
   * Recherche un utilisateur par son adresse email
   * @param {string} email - Email de l'utilisateur à rechercher
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0]; // Retourne le premier utilisateur trouvé
  }

  /**
   * Recherche un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur à rechercher
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0]; // Retourne l'utilisateur correspondant
  }

  /**
   * Met à jour les informations d'un utilisateur
   * @param {number} id - ID de l'utilisateur à mettre à jour
   * @param {Object} updates - Nouvelles données (nom, prenom, email, password, role)
   * @returns {Promise<void>} Aucun retour
   */
  static async update(id, updates) {
    // Si un nouveau mot de passe est fourni, on le hache avant de l'enregistrer
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password; // On supprime l'ancien champ "password" non haché
    }

    // Si aucun champ n'est fourni pour la mise à jour, on arrête ici
    if (Object.keys(updates).length === 0) {
      return;
    }

    // Construction dynamique de la requête SQL
    // Exemple : "nom = ?, prenom = ?, email = ?"
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    // Exécution de la requête de mise à jour
    await db.query(`UPDATE users SET ${fields} WHERE user_id = ?`, [
      ...values,
      id,
    ]);
  }

  /**
   * Supprime un utilisateur de la base de données
   * @param {number} id - ID de l'utilisateur à supprimer
   * @returns {Promise<void>} Aucun retour
   */
  static async delete(id) {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  }
}

// Exportation de la classe User pour l'utiliser dans d'autres fichiers
module.exports = User;
