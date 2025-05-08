
/**
 * UserItem.tsx
 * 
 * Description (FR):
 * Ce composant affiche les informations d'un utilisateur dans une carte.
 * Il présente:
 * - Les informations de base (nom, email)
 * - Le rôle de l'utilisateur avec un badge coloré
 * - Des dates importantes (création, mise à jour)
 * - Des boutons d'action (supprimer, etc.)
 */

import React from 'react';
import { format } from 'date-fns';
import { User, Mail, Phone, Calendar, MapPin, Building2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Interface définissant la structure des données utilisateur
 * 
 * Contient les propriétés essentielles d'un utilisateur comme:
 * - Identifiant unique
 * - Informations personnelles (nom, prénom, email)
 * - Rôle dans le système
 * - Dates de création et mise à jour
 */
export interface UserData {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
  created_at?: string;
  updated_at?: string;
}

interface UserItemProps {
  user: UserData;
  onClick?: (user: UserData) => void;
  onDelete?: (id: number) => void;
  onActivate?: (id: number) => void;
  onDeactivate?: (id: number) => void;
  className?: string;
}

/**
 * Composant d'affichage d'un utilisateur
 * 
 * Affiche les détails d'un utilisateur dans une carte interactive.
 * Gère les interactions comme la suppression et la sélection.
 * Présente visuellement le rôle avec un badge coloré approprié.
 */
export const UserItem: React.FC<UserItemProps> = ({
  user,
  onClick,
  onDelete,
  onActivate,
  onDeactivate,
  className,
}) => {
  /**
   * Configuration des styles et libellés pour chaque rôle
   */
  const userRoles = {
    user: { label: 'Utilisateur', color: 'bg-blue-100 text-blue-700' },
    admin: { label: 'Admin', color: 'bg-amber-100 text-amber-700' },
    owner: { label: 'Propriétaire', color: 'bg-purple-100 text-purple-700' },
  };

  // Provide a fallback for roleInfo in case the role doesn't match any predefined roles
  const roleInfo = userRoles[user.role] || { 
    label: user.role || 'Inconnu', 
    color: 'bg-gray-100 text-gray-700' 
  };

  const handleClick = () => {
    if (onClick) {
      onClick(user);
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        "glass-card cursor-pointer hover:scale-[1.01]",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.prenom?.[0] || '?'}{user.nom?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="font-medium text-base line-clamp-1">{user.prenom} {user.nom}</h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("font-medium", roleInfo.color)}>
                  {roleInfo.label}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {user.created_at && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <span>Inscrit le {format(new Date(user.created_at), 'dd/MM/yyyy')}</span>
                </div>
              )}
              {user.updated_at && user.updated_at !== user.created_at && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <span>Mis à jour le {format(new Date(user.updated_at), 'dd/MM/yyyy')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline"
                className="mt-2 h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(user.user_id);
                }}
              >
                Supprimer
              </Button>
            )}
            
            <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
