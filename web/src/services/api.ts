
/**
 * api.ts
 * 
 * Description (FR):
 * Service d'API principal pour l'application.
 * Gère toutes les communications avec le backend, y compris:
 * - L'authentification des utilisateurs
 * - La gestion des propriétés
 * - La gestion des réservations
 * - Les autres opérations CRUD
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders } from 'axios';

// URL de base de l'API
const API_URL = 'http://192.168.1.7:3000';

/**
 * Classe personnalisée pour les erreurs d'API
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Configuration de l'instance axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout d'un intercepteur de requête pour l'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Créer un nouvel objet headers s'il n'existe pas
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Ajout d'un intercepteur de réponse pour la gestion des erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Gérer les erreurs 401 Non autorisé (token expiré ou invalide)
    if (error.response && error.response.status === 401) {
      // Effacer les données d'authentification de localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      
      // Rediriger vers la page de connexion si pas déjà là
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Transformer l'erreur axios en ApiError
    const message = 
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : error.message || 
          'Une erreur est survenue';
    
    const status = error.response?.status || 500;
    
    return Promise.reject(new ApiError(message, status));
  }
);

/**
 * Fonctions API génériques
 */
const fetchData = async (endpoint: string) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

const postData = async (endpoint: string, data: any) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

const updateData = async (endpoint: string, data: any) => {
  const response = await apiClient.put(endpoint, data);
  return response.data;
};

const deleteData = async (endpoint: string) => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};

/**
 * Interface définissant un utilisateur
 */
export interface User {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
}

/**
 * Interface pour la réponse de connexion
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * API Utilisateur - Gestion des opérations liées aux utilisateurs
 */
export const userApi = {
  /**
   * Connexion utilisateur
   */
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    // Utiliser le chemin d'endpoint correct tel que spécifié dans la documentation API
    const data = await postData('/api/users/login', credentials);
    
    // Enregistrer le token s'il est retourné
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    // S'assurer que user_id est correctement défini
    if (data.user && !data.user.user_id && data.user.id) {
      data.user.user_id = data.user.id;
    }
    
    return data;
  },
  
  /**
   * Déconnexion utilisateur
   */
  logout: async (): Promise<void> => {
    try {
      await postData('/api/auth/logout', {});
    } finally {
      // Effacer le token quelle que soit la réponse de l'API
      localStorage.removeItem('token');
    }
  },
  
  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser: async (): Promise<User> => {
    return await fetchData('/api/users/me');
  },
  
  /**
   * Récupérer tous les utilisateurs
   */
  getUsers: async (): Promise<User[]> => {
    return await fetchData('/api/users');
  },
  
  /**
   * Alternative pour récupérer tous les utilisateurs
   */
  getAllUsers: async (): Promise<User[]> => {
    return await fetchData('/api/users');
  },
  
  /**
   * Récupérer un utilisateur par son ID
   */
  getUserById: async (id: number): Promise<User> => {
    return await fetchData(`/api/users/${id}`);
  },
  
  /**
   * Enregistrer un nouvel utilisateur
   */
  register: async (userData: { 
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> => {
    return await postData('/api/auth/register', userData);
  },
  
  /**
   * Créer un utilisateur
   */
  createUser: async (userData: Partial<User> & { password?: string }): Promise<User> => {
    return await postData('/api/users', userData);
  },
  
  /**
   * Mettre à jour un utilisateur
   */
  updateUser: async (id: number, userData: Partial<User> & { password?: string }): Promise<User> => {
    console.log(`API: Mise à jour de l'utilisateur avec ID: ${id}`, userData);
    return await updateData(`/api/users/${id}`, userData);
  },
  
  /**
   * Supprimer un utilisateur
   */
  deleteUser: async (id: number): Promise<void> => {
    return await deleteData(`/api/users/${id}`);
  }
};

/**
 * Types et API pour les propriétés
 */
export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'booked' | 'maintenance';
  property_type: 'office' | 'residential';
  description?: string;
  image_url?: string;
  rating: number;
  workstations?: number;
  meeting_rooms?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  wifi?: boolean;
  parking?: boolean;
  coffee?: boolean;
  reception?: boolean;
  kitchen?: boolean;
  secured?: boolean;
  accessible?: boolean;
  printers?: boolean;
  flexible_hours?: boolean;
  country?: string;
  region?: string;
}

export interface PropertyCreate extends Omit<Property, 'id'> {}
export interface PropertyUpdate extends Partial<Property> {}

// Importer l'interface OfficePropertyData depuis OfficePropertyCard pour assurer la compatibilité
import { OfficePropertyData as CardOfficePropertyData } from '@/components/OfficePropertyCard';

// Exporter notre implémentation d'OfficePropertyData qui correspond au composant card
export type OfficePropertyData = CardOfficePropertyData;

// Cache pour les données de propriétés afin d'éviter plusieurs appels API
let propertiesCache: Property[] | null = null;
let propertiesCacheTimestamp: number | null = null;
const CACHE_DURATION = 60000; // Cache de 1 minute

/**
 * API Propriété - Gestion des opérations liées aux propriétés
 */
export const propertyApi = {
  /**
   * Récupérer toutes les propriétés
   */
  getAllProperties: async (): Promise<Property[]> => {
    // Vérifier si nous avons un cache valide
    const now = Date.now();
    if (propertiesCache && propertiesCacheTimestamp && (now - propertiesCacheTimestamp < CACHE_DURATION)) {
      console.log('Utilisation des données de propriétés en cache');
      return propertiesCache;
    }
    
    try {
      console.log('Récupération des propriétés depuis l\'API');
      const response = await fetchData('/api/properties');
      
      // Gérer la structure de réponse API
      let properties: Property[] = [];
      if (response && response.success && Array.isArray(response.data)) {
        // Si l'API renvoie { success: true, data: [...] }
        properties = response.data.map((prop: any) => ({
          ...prop,
          // Convertir les chaînes numériques en nombres
          price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
          area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
          rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
          // Convertir les booléens DB (0/1) en booléens réels
          wifi: prop.wifi === 1 || prop.wifi === true,
          parking: prop.parking === 1 || prop.parking === true,
          coffee: prop.coffee === 1 || prop.coffee === true,
          reception: prop.reception === 1 || prop.reception === true,
          kitchen: prop.kitchen === 1 || prop.kitchen === true,
          secured: prop.secured === 1 || prop.secured === true,
          accessible: prop.accessible === 1 || prop.accessible === true,
          printers: prop.printers === 1 || prop.printers === true,
          flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
          // Inclure le pays et la région
          country: prop.country || 'fr',
          region: prop.region || ''
        }));
      } else if (Array.isArray(response)) {
        // Si l'API renvoie directement un tableau
        properties = response.map((prop: any) => ({
          ...prop,
          price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
          area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
          rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
          wifi: prop.wifi === 1 || prop.wifi === true,
          parking: prop.parking === 1 || prop.parking === true,
          coffee: prop.coffee === 1 || prop.coffee === true,
          reception: prop.reception === 1 || prop.reception === true,
          kitchen: prop.kitchen === 1 || prop.kitchen === true,
          secured: prop.secured === 1 || prop.secured === true,
          accessible: prop.accessible === 1 || prop.accessible === true,
          printers: prop.printers === 1 || prop.printers === true,
          flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
          // Inclure le pays et la région
          country: prop.country || 'fr',
          region: prop.region || ''
        }));
      } else {
        console.warn('Format de réponse API inattendu:', response);
        throw new Error('Format de réponse API invalide');
      }
      
      // Mettre à jour le cache
      propertiesCache = properties;
      propertiesCacheTimestamp = now;
      
      return properties;
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer une propriété par son ID
   */
  getPropertyById: async (id: string): Promise<Property> => {
    // D'abord vérifier si nous l'avons en cache pour éviter un appel API
    if (propertiesCache) {
      const cachedProperty = propertiesCache.find(p => p.id === id);
      if (cachedProperty) {
        console.log('Utilisation de la propriété en cache:', id);
        return cachedProperty;
      }
    }
    
    // Essayer de récupérer depuis l'API
    const response = await fetchData(`/api/properties/${id}`);
    
    // Gérer la structure de réponse API
    let property: Property;
    if (response && response.success && response.data) {
      const prop = response.data;
      property = {
        ...prop,
        price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
        area: prop.area ? (typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area) : undefined,
        rating: typeof prop.rating === 'string' ? parseFloat(prop.rating) : prop.rating,
        wifi: prop.wifi === 1 || prop.wifi === true,
        parking: prop.parking === 1 || prop.parking === true,
        coffee: prop.coffee === 1 || prop.coffee === true,
        reception: prop.reception === 1 || prop.reception === true,
        kitchen: prop.kitchen === 1 || prop.kitchen === true,
        secured: prop.secured === 1 || prop.secured === true,
        accessible: prop.accessible === 1 || prop.accessible === true,
        printers: prop.printers === 1 || prop.printers === true,
        flexible_hours: prop.flexible_hours === 1 || prop.flexible_hours === true,
        // Inclure le pays et la région
        country: prop.country || 'fr',
        region: prop.region || ''
      };
    } else {
      property = response;
    }
    
    return property;
  },
  
  /**
   * Créer une nouvelle propriété
   */
  createProperty: async (propertyData: PropertyCreate, imageFile?: File): Promise<Property> => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
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
      
      const response = await apiClient.post('/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Effacer le cache après avoir créé une nouvelle propriété
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      
      return response.data;
    } else {
      const result = await postData('/api/properties', propertyData);
      // Effacer le cache après avoir créé une nouvelle propriété
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      return result;
    }
  },
  
  /**
   * Mettre à jour une propriété
   */
  updateProperty: async (id: string, propertyData: PropertyUpdate, imageFile?: File): Promise<Property> => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
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
      
      const response = await apiClient.put(`/api/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Effacer le cache après avoir mis à jour une propriété
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      
      return response.data;
    } else {
      const result = await updateData(`/api/properties/${id}`, propertyData);
      // Effacer le cache après avoir mis à jour une propriété
      propertiesCache = null;
      propertiesCacheTimestamp = null;
      return result;
    }
  },
  
  /**
   * Supprimer une propriété
   */
  deleteProperty: async (id: string): Promise<void> => {
    await deleteData(`/api/properties/${id}`);
    // Effacer le cache après avoir supprimé une propriété
    propertiesCache = null;
    propertiesCacheTimestamp = null;
  },
  
  /**
   * Mapper une propriété API à OfficePropertyData
   */
  mapApiPropertyToOfficePropertyData: (property: Property): CardOfficePropertyData => {
    // Créer un tableau des équipements disponibles
    const amenities: string[] = [];
    if (property.wifi) amenities.push('wifi');
    if (property.parking) amenities.push('parking');
    if (property.coffee) amenities.push('coffee');
    if (property.kitchen) amenities.push('kitchen');
    if (property.printers) amenities.push('printers');
    if (property.reception) amenities.push('reception');
    if (property.accessible) amenities.push('accessible');
    if (property.secured) amenities.push('secured');
    if (property.flexible_hours) amenities.push('flexible_hours');
    
    return {
      id: property.id,
      title: property.title,
      address: property.address,
      price: property.price,
      type: property.type,
      status: property.status,
      imageUrl: property.image_url || '/placeholder.svg',
      rating: property.rating || 4.0,
      workstations: property.workstations || 0,
      meetingRooms: property.meeting_rooms || 0,
      area: property.area || 0,
      wifi: property.wifi || false,
      parking: property.parking || false,
      flexibleHours: property.flexible_hours || false,
      amenities,
      country: property.country || 'fr',
      region: property.region || ''
    };
  }
};

// Exporter les fonctions API génériques
export { fetchData, postData, updateData, deleteData };

// Exporter l'instance axios pour une utilisation directe
export default apiClient;
