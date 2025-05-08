
/**
 * StatCard.tsx
 * 
 * Description (FR):
 * Ce composant affiche une statistique importante sous forme de carte.
 * Il présente:
 * - Un titre descriptif
 * - Une valeur principale mise en évidence
 * - Une icône représentative
 * - Un indicateur optionnel de changement (augmentation/diminution)
 * - Des effets visuels au survol
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Interface définissant les propriétés d'une carte statistique
 * 
 * Spécifie:
 * - Titre explicatif de la statistique
 * - Valeur numérique ou textuelle à afficher
 * - Icône illustrative
 * - Données optionnelles de variation (pourcentage d'évolution)
 * - Classes CSS supplémentaires pour personnalisation
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

/**
 * Composant de carte statistique
 * 
 * Affiche une statistique importante de manière visuellement attrayante.
 * Inclut des effets d'interaction (survol, animation) pour améliorer l'expérience utilisateur.
 * Utilise un code couleur pour indiquer les tendances positives/négatives.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
      "glass-card",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
              {change && (
                <span 
                  className={cn(
                    "text-xs font-medium",
                    change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {change.type === 'increase' ? '+' : ''}{change.value}%
                </span>
              )}
            </div>
          </div>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
