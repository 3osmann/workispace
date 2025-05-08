
/**
 * PrivateRoute.tsx
 * 
 * Description (FR):
 * Ce composant protège les routes qui nécessitent une authentification.
 * Fonctionnalités:
 * - Vérifie si l'utilisateur est authentifié
 * - Redirige vers la page de connexion si non authentifié
 * - Vérifie les permissions d'accès basées sur le rôle
 * - Affiche un indicateur de chargement pendant la vérification
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type PrivateRouteProps = {
  element: React.ReactNode;
};

/**
 * Composant qui enveloppe les routes protégées
 * Vérifie l'authentification et les permissions avant d'afficher le contenu
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();
  const { isAuthenticated, hasAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  
  // Journaliser l'état d'authentification (une seule fois pour éviter le spam de console)
  useEffect(() => {
    console.log("PrivateRoute - chemin:", location.pathname, "isAuthenticated:", isAuthenticated);
  }, [location.pathname, isAuthenticated]);
  
  // Définir un délai pour éviter l'état de chargement flash pour les vérifications d'authentification rapides
  useEffect(() => {
    // Si l'authentification est déjà déterminée, ne pas afficher l'état de chargement
    if (isAuthenticated === false) {
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  // Vérifier les permissions séparément dans son propre effet
  useEffect(() => {
    if (isAuthenticated) {
      // Vérifier si l'utilisateur a accès à cette route
      const permission = hasAccess(location.pathname);
      
      // Toujours autoriser l'accès aux pages de détails des propriétés indépendamment des permissions régulières
      const isPropertyDetailPage = location.pathname.startsWith('/properties/');
      
      setHasPermission(permission || isPropertyDetailPage);
      
      // Journaliser une seule fois pour éviter le spam de console
      console.log("L'utilisateur a accès à", location.pathname, ":", permission);
    }
  }, [location.pathname, isAuthenticated, hasAccess]);
  
  // Afficher l'indicateur de chargement pendant la vérification de l'état d'authentification
  if (isLoading && localStorage.getItem('isAuthenticated') === 'true') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background transition-opacity">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-lg mt-4 font-medium text-primary">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // Si non authentifié, rediriger vers la connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si authentifié mais sans permission, rediriger vers les propriétés
  if (!hasPermission) {
    return <Navigate to="/properties" replace />;
  }
  
  // Si authentifié et avec accès, afficher le composant protégé
  return <>{element}</>;
};
