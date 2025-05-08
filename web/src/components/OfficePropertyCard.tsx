
/**
 * OfficePropertyCard.tsx
 * 
 * Description (FR):
 * Ce composant affiche une propriété de type bureau sous forme de carte.
 * Il est spécialisé pour les espaces professionnels avec des caractéristiques
 * spécifiques comme les postes de travail, internet, salles de réunion, etc.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Coffee, 
  Users, 
  ParkingCircle, 
  Briefcase,
  Monitor,
  CalendarClock,
  Heart,
  BadgeCheck,
  Accessibility,
  ShieldCheck,
  UtensilsCrossed,
  Printer,
  Trash,
  Square,
  ArrowRight,
  Flag,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { countries, getRegionsByCountryId } from '@/data/locationData';

/**
 * Interface décrivant les données d'une propriété de type bureau
 */
export interface OfficePropertyData {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  workstations: number;
  meetingRooms: number;
  area: number;
  rating: number;
  status: 'available' | 'booked' | 'maintenance';
  imageUrl: string;
  description?: string;
  amenities: {
    wifi: boolean;
    parking: boolean;
    coffee: boolean;
    reception: boolean;
    secured: boolean;
    accessible: boolean;
    printers: boolean;
    kitchen: boolean;
  };
  flexibleHours: boolean;
  country?: string; // Pays de la propriété
  region?: string; // Région de la propriété
}

/**
 * Interface pour les propriétés du composant OfficePropertyCard
 */
interface OfficePropertyCardProps {
  /**
   * Données de la propriété de bureau à afficher
   */
  property: OfficePropertyData;
  
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
 * Composant carte pour les propriétés de type bureau
 * 
 * Affiche les informations spécifiques aux espaces de travail:
 * - Nombre de postes de travail
 * - Salles de réunion
 * - Équipements disponibles (WiFi, parking, café, etc.)
 * - Horaires flexibles
 */
export const OfficePropertyCard: React.FC<OfficePropertyCardProps> = ({
  property,
  onDelete,
  className,
  showActions = true,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Configuration des styles de couleur pour les différents statuts
  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Disponible' },
    booked: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Réservé' },
    maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Maintenance' }
  };

  const statusStyle = statusColors[property.status];
  
  // Fonction pour récupérer le nom du pays et de la région
  const getLocationInfo = () => {
    const country = countries.find(c => c.id === property.country)?.name || property.country;
    
    if (property.country && property.region) {
      const regions = getRegionsByCountryId(property.country);
      const region = regions.find(r => r.id === property.region)?.name || property.region;
      return `${region}, ${country}`;
    }
    
    return country || '';
  };
  
  // Fonction pour gérer le clic sur la carte
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si le clic n'est pas sur un bouton, déclencher le callback onClick
    if (!(e.target as HTMLElement).closest('button')) {
      // Empêcher la navigation par défaut
      e.stopPropagation();
      console.log("Card clicked for property:", property.id);
      
      if (onClick) {
        onClick();
      } else {
        // Naviguer vers la page de détails de la propriété
        console.log("Navigating to:", `/properties/${property.id}`);
        navigate(`/properties/${property.id}`);
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(property.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                // Gestion de l'action favori
              }}
            >
              <Heart size={18} />
            </Button>
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
            
            {/* Ajout de la localisation (pays/région) */}
            {(property.country || property.region) && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{getLocationInfo()}</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-4 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center text-sm">
                <Monitor className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{property.workstations} Postes</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{property.meetingRooms} Salle{property.meetingRooms > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {property.amenities.wifi && (
                <Badge variant="outline" className="bg-slate-50 text-xs px-2 py-0.5">
                  <Wifi className="w-3 h-3 mr-1" /> WiFi
                </Badge>
              )}
              {property.amenities.parking && (
                <Badge variant="outline" className="bg-slate-50 text-xs px-2 py-0.5">
                  <ParkingCircle className="w-3 h-3 mr-1" /> Parking
                </Badge>
              )}
              {property.amenities.coffee && (
                <Badge variant="outline" className="bg-slate-50 text-xs px-2 py-0.5">
                  <Coffee className="w-3 h-3 mr-1" /> Café
                </Badge>
              )}
              {property.flexibleHours && (
                <Badge variant="outline" className="bg-slate-50 text-xs px-2 py-0.5">
                  <CalendarClock className="w-3 h-3 mr-1" /> 24/7
                </Badge>
              )}
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
                    e.preventDefault();
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'espace "{property.title}"? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
