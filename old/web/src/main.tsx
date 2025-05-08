
/**
 * main.tsx
 * 
 * Description (FR):
 * Point d'entrée principal de l'application React.
 * Ce fichier initialise le rendu de l'application dans le DOM
 * en montant le composant App sur l'élément racine.
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Initialisation de l'application React
 * 
 * Cette section:
 * - Identifie l'élément DOM qui servira de point de montage
 * - Crée une racine React sur cet élément
 * - Rend le composant App dans cette racine
 * 
 * L'opérateur '!' assure à TypeScript que l'élément root existe.
 */
createRoot(document.getElementById("root")!).render(<App />);
