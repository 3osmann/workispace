
# API DARIAPP

API backend pour l'application DARIAPP, gestion d'utilisateurs, de lieux et de propriétés.

## Installation

1. Cloner le repository
2. Installer les dépendances
   ```
   npm install
   ```
3. Configurer les variables d'environnement dans le fichier `.env`
4. Initialiser la base de données
   ```
   node database/init.js
   ```
5. Lancer le serveur
   ```
   npm run dev
   ```

## Tests avec Postman

### Propriétés API

#### 1. Récupérer toutes les propriétés
- **Méthode**: GET
- **URL**: http://localhost:3000/api/properties
- **Description**: Cette requête renvoie toutes les propriétés dans la base de données
- **Exemple de réponse**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "prop1",
        "title": "Villa de Luxe Front de Mer",
        "description": "Magnifique villa avec vue imprenable sur la mer. Parfaite pour des vacances de luxe en famille.",
        "address": "123 Ocean Drive, Miami, FL",
        "price": "350.00",
        "type": "Villa",
        "bedrooms": 4,
        "bathrooms": "3.0",
        "area": "2800.00",
        "rating": "4.9",
        "status": "available",
        "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "property_type": "residential",
        "created_at": "2025-04-13T09:45:23.000Z",
        "updated_at": "2025-04-13T09:45:23.000Z"
      },
      // ... autres propriétés
    ]
  }
  ```

#### 2. Récupérer une propriété spécifique
- **Méthode**: GET
- **URL**: http://localhost:3000/api/properties/prop1
- **Description**: Cette requête renvoie les détails d'une propriété spécifique avec l'ID "prop1"
- **Exemple de réponse**:
  ```json
  {
    "success": true,
    "data": {
      "id": "prop1",
      "title": "Villa de Luxe Front de Mer",
      "description": "Magnifique villa avec vue imprenable sur la mer. Parfaite pour des vacances de luxe en famille.",
      "address": "123 Ocean Drive, Miami, FL",
      "price": "350.00",
      "type": "Villa",
      "bedrooms": 4,
      "bathrooms": "3.0",
      "area": "2800.00",
      "rating": "4.9",
      "status": "available",
      "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "property_type": "residential",
      "created_at": "2025-04-13T09:45:23.000Z",
      "updated_at": "2025-04-13T09:45:23.000Z"
    }
  }
  ```

#### 3. Créer une nouvelle propriété
- **Méthode**: POST
- **URL**: http://localhost:3000/api/properties
- **Headers**: 
  - Content-Type: application/json
- **Body** (pour une propriété résidentielle):
  ```json
  {
    "title": "Maison de Campagne",
    "description": "Charmante maison de campagne entourée de vignobles, idéale pour se détendre et profiter de la nature.",
    "address": "45 Chemin des Vignes, Bordeaux",
    "price": 220,
    "type": "Maison",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 1800,
    "rating": 4.6,
    "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "property_type": "residential"
  }
  ```
- **Body** (pour une propriété de bureau):
  ```json
  {
    "title": "Espace Coworking Créatif",
    "description": "Espace de coworking moderne et dynamique, conçu pour stimuler la créativité et favoriser les échanges professionnels.",
    "address": "78 Rue de l'Innovation, Lyon",
    "price": 35,
    "type": "Coworking",
    "workstations": 12,
    "meeting_rooms": 2,
    "area": 950,
    "rating": 4.5,
    "image_url": "https://images.unsplash.com/photo-1497215842964-222b430dc094",
    "property_type": "office",
    "wifi": true,
    "parking": true,
    "coffee": true,
    "reception": false,
    "secured": true,
    "accessible": true,
    "printers": true,
    "kitchen": true,
    "flexible_hours": true
  }
  ```
- **Avec l'upload d'image**:
  - **URL**: http://localhost:3000/api/properties
  - **Headers**: Aucun header Content-Type (sera défini automatiquement par le form-data)
  - **Body** (form-data):
    - title: "Villa avec Piscine"
    - description: "Magnifique villa avec piscine privée et jardin luxuriant, parfaite pour des vacances de rêve en famille ou entre amis."
    - address: "123 Palm Avenue, Miami"
    - price: 450
    - type: "Villa"
    - bedrooms: 5
    - bathrooms: 4
    - area: 3200
    - rating: 4.8
    - property_type: "residential"
    - image: [FICHIER IMAGE]
  
- **Notes**: Vous devez être connecté pour créer une propriété (utiliser l'endpoint login d'abord)
- **Exemple de réponse**:
  ```json
  {
    "success": true,
    "message": "Propriété créée avec succès",
    "data": {
      "id": "prop_1681465982345"
    }
  }
  ```

#### 4. Mettre à jour une propriété
- **Méthode**: PUT
- **URL**: http://localhost:3000/api/properties/prop1
- **Headers**: 
  - Content-Type: application/json
- **Body** (seuls les champs à modifier):
  ```json
  {
    "price": 380,
    "description": "Villa de luxe rénovée avec vue panoramique sur l'océan et accès direct à la plage privée.",
    "status": "maintenance",
    "bedrooms": 5
  }
  ```
- **Avec l'upload d'image**:
  - **URL**: http://localhost:3000/api/properties/prop1
  - **Headers**: Aucun header Content-Type (sera défini automatiquement par le form-data)
  - **Body** (form-data):
    - price: 380
    - description: "Villa de luxe rénovée avec vue panoramique sur l'océan et accès direct à la plage privée."
    - status: maintenance
    - bedrooms: 5
    - image: [FICHIER IMAGE]
  
- **Notes**: Vous devez être connecté pour modifier une propriété
- **Exemple de réponse**:
  ```json
  {
    "success": true,
    "message": "Propriété mise à jour avec succès"
  }
  ```

#### 5. Supprimer une propriété
- **Méthode**: DELETE
- **URL**: http://localhost:3000/api/properties/prop3
- **Notes**: Vous devez être connecté en tant qu'administrateur pour supprimer une propriété
- **Exemple de réponse**:
  ```json
  {
    "success": true,
    "message": "Propriété supprimée avec succès"
  }
  ```

### Authentification (prérequis pour certaines opérations)

#### 1. Se connecter en tant qu'administrateur
- **Méthode**: POST
- **URL**: http://localhost:3000/api/users/login
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Notes**: Cette connexion est nécessaire pour supprimer des propriétés

#### 2. Se connecter en tant qu'Locataire
- **Méthode**: POST
- **URL**: http://localhost:3000/api/users/login
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Notes**: Cette connexion est suffisante pour créer/modifier des propriétés

