
/**
 * SidebarContext.tsx
 * 
 * Description (FR):
 * Ce contexte gère l'état de la barre latérale (sidebar) dans l'application.
 * Il fournit:
 * - Un état pour savoir si la sidebar est ouverte ou fermée
 * - Des fonctions pour ouvrir, fermer ou basculer l'état de la sidebar
 * - Une détection du mode mobile pour adapter l'affichage
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // When in mobile mode, always start with sidebar closed
      if (mobile) {
        setIsOpen(false);
      } else {
        // On desktop, default to open
        setIsOpen(true);
      }
    };

    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggle = () => setIsOpen(prev => !prev);
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen: setIsOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  
  return context;
};
