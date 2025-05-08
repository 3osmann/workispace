
/**
 * use-toast.ts
 * 
 * Description (FR):
 * Ce hook personnalisé fournit une interface simplifiée pour afficher
 * des notifications toast dans l'application. Il encapsule la librairie
 * de toasts sous-jacente pour faciliter son utilisation et sa cohérence.
 */

import { toast as sonnerToast } from "sonner";

/**
 * Hook personnalisé pour l'affichage des notifications toast
 * 
 * Fournit une interface unifiée pour afficher différents types de notifications
 * et maintient la cohérence visuelle dans toute l'application.
 * 
 * @returns Objet contenant la fonction toast et la liste des toasts actifs
 */
export const useToast = () => {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (props.variant === "destructive") {
        sonnerToast.error(props.title, {
          description: props.description,
        });
      } else {
        sonnerToast(props.title, {
          description: props.description,
        });
      }
    },
    toasts: [], // Pour compatibilité avec le code existant
  };
};

/**
 * Fonction autonome pour afficher des notifications toast
 * 
 * Permet d'afficher des notifications sans utiliser le hook,
 * utile dans les contextes où les hooks ne sont pas disponibles.
 * 
 * @param props Configuration du toast (titre, description, variant)
 */
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  if (props.variant === "destructive") {
    sonnerToast.error(props.title, {
      description: props.description,
    });
  } else {
    sonnerToast(props.title, {
      description: props.description,
    });
  }
};
