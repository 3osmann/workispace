
/**
 * App.tsx
 * 
 * Description (FR):
 * Ce fichier est le point d'entrée principal de l'application React.
 * Il configure les routes, les fournisseurs de contexte (providers) et la structure globale de l'application.
 * Il gère également l'initialisation de l'authentification et des thèmes.
 */

import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/Login";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Bookings from "./pages/Bookings";
import Users from "./pages/Users";
import Reviews from "./pages/Reviews";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

/**
 * Client de requête pour React Query
 * 
 * Configure la gestion des requêtes API, du cache et des mises à jour.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Composant principal de l'application
 * 
 * Structure l'application avec:
 * - Fournisseurs de contexte (React Query, Tooltips, Authentification, Sidebar)
 * - Système de notification (Toaster)
 * - Configuration des routes avec protection d'accès
 * - Redirection automatique vers la page des propriétés
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/properties" replace />} />
              
              {/* Routes requiring authentication */}
              <Route path="/properties" element={<PrivateRoute element={<Properties />} />} />
              <Route path="/properties/:id" element={<PrivateRoute element={<PropertyDetails />} />} />
              <Route path="/bookings" element={<PrivateRoute element={<Bookings />} />} />
              <Route path="/users" element={<PrivateRoute element={<Users />} />} />
              <Route path="/reviews" element={<PrivateRoute element={<Reviews />} />} />
              <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
              <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
