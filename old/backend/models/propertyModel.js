const db = require("../config/db");

class Property {
  /**
   * Récupère toutes les propriétés de la base de données
   * @returns {Promise<Array>} Une promesse avec un tableau de propriétés
   */
  static async getAll() {
    try {
      // Requête SQL pour récupérer toutes les propriétés
      const [properties] = await db.query(`
        SELECT p.*, 
               pa.wifi, pa.parking, pa.coffee, pa.reception, 
               pa.secured, pa.\`accessible\`, pa.printers, 
               pa.kitchen, pa.flexible_hours
        FROM properties p
        LEFT JOIN property_amenities pa ON p.id = pa.property_id
        ORDER BY p.created_at DESC
      `);
      return properties;
    } catch (error) {
      console.error("Erreur lors de la récupération des propriétés:", error);
      throw new Error("Impossible de récupérer les propriétés");
    }
  }

  /**
   * Récupère une propriété par son identifiant
   * @param {string} id - L'identifiant de la propriété
   * @returns {Promise<Object>} Une promesse avec les données de la propriété
   */
  static async getById(id) {
    try {
      // Requête SQL pour récupérer une propriété spécifique avec ses équipements
      const [properties] = await db.query(
        `SELECT p.*, 
                pa.wifi, pa.parking, pa.coffee, pa.reception, 
                pa.secured, pa.\`accessible\`, pa.printers, 
                pa.kitchen, pa.flexible_hours
         FROM properties p
         LEFT JOIN property_amenities pa ON p.id = pa.property_id
         WHERE p.id = ?`,
        [id]
      );

      if (properties.length === 0) {
        return null;
      }

      return properties[0];
    } catch (error) {
      console.error(`Erreur lors de la récupération de la propriété ${id}:`, error);
      throw new Error("Impossible de récupérer la propriété");
    }
  }

  /**
   * Crée une nouvelle propriété dans la base de données
   * @param {Object} propertyData - Les données de la propriété à créer
   * @returns {Promise<string>} Une promesse avec l'ID de la propriété créée
   */
  static async create(propertyData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Extraction des données de la propriété et des équipements
      const {
        id,
        title,
        description,
        address,
        country,
        region,
        price,
        type,
        bedrooms,
        bathrooms,
        area,
        workstations,
        meeting_rooms,
        rating,
        status,
        image_url,
        property_type,
        owner_id,
        // Équipements
        wifi,
        parking,
        coffee,
        reception,
        secured,
        accessible,
        printers,
        kitchen,
        flexible_hours
      } = propertyData;

      // Requête SQL pour insérer la propriété
      const [result] = await connection.query(
        `INSERT INTO properties (
          id, title, description, address, country, region, price, type, bedrooms, bathrooms, area,
          workstations, meeting_rooms, rating, status, image_url, property_type, owner_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          title,
          description || null,
          address,
          country || 'Morocco',
          region || null,
          price,
          type,
          bedrooms || null,
          bathrooms || null,
          area || null,
          workstations || null,
          meeting_rooms || null,
          rating,
          status || 'available',
          image_url,
          property_type,
          owner_id || null
        ]
      );

      // Insérer les équipements si la propriété a été créée
      if (property_type === 'office') {
        await connection.query(
          `INSERT INTO property_amenities (
            property_id, wifi, parking, coffee, reception, secured,
            \`accessible\`, printers, kitchen, flexible_hours
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            wifi || false,
            parking || false,
            coffee || false,
            reception || false,
            secured || false,
            accessible || false,
            printers || false,
            kitchen || false,
            flexible_hours || false
          ]
        );
      }

      await connection.commit();
      return id;
    } catch (error) {
      await connection.rollback();
      console.error("Erreur lors de la création de la propriété:", error);
      throw new Error("Impossible de créer la propriété");
    } finally {
      connection.release();
    }
  }

  /**
   * Met à jour une propriété existante
   * @param {string} id - L'identifiant de la propriété à mettre à jour
   * @param {Object} propertyData - Les nouvelles données de la propriété
   * @returns {Promise<boolean>} Une promesse indiquant si la mise à jour a réussi
   */
  static async update(id, propertyData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Extraction des données principales de la propriété
      const {
        title,
        description,
        address,
        country,
        region,
        price,
        type,
        bedrooms,
        bathrooms,
        area,
        workstations,
        meeting_rooms,
        rating,
        status,
        image_url,
        property_type,
        owner_id,
        // Équipements
        wifi,
        parking,
        coffee,
        reception,
        secured,
        accessible,
        printers,
        kitchen,
        flexible_hours
      } = propertyData;

      // Requête SQL pour mettre à jour la propriété
      const [result] = await connection.query(
        `UPDATE properties SET
          title = IFNULL(?, title),
          description = IFNULL(?, description),
          address = IFNULL(?, address),
          country = IFNULL(?, country),
          region = IFNULL(?, region),
          price = IFNULL(?, price),
          type = IFNULL(?, type),
          bedrooms = IFNULL(?, bedrooms),
          bathrooms = IFNULL(?, bathrooms),
          area = IFNULL(?, area),
          workstations = IFNULL(?, workstations),
          meeting_rooms = IFNULL(?, meeting_rooms),
          rating = IFNULL(?, rating),
          status = IFNULL(?, status),
          image_url = IFNULL(?, image_url),
          property_type = IFNULL(?, property_type),
          owner_id = IFNULL(?, owner_id),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          title || null,
          description || null,
          address || null,
          country || null,
          region || null,
          price || null,
          type || null,
          bedrooms || null,
          bathrooms || null,
          area || null,
          workstations || null,
          meeting_rooms || null,
          rating || null,
          status || null,
          image_url || null,
          property_type || null,
          owner_id || null,
          id
        ]
      );

      // Vérifier si la propriété existe
      if (result.affectedRows === 0) {
        throw new Error(`Propriété avec l'ID ${id} non trouvée`);
      }

      // Mettre à jour les équipements si fournis
      const hasAmenities = wifi !== undefined || parking !== undefined || coffee !== undefined ||
                         reception !== undefined || secured !== undefined || accessible !== undefined ||
                         printers !== undefined || kitchen !== undefined || flexible_hours !== undefined;

      if (hasAmenities) {
        // Vérifier si les équipements existent déjà
        const [amenities] = await connection.query(
          'SELECT * FROM property_amenities WHERE property_id = ?',
          [id]
        );

        if (amenities.length > 0) {
          // Mettre à jour les équipements existants avec SET clause qui utilise les valeurs exactes
          let updateQuery = 'UPDATE property_amenities SET ';
          const updateParams = [];
          const amenitiesFields = {
            wifi, parking, coffee, reception, secured, accessible, printers, kitchen, flexible_hours
          };

          // Construction dynamique de la requête de mise à jour
          const setStatements = [];
          
          for (const [field, value] of Object.entries(amenitiesFields)) {
            if (value !== undefined) {
              // Utiliser le bon nom de champ pour le cas spécial 'accessible'
              const fieldName = field === 'accessible' ? '`accessible`' : field;
              setStatements.push(`${fieldName} = ?`);
              updateParams.push(value);
            }
          }
          
          // Si aucun champ à mettre à jour, sortir
          if (setStatements.length === 0) {
            await connection.commit();
            return true;
          }
          
          updateQuery += setStatements.join(', ');
          updateQuery += ' WHERE property_id = ?';
          updateParams.push(id);

          await connection.query(updateQuery, updateParams);
        } else {
          // Créer de nouveaux équipements
          await connection.query(
            `INSERT INTO property_amenities (
              property_id, wifi, parking, coffee, reception, secured,
              \`accessible\`, printers, kitchen, flexible_hours
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              wifi || false,
              parking || false,
              coffee || false,
              reception || false,
              secured || false,
              accessible || false,
              printers || false,
              kitchen || false,
              flexible_hours || false
            ]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`Erreur lors de la mise à jour de la propriété ${id}:`, error);
      throw new Error("Impossible de mettre à jour la propriété");
    } finally {
      connection.release();
    }
  }

  /**
   * Supprime une propriété de la base de données
   * @param {string} id - L'identifiant de la propriété à supprimer
   * @returns {Promise<boolean>} Une promesse indiquant si la suppression a réussi
   */
  static async delete(id) {
    try {
      // Suppression de la propriété (les équipements seront supprimés par la contrainte CASCADE)
      const [result] = await db.query(
        'DELETE FROM properties WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Propriété avec l'ID ${id} non trouvée`);
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la propriété ${id}:`, error);
      throw new Error("Impossible de supprimer la propriété");
    }
  }

  /**
   * Get all properties for a specific owner
   * @param {string} ownerId - The ID of the owner
   * @returns {Promise<Array>} Promise resolving to array of properties
   */
  static async getAllByOwner(ownerId) {
    try {
      const [properties] = await db.query(
        `SELECT p.*, 
              pa.wifi, pa.parking, pa.coffee, pa.reception, 
              pa.secured, pa.\`accessible\`, pa.printers, 
              pa.kitchen, pa.flexible_hours
       FROM properties p
       LEFT JOIN property_amenities pa ON p.id = pa.property_id
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
        [ownerId]
      );
      return properties;
    } catch (error) {
      console.error("Error getting properties by owner:", error);
      throw new Error("Unable to retrieve owner properties");
    }
  }
}

module.exports = Property;
