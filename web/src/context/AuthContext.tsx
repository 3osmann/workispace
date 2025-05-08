
/**
 * AuthContext.tsx
 * 
 * Description (FR):
 * Ce fichier définit le contexte d'authentification pour l'application.
 * Il gère:
 * - La connexion et déconnexion des utilisateurs
 * - Le stockage et la récupération des données utilisateur
 * - Les vérifications d'accès et de permissions basées sur les rôles
 * - La persistance de l'état d'authentification
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { userApi, User, ApiError } from '@/services/api';

/**
 * Interface définissant un utilisateur authentifié
 */
interface AuthUser {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
  // Propriété virtuelle pour faciliter l'utilisation
  name?: string;
}

/**
 * Interface du contexte d'authentification
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasAccess: (route: string) => boolean;
  canEdit: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canCreate: (resource: string) => boolean;
  canView: (resource: string) => boolean;
}

/**
 * Création du contexte d'authentification
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// Définition des accès aux routes par rôle
const roleAccess = {
  user: ['/properties', '/settings'],
  admin: ['/properties', '/users', '/messages', '/bookings', '/reviews', '/settings'],
  owner: ['/properties', '/bookings', '/reviews', '/settings']
};

// Définition des permissions d'action par rôle et ressource
const rolePermissions = {
  user: {
    edit: ['settings'],
    delete: [],
    create: [],
    view: ['properties']
  },
  admin: {
    edit: ['settings', 'users'],
    delete: ['properties', 'users', 'messages', 'bookings'],
    create: ['users'],
    view: ['properties', 'users', 'messages', 'bookings']
  },
  owner: {
    edit: ['settings', 'properties', 'bookings'],
    delete: ['properties', 'bookings'],
    create: ['properties', 'bookings'],
    view: ['properties', 'bookings']
  }
};

/**
 * Fournisseur du contexte d'authentification
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Charger les données utilisateur depuis localStorage au chargement initial
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Tenter de charger l'utilisateur depuis localStorage d'abord
        const savedUser = localStorage.getItem('userData');
        const savedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (savedUser && savedIsAuthenticated) {
          // Analyser et définir l'utilisateur depuis localStorage
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Éviter la validation API pour éviter les erreurs 404
          // L'API peut être appelée à nouveau si nécessaire pour des opérations spécifiques
        } else {
          // Effacer tout état d'authentification invalide
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  /**
   * Fonction pour vérifier si l'utilisateur a accès à une route spécifique
   */
  const hasAccess = (route: string): boolean => {
    if (!user) return false;
    return roleAccess[user.role]?.includes(route) || false;
  };

  /**
   * Fonction pour vérifier si l'utilisateur peut modifier une ressource spécifique
   */
  const canEdit = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.edit.includes(resource) || false;
  };

  /**
   * Fonction pour vérifier si l'utilisateur peut supprimer une ressource spécifique
   */
  const canDelete = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.delete.includes(resource) || false;
  };
  
  /**
   * Fonction pour vérifier si l'utilisateur peut créer une ressource spécifique
   */
  const canCreate = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.create.includes(resource) || false;
  };
  
  /**
   * Fonction pour vérifier si l'utilisateur peut voir une ressource spécifique
   */
  const canView = (resource: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.view.includes(resource) || false;
  };

  /**
   * Fonction de connexion
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthContext: Tentative de connexion avec l'API", { email }); // Log de débogage
      const response = await userApi.login({ email, password });
      
      if (response && response.user) {
        // S'assurer que nous utilisons le bon nom de champ (user_id)
        // L'API renvoie 'user_id' que nous utilisons dans notre application
        const loggedInUser = {
          ...response.user,
          // Assurer que user_id est correctement défini
          user_id: response.user.user_id,
          name: `${response.user.prenom} ${response.user.nom}`.trim() 
        };
        
        console.log("Données utilisateur connecté:", loggedInUser);
        
        // Stocker le drapeau d'authentification et les données utilisateur
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(loggedInUser));
        
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${loggedInUser.prenom} ${loggedInUser.nom}`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur de connexion dans AuthContext:", error); // Log de débogage
      if (error instanceof ApiError) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  /**
   * Fonction de déconnexion
   */
  const logout = async () => {
    try {
      await userApi.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Effacer toutes les données d'authentification
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasAccess,
      canEdit,
      canDelete,
      canCreate,
      canView
    }}>
      {children}
    </AuthContext.Provider>
  );
};
