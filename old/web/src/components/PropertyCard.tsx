
/**
 * PropertyCard.tsx
 * 
 * Description (FR):
 * Ce composant affiche une propriété résidentielle sous forme de carte.
 * Il est spécialisé pour les espaces résidentiels avec des caractéristiques
 * spécifiques comme les chambres, salles de bain, etc.
 * Conçu pour être réutilisable dans toute l'application.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Bath, 
  BedDouble, 
  SquareIcon, 
  Trash,
  Globe,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Interface décrivant les données d'une propriété résidentielle
 */
export interface PropertyData {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
  status: 'available' | 'booked' | 'maintenance';
  imageUrl: string;
  country?: string;
  region?: string;
}

/**
 * Interface pour les propriétés du composant PropertyCard
 */
interface PropertyCardProps {
  /**
   * Données de la propriété à afficher
   */
  property: PropertyData;
  
  /**
   * Fonction de rappel pour gérer la suppression
   * @param id Identifiant de la propriété
   */
  onDelete?: (id: string) => void;
  
  /**
   * Classes CSS supplémentaires à appliquer au composant
   */
  className?: string;
  
  /**
   * Détermine si les actions (suppression) sont affichées
   */
  showActions?: boolean;

  /**
   * Fonction de rappel pour gérer le clic sur la carte
   */
  onClick?: () => void;
}

/**
 * Composant carte pour les propriétés résidentielles
 * 
 * Affiche les informations spécifiques aux espaces résidentiels:
 * - Nombre de chambres
 * - Salles de bain
 * - Surface habitable
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onDelete,
  className,
  showActions = true,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  // Configuration des styles de couleur pour les différents statuts
  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Disponible' },
    booked: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Réservé' },
    maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Maintenance' }
  };

  const statusStyle = statusColors[property.status];
  
  // Fonction pour gérer le clic sur la carte
  const handleCardClick = (e: React.MouseEvent) => {
    // Si le clic n'est pas sur un bouton, déclencher la navigation
    if (!(e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        // Naviguer vers la page de détails de la propriété
        navigate(`/properties/${property.id}`);
      }
    }
  };

  return (
    <div className="block w-full h-full">
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer h-full",
          "glass-card border border-border/50 flex flex-col",
          isHovering ? "scale-[1.02]" : "",
          className
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden w-full aspect-[4/3]">
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-t-lg" />
          )}
          <img
            src={property.imageUrl}
            alt={property.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovering ? "scale-110" : ""
            )}
            style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
            <Badge className={cn("font-medium", statusStyle.bg, statusStyle.text)}>
              {statusStyle.label}
            </Badge>
            <Badge variant="secondary" className="glass-card">
              {property.price} TND/jour
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2 space-y-2 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>
          {/* Affichage du pays et de la région */}
          {(property.country || property.region) && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {property.country && (
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.country}</span>
                </div>
              )}
              {property.region && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.region}</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-2">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex items-center text-sm">
              <BedDouble className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{property.bedrooms} Ch.</span>
            </div>
            <div className="flex items-center text-sm">
              <Bath className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{property.bathrooms} SdB</span>
            </div>
            <div className="flex items-center text-sm">
              <SquareIcon className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </CardContent>
        
        {showActions && onDelete && (
          <CardFooter className="p-4 pt-2 flex justify-between mt-auto">
            <Badge variant="outline" className="font-normal text-xs">
              {property.type}
            </Badge>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property.id);
                }}
              >
                <Trash className="h-3.5 w-3.5 mr-1" />
                Supprimer
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
