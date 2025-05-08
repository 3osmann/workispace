
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier package.json
const packageJsonPath = path.resolve(__dirname, 'package.json');

try {
  // Lire le fichier package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Vérifier si la commande build:dev existe déjà
  if (!packageJson.scripts['build:dev']) {
    // Ajouter la commande build:dev
    packageJson.scripts['build:dev'] = 'vite build --mode development';
    console.log('✅ Commande build:dev ajoutée avec succès');
    
    // Écrire les modifications dans le fichier
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Fichier package.json mis à jour avec succès');
  } else {
    console.log('ℹ️ La commande build:dev existe déjà');
  }
  
  console.log('📋 Scripts disponibles:');
  Object.entries(packageJson.scripts).forEach(([name, command]) => {
    console.log(`  - ${name}: ${command}`);
  });
} catch (error) {
  console.error('❌ Erreur lors de la mise à jour du fichier package.json:', error);
}
