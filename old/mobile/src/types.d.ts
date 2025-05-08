/**
 * Définitions de types pour l'application de gestion d'espaces de bureaux
 * Types definitions for the office space management application
 */

// Types d'utilisateur / User types
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'user' | 'owner' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

// Informations d'identification pour la connexion / Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Données pour l'inscription / Registration data
export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role?: 'user' | 'owner' | 'admin';
}

// Champs modifiables du profil utilisateur / Editable user profile fields
export type EditableField = 'email' | 'nom' | 'prenom' | 'password';

/**
 * Types pour les activités et le flux d'activités
 * Types for activities and activity feed
 */
export type ActivityType = 'space' | 'rental' | 'user' | 'maintenance' | 'device' | 'return';

// Élément d'activité affiché dans le flux / Activity item displayed in the feed
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'pending' | 'inProgress';
  user?: {
    name: string;
    initials: string;
  };
}

/**
 * Types pour le support client
 * Types for customer support
 */
// Catégories de support / Support categories
export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

// Message de chat pour le support / Chat message for support
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'agent';
  agent?: {
    name: string;
    avatar: string;
  };
}

/**
 * Types pour les réservations
 * Types for bookings
 */
// Réservation d'un espace de bureau / Office space booking
export interface Booking {
  id: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'upcoming' | 'completed';
  image: string;
  price: number;
}

/**
 * Types pour les appareils et équipements
 * Types for devices and equipment
 */
// Appareil ou équipement dans un espace de bureau / Device or equipment in an office space
export interface Device {
  id: string;
  name: string;
  status: string;
  type: string;
  location: string;
  serialNumber?: string;
  lastMaintenance?: string;
  addedDate?: string;
  lastRented?: string;
  value?: number;
}

/**
 * Types pour la gestion des utilisateurs
 * Types for user management
 */
// Élément utilisateur dans la liste d'administration / User item in admin list
export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  department?: string;
  registeredDate?: string;
  totalRentals?: number;
  currentRentals?: number;
}

/**
 * Types pour les données d'onboarding
 * Types for onboarding data
 */
// Données d'un slide d'onboarding / Onboarding slide data
export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}

/**
 * Types pour les propriétés
 * Types for properties
 */

// Données pour la création/édition de propriété / Data for property creation/edition
export interface PropertyData {
  id?: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  region: string;
  lat?: number;
  lng?: number;
  price: number;
  property_type: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  workstations: number;
  meeting_rooms: number;
  amenities: string[];
  images: string[];
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Propriété / Property
export interface Property {
  id: string;
  title: string;
  address: string;
  image?: string;
  image_url?: string;
  price: number | string;
  status: string;
  workstations?: number;
  meeting_rooms?: number;
  area?: number | string;
  owner_id?: string;
  description?: string;
  region?: string;
  country?: string;
  location?: string;
  wifi?: boolean | number;
  parking?: boolean | number;
  coffee?: boolean | number;
  reception?: boolean | number;
  kitchen?: boolean | number;
  secured?: boolean | number;
  accessible?: boolean | number;
  printers?: boolean | number;
  flexible_hours?: boolean | number;
  created_at?: string;
  updated_at?: string;
  property_type?: string;
  type?: string;
  rating?: number | string;
  reviews?: number;
}

// For EditPropertyScreen - importing @react-native-community/slider
declare module '@react-native-community/slider' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';
  
  interface SliderProps {
    value?: number;
    disabled?: boolean;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    thumbImage?: any;
    onValueChange?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    style?: ViewStyle;
    inverted?: boolean;
    vertical?: boolean;
  }

  export default class Slider extends Component<SliderProps> {}
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}
