
/**
 * Module de gestion des lieux dans la base de données
 * Ce fichier contient toutes les fonctions pour interagir avec la table 'places'
 */
const db = require("../config/db");

/**
 * Classe Place qui gère toutes les opérations CRUD sur les lieux
 * Cette classe fait le lien entre l'API et la base de données pour les lieux
 */
class Place {
  /**
   * Récupère tous les lieux de la base de données
   * @returns {Promise<Array>} Liste de tous les lieux
   */
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM places");
    return rows;
  }

  /**
   * Récupère un lieu spécifique par son ID
   * @param {number} id - ID du lieu à récupérer
   * @returns {Promise<Object|null>} Le lieu trouvé ou null
   */
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM places WHERE place_id = ?", [
      id,
    ]);
    return rows[0];
  }

  /**
   * Crée un nouveau lieu dans la base de données
   * @param {Object} placeData - Données du lieu à créer
   * @returns {Promise<number>} ID du nouveau lieu créé
   */
  static async create(placeData) {
    const [result] = await db.query(
      `INSERT INTO places 
      (nom_place, description, location, longitude, latitude, url_img, url_web)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.nom_place,
        placeData.description,
        placeData.location,
        placeData.longitude,
        placeData.latitude,
        placeData.url_img,
        placeData.url_web,
      ]
    );
    return result.insertId;
  }

  /**
   * Met à jour les informations d'un lieu existant
   * @param {number} id - ID du lieu à mettre à jour
   * @param {Object} updates - Nouvelles données à appliquer
   * @returns {Promise<void>} Aucun retour
   */
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE places SET ${fields} WHERE place_id = ?`, [
      ...values,
      id,
    ]);
  }

  /**
   * Supprime un lieu de la base de données
   * @param {number} id - ID du lieu à supprimer
   * @returns {Promise<void>} Aucun retour
   */
  static async delete(id) {
    await db.query("DELETE FROM places WHERE place_id = ?", [id]);
  }
}

module.exports = Place;
