
import axios from 'axios';

// URL de l'API pour les propriétés
const API_URL = 'http://192.168.1.7:3000/api/properties';

/**
 * Interface pour les données de propriété
 * Définit la structure des données d'une propriété
 */
export interface PropertyData {
  id?: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  property_type: string;
  description: string;
  rating?: number;
  workstations?: number;
  meeting_rooms?: number;
  area?: number;
  wifi: boolean;
  parking: boolean;
  coffee: boolean;
  reception: boolean;
  kitchen: boolean;
  secured: boolean;
  accessible: boolean;
  printers: boolean;
  flexible_hours?: boolean;
  country: string;
  region: string;
  image?: string;
  image_url?: string;
  owner_id?: string;
}

/**
 * Crée une nouvelle propriété
 * @param propertyData - Les données de la propriété à créer
 * @param imageUri - URI de l'image à télécharger (optionnel)
 * @returns La propriété créée
 */
export const createProperty = async (propertyData: PropertyData, imageUri: string | null = null) => {
  try {
    let response;
    
    if (imageUri) {
      // Avec image
      const formData = new FormData();
      
      // Ajouter l'image
      const imageUriParts = imageUri.split('.');
      const fileType = imageUriParts[imageUriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `property_image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      
      // Ajouter toutes les données de propriété à formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Sans image
      response = await axios.post(API_URL, propertyData);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la création de la propriété:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la propriété');
  }
};

/**
 * Met à jour une propriété existante
 * @param propertyId - ID de la propriété à mettre à jour
 * @param propertyData - Les données à mettre à jour
 * @param imageUri - URI de la nouvelle image (optionnel)
 * @returns La propriété mise à jour
 */
export const updateProperty = async (propertyId: string, propertyData: Partial<PropertyData>, imageUri: string | null = null) => {
  try {
    let response;
    
    if (imageUri) {
      // Avec nouvelle image
      const formData = new FormData();
      
      // Ajouter l'image
      const imageUriParts = imageUri.split('.');
      const fileType = imageUriParts[imageUriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `property_image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      
      // Ajouter toutes les données modifiées à formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      response = await axios.put(`${API_URL}/${propertyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Sans nouvelle image
      response = await axios.put(`${API_URL}/${propertyId}`, propertyData);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la propriété:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la propriété');
  }
};

/**
 * Récupère toutes les propriétés
 * @returns Liste de toutes les propriétés
 */
export const getAllProperties = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    throw new Error('Erreur lors de la récupération des propriétés');
  }
};

/**
 * Récupère une propriété par son ID
 * @param propertyId - ID de la propriété à récupérer
 * @returns La propriété demandée
 */
export const getPropertyById = async (propertyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${propertyId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    throw new Error('Erreur lors de la récupération de la propriété');
  }
};

/**
 * Récupère toutes les propriétés d'un propriétaire
 * @param ownerId - ID du propriétaire
 * @returns Liste des propriétés du propriétaire
 */
export const getPropertiesByOwner = async (ownerId: string) => {
  try {
    const response = await axios.get(`${API_URL}/owner/${ownerId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des propriétés du propriétaire:', error);
    throw new Error('Erreur lors de la récupération des propriétés du propriétaire');
  }
};

/**
 * Supprime une propriété
 * @param propertyId - ID de la propriété à supprimer
 * @returns Confirmation de la suppression
 */
export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${propertyId}`);
    
    if (response.status === 200 || response.status === 204) {
      return { success: true };
    } else {
      throw new Error('Échec de la suppression');
    }
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la propriété:', error);
    throw new Error(error.response?.data?.message || 'Échec de la suppression');
  }
};

export default {
  createProperty,
  updateProperty,
  getAllProperties,
  getPropertyById,
  getPropertiesByOwner,
  deleteProperty
};
