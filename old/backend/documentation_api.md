
# Documentation API DARIAPP

Cette documentation décrit toutes les API disponibles dans l'application DARIAPP.

## API Utilisateurs (Users API)

### 1. Récupérer tous les utilisateurs
- **URL**: `/api/users`
- **Méthode**: `GET`
- **Description**: Récupère la liste complète de tous les utilisateurs enregistrés dans le système.
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users
  - Réponse: Liste de tous les utilisateurs avec leurs informations principales

### 2. Récupérer un utilisateur spécifique
- **URL**: `/api/users/:id`
- **Méthode**: `GET`
- **Description**: Récupère les informations détaillées d'un utilisateur en particulier à partir de son identifiant unique.
- **Paramètres**:
  - id: identifiant numérique de l'utilisateur à récupérer
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users/1
  - Réponse: Informations détaillées de l'utilisateur avec l'id 1

### 3. Inscription d'un utilisateur
- **URL**: `/api/users/register`
- **Méthode**: `POST`
- **Description**: Permet de créer un nouvel utilisateur dans le système avec ses informations personnelles et ses identifiants de connexion.
- **Corps de la requête**:
  ```json
  {
    "nom": "issam",
    "prenom": "khabbouchi",
    "email": "issamkhabbouchi@gmail.com",
    "password": "123456",
    "role": "user"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/register
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus
  - Réponse: Confirmation de création de l'utilisateur avec son identifiant

### 4. Connexion d'un utilisateur
- **URL**: `/api/users/login`
- **Méthode**: `POST`
- **Description**: Authentifie un utilisateur en vérifiant ses identifiants et crée une session pour lui.
- **Corps de la requête**:
  ```json
  {
    "email": "khabouchi.issam@mail.ru",
    "password": "123456"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/login
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus
  - Réponse: Informations de l'utilisateur connecté et les données de session

### 5. Déconnexion d'un utilisateur
- **URL**: `/api/users/logout`
- **Méthode**: `POST`
- **Description**: Déconnecte l'utilisateur actuellement connecté en détruisant sa session active.
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/users/logout
  - Réponse: Confirmation de déconnexion réussie

### 6. Récupérer l'utilisateur connecté
- **URL**: `/api/users/me`
- **Méthode**: `GET`
- **Description**: Récupère les informations de l'utilisateur actuellement connecté à partir de sa session.
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/users/me
  - Réponse: Informations détaillées de l'utilisateur actuellement connecté

### 7. Modifier un utilisateur
- **URL**: `/api/users/:id`
- **Méthode**: `PUT`
- **Description**: Permet de mettre à jour les informations d'un utilisateur existant dans le système.
- **Paramètres**:
  - id: identifiant numérique de l'utilisateur à modifier
- **Corps de la requête** (tous les champs sont optionnels):
  ```json
  {
    "nom": "Ameni issaoui",
    "prenom": "Nouveau Prénom",
    "email": "ameni.issaoui@gmail.com",
    "password": "123456",
    "role": "admin"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: PUT
  - URL: http://localhost:3000/api/users/1
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus (ou une partie des champs à modifier)
  - Réponse: Confirmation de mise à jour réussie

### 8. Supprimer un utilisateur
- **URL**: `/api/users/:id`
- **Méthode**: `DELETE`
- **Description**: Supprime définitivement un utilisateur et toutes ses données associées du système.
- **Paramètres**:
  - id: identifiant numérique de l'utilisateur à supprimer
- **Exemple avec Postman**:
  - Méthode: DELETE
  - URL: http://localhost:3000/api/users/1
  - Réponse: Confirmation de suppression réussie

## API Lieux (Places API)

### 1. Récupérer tous les lieux
- **URL**: `/api/places`
- **Méthode**: `GET`
- **Description**: Récupère la liste complète de tous les lieux enregistrés dans le système.
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/places
  - Réponse: Liste de tous les lieux avec leurs informations détaillées

### 2. Récupérer un lieu spécifique
- **URL**: `/api/places/:id`
- **Méthode**: `GET`
- **Description**: Récupère les informations détaillées d'un lieu particulier à partir de son identifiant unique.
- **Paramètres**:
  - id: identifiant numérique du lieu à récupérer
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/places/1
  - Réponse: Informations détaillées du lieu avec l'id 1

### 3. Créer un nouveau lieu
- **URL**: `/api/places`
- **Méthode**: `POST`
- **Description**: Permet de créer un nouveau lieu dans le système (nécessite des droits d'administrateur).
- **Corps de la requête**:
  ```json
  {
    "nom_place": "Tour Eiffel",
    "description": "Monument emblématique de Paris",
    "location": "Paris, France",
    "longitude": 2.2945,
    "latitude": 48.8584,
    "url_img": "https://example.com/images/tour-eiffel.jpg",
    "url_web": "https://www.toureiffel.paris/fr"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/places
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus
  - Headers: Ajouter un header d'authentification si nécessaire
  - Réponse: Confirmation de création du lieu avec son identifiant

### 4. Modifier un lieu
- **URL**: `/api/places/:id`
- **Méthode**: `PUT`
- **Description**: Permet de mettre à jour les informations d'un lieu existant dans le système (nécessite des droits d'administrateur).
- **Paramètres**:
  - id: identifiant numérique du lieu à modifier
- **Corps de la requête**:
  ```json
  {
    "nom_place": "Tour Eiffel (mise à jour)",
    "description": "Nouvelle description du monument",
    "location": "Paris, France",
    "longitude": 2.2945,
    "latitude": 48.8584,
    "url_img": "https://example.com/images/tour-eiffel-new.jpg",
    "url_web": "https://www.toureiffel.paris/fr"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: PUT
  - URL: http://localhost:3000/api/places/1
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus (ou une partie des champs à modifier)
  - Headers: Ajouter un header d'authentification si nécessaire
  - Réponse: Confirmation de mise à jour réussie

### 5. Supprimer un lieu
- **URL**: `/api/places/:id`
- **Méthode**: `DELETE`
- **Description**: Supprime définitivement un lieu et toutes ses données associées du système (nécessite des droits d'administrateur).
- **Paramètres**:
  - id: identifiant numérique du lieu à supprimer
- **Exemple avec Postman**:
  - Méthode: DELETE
  - URL: http://localhost:3000/api/places/1
  - Headers: Ajouter un header d'authentification si nécessaire
  - Réponse: Confirmation de suppression réussie

## API Propriétés (Properties API)

### 1. Récupérer toutes les propriétés
- **URL**: `/api/properties`
- **Méthode**: `GET`
- **Description**: Récupère la liste complète de toutes les propriétés enregistrées dans le système.
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/properties
  - Réponse: Liste de toutes les propriétés avec leurs informations détaillées

### 2. Récupérer une propriété spécifique
- **URL**: `/api/properties/:id`
- **Méthode**: `GET`
- **Description**: Récupère les informations détaillées d'une propriété particulière à partir de son identifiant unique.
- **Paramètres**:
  - id: identifiant alphanumérique de la propriété à récupérer
- **Exemple avec Postman**:
  - Méthode: GET
  - URL: http://localhost:3000/api/properties/prop1
  - Réponse: Informations détaillées de la propriété avec l'id spécifié

### 3. Créer une nouvelle propriété
- **URL**: `/api/properties`
- **Méthode**: `POST`
- **Description**: Permet de créer une nouvelle propriété dans le système (nécessite une authentification).
- **Corps de la requête** pour une propriété résidentielle:
  ```json
  {
    "title": "Villa Moderne",
    "address": "123 Rue de la Plage, Nice",
    "country": "France",
    "region": "Provence-Alpes-Côte d'Azur",
    "price": 280,
    "type": "Villa",
    "bedrooms": 3,
    "bathrooms": 2.5,
    "area": 2200,
    "rating": 4.8,
    "image_url": "https://example.com/images/villa.jpg",
    "property_type": "residential"
  }
  ```
- **Corps de la requête** pour un espace de bureau:
  ```json
  {
    "title": "Espace de Coworking Premium",
    "address": "56 Avenue des Affaires, Paris",
    "country": "France",
    "region": "Île-de-France",
    "price": 45,
    "type": "Coworking",
    "workstations": 15,
    "meeting_rooms": 2,
    "area": 1200,
    "rating": 4.7,
    "image_url": "https://example.com/images/coworking.jpg",
    "property_type": "office",
    "wifi": true,
    "parking": true,
    "coffee": true,
    "reception": true,
    "secured": true,
    "accessible": true,
    "printers": true,
    "kitchen": true,
    "flexible_hours": true
  }
  ```
- **Exemple avec Postman**:
  - Méthode: POST
  - URL: http://localhost:3000/api/properties
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus selon le type de propriété
  - Headers: Assurez-vous d'être connecté (session active)
  - Réponse: Confirmation de création de la propriété avec son identifiant

### 4. Modifier une propriété
- **URL**: `/api/properties/:id`
- **Méthode**: `PUT`
- **Description**: Permet de mettre à jour les informations d'une propriété existante dans le système (nécessite une authentification).
- **Paramètres**:
  - id: identifiant alphanumérique de la propriété à modifier
- **Corps de la requête** (tous les champs sont optionnels):
  ```json
  {
    "title": "Villa Moderne (Mise à jour)",
    "country": "France",
    "region": "Normandie",
    "price": 300,
    "status": "maintenance"
  }
  ```
- **Exemple avec Postman**:
  - Méthode: PUT
  - URL: http://localhost:3000/api/properties/prop1
  - Body: raw (JSON)
  - Contenu: Copier le JSON ci-dessus avec les champs à modifier
  - Headers: Assurez-vous d'être connecté (session active)
  - Réponse: Confirmation de mise à jour réussie

### 5. Supprimer une propriété
- **URL**: `/api/properties/:id`
- **Méthode**: `DELETE`
- **Description**: Supprime définitivement une propriété et toutes ses données associées du système (nécessite des droits d'administrateur).
- **Paramètres**:
  - id: identifiant alphanumérique de la propriété à supprimer
- **Exemple avec Postman**:
  - Méthode: DELETE
  - URL: http://localhost:3000/api/properties/prop1
  - Headers: Assurez-vous d'être connecté avec un compte administrateur
  - Réponse: Confirmation de suppression réussie
