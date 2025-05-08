/**
 * BookingItem.tsx
 * 
 * Description (FR):
 * Ce composant affiche les détails d'une réservation.
 * Il inclut:
 * - Les informations sur la propriété réservée
 * - Les détails du client
 * - Les dates d'arrivée et de départ
 * - Le montant total
 * - Le statut de la réservation avec code couleur
 * - Des boutons d'approbation/rejet pour les réservations en attente
 */

import React from 'react';
import { format } from 'date-fns';
import { 
  Building2, 
  User, 
  Calendar, 
  DollarSign,
  Clock, 
  Check, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface BookingData {
  id: string;
  propertyName: string;
  propertyImage: string;
  guestName: string;
  guestAvatar?: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'canceled' | 'completed';
  createdAt: Date;
}

interface BookingItemProps {
  booking: BookingData;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export const BookingItem: React.FC<BookingItemProps> = ({
  booking,
  onApprove,
  onReject,
  onClick,
  className,
}) => {
  const statusMap = {
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
    canceled: { label: 'Canceled', color: 'bg-red-100 text-red-700' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  };

  const nights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusInfo = statusMap[booking.status];

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        "glass-card cursor-pointer hover:scale-[1.01]",
        className
      )}
      onClick={() => onClick?.(booking.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img src={booking.propertyImage} alt={booking.propertyName} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-base line-clamp-1">
                  {booking.propertyName}
                </h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 mr-1" />
                  <span className="truncate">ID: {booking.id.substring(0, 8)}</span>
                </div>
              </div>
              
              <Badge className={cn("font-medium", statusInfo.color)}>
                {statusInfo.label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <div className="flex items-center text-sm">
                <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <div className="flex items-center">
                  <Avatar className="w-5 h-5 mr-1.5">
                    <AvatarImage src={booking.guestAvatar} alt={booking.guestName} />
                    <AvatarFallback className="text-[10px]">
                      {booking.guestName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{booking.guestName}</span>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <span>${booking.totalAmount} ({nights} nights)</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <span>{format(booking.checkIn, 'MMM d')} - {format(booking.checkOut, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <span>Booked {format(booking.createdAt, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            {booking.status === 'pending' && (
              <>
                {onApprove && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(booking.id);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {onReject && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(booking.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            {booking.status !== 'pending' && (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
