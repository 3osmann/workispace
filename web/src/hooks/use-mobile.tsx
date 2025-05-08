
/**
 * use-mobile.tsx
 * 
 * Description (FR):
 * Ce hook personnalisé permet de détecter si l'appareil est un mobile
 * en fonction de la largeur de l'écran. Il utilise un point de rupture
 * défini à 768px et réagit aux changements de taille de la fenêtre.
 */

import * as React from "react"

/**
 * Point de rupture en pixels pour considérer un appareil comme mobile
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook personnalisé pour détecter si l'appareil est un mobile
 * 
 * Ce hook:
 * - Surveille les changements de taille de la fenêtre
 * - Compare la largeur actuelle avec le point de rupture défini
 * - Retourne un booléen indiquant si l'appareil est considéré comme mobile
 * - Nettoie les écouteurs d'événements lors du démontage du composant
 * 
 * @returns {boolean} Vrai si l'appareil est considéré comme mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
