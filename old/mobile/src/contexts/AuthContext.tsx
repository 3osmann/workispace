import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/authService';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

/**
 * Interface définissant les fonctionnalités du contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (id: string, data: Partial<RegisterData>) => Promise<void>;
  deleteUserAccount: (id: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing user in storage
const USER_STORAGE_KEY = 'user_data';

/**
 * Provider du contexte d'authentification
 * @param children - Les composants enfants
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initCompleted, setInitCompleted] = useState(false);

  // Vérification de l'utilisateur au chargement
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        console.log('AuthContext: Vérification de l\'utilisateur dans le stockage...');
        // Try to get user from storage first
        const userDataString = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            console.log(`AuthContext: Utilisateur trouvé dans le stockage: ${userData.prenom} ${userData.nom} (${userData.role})`);
            setUser(userData);
          } catch (parseError) {
            console.error('AuthContext: Erreur lors du parsing des données utilisateur:', parseError);
            // If there's an error parsing, clear the corrupt data
            await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
          }
        } else {
          console.log('AuthContext: Aucun utilisateur dans le stockage, vérification API...');
          try {
            // If not in storage, try to get from API
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              console.log(`AuthContext: Utilisateur récupéré depuis l'API: ${currentUser.prenom} ${currentUser.nom}`);
              setUser(currentUser);
              await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(currentUser));
            } else {
              console.log('AuthContext: Aucun utilisateur connecté');
              setUser(null);
            }
          } catch (apiError) {
            console.error('AuthContext: Erreur API:', apiError);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('AuthContext: Erreur lors de la vérification de l\'utilisateur:', err);
        setUser(null);
      } finally {
        setLoading(false);
        setInitCompleted(true);
      }
    };

    loadUserFromStorage();
  }, []);

  /**
   * Connexion d'un utilisateur
   * @param credentials - Les identifiants de connexion
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Tentative de connexion...');
      const response = await authService.login(credentials);
      
      if (response && response.success && response.user) {
        console.log('Connexion réussie, utilisateur:', response.user);
        
        // Save user to secure storage first
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.user));
        // Then update the state
        setUser(response.user);
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      setError(err.message || 'Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inscription d'un nouvel utilisateur
   * @param data - Les données d'inscription
   */
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Tentative d\'inscription...');
      const response = await authService.register(data);
      console.log('Réponse d\'inscription:', response);
      return response;
    } catch (err: any) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = async () => {
    setLoading(true);
    try {
      console.log('Déconnexion...');
      // Always clear local storage first
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      
      // Then try to call the server logout, but don't fail if it doesn't work
      try {
        await authService.logout();
      } catch (error) {
        console.log("Error during server logout (can be ignored):", error);
      }
      
      // Always clear the user state
      setUser(null);
    } catch (err: any) {
      console.error('Error during logout:', err);
      // Still clear the user state even if there's an error
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mise à jour des informations d'un utilisateur
   * @param id - L'identifiant de l'utilisateur
   * @param data - Les données à mettre à jour
   */
  const updateUserInfo = async (id: string, data: Partial<RegisterData>) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Mise à jour utilisateur:', id, data);
      const updatedUser = await authService.updateUser(id, data);
      setUser(updatedUser);
      
      // Update user in storage
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Suppression d'un compte utilisateur
   * @param id - L'identifiant de l'utilisateur
   */
  const deleteUserAccount = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Suppression du compte:', id);
      await authService.deleteUser(id);
      // Clear user from storage
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      setUser(null);
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.message || 'Erreur lors de la suppression du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effacement des erreurs
   */
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserInfo,
    deleteUserAccount,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns Le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
