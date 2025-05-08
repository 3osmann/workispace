
/**
 * utils.ts
 * 
 * Description (FR):
 * Ce fichier contient des fonctions utilitaires réutilisables dans l'application.
 * La fonction principale cn() combine les classes CSS conditionnelles
 * en utilisant clsx et tailwind-merge pour une gestion efficace des styles.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Fonction utilitaire pour fusionner des classes CSS
 * 
 * Cette fonction permet de:
 * - Combiner plusieurs classes CSS avec une gestion conditionnelle
 * - Résoudre automatiquement les conflits de classes Tailwind
 * - Simplifier l'application de styles conditionnels dans les composants
 * 
 * @param inputs - Liste de classes CSS ou d'objets conditionnels
 * @returns Une chaîne de classes CSS fusionnées et nettoyées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
