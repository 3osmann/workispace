
/**
 * Layout.tsx
 * 
 * Description (FR):
 * Ce composant définit la mise en page principale de l'application.
 * Il intègre la barre latérale (Sidebar) et organise la structure de base
 * des pages avec une gestion responsive pour différentes tailles d'écran.
 */

import React from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../context/SidebarContext';
import { cn } from '@/lib/utils';

/**
 * Interface pour les propriétés du composant Layout
 * 
 * Accepte les éléments enfants à afficher dans la zone principale
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Composant de mise en page principal
 * 
 * Organise l'interface en deux zones principales:
 * - Barre latérale de navigation (Sidebar)
 * - Zone de contenu principal
 * 
 * Gère l'état d'ouverture/fermeture de la barre latérale et ajuste
 * dynamiquement les espacements et la disposition en fonction de cet état.
 * Assure la compatibilité avec différentes tailles d'écran (responsive design).
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-background flex flex-col sm:flex-row">
      <Sidebar />
      <main 
        className={cn(
          "min-h-screen flex-1 transition-all duration-300 ease-in-out pt-16 pb-6 lg:pt-2",
          isOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="container max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 animate-page-transition">
          {children}
        </div>
      </main>
    </div>
  );
};
