
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, Code, FileJson, Search } from 'lucide-react';

const Documentation = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Guide complet de l'utilisation de la plateforme de gestion immobilière
          </p>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="guide" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Guide Utilisateur
            </TabsTrigger>
            <TabsTrigger value="api" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>
          
          {/* Guide Utilisateur */}
          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide de Démarrage Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bienvenue dans le guide utilisateur de notre plateforme de gestion immobilière. 
                  Cette documentation vous aidera à naviguer et à utiliser efficacement toutes les 
                  fonctionnalités disponibles.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Premiers Pas</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>
                    <strong>Créer un compte</strong> - Commencez par vous inscrire avec votre email professionnel
                  </li>
                  <li>
                    <strong>Ajouter votre première propriété</strong> - Utilisez le bouton "Ajouter une Propriété" 
                    dans le tableau de bord
                  </li>
                  <li>
                    <strong>Configurer votre profil</strong> - Personnalisez votre profil dans les paramètres du compte
                  </li>
                </ol>
                
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-4">
                  <h4 className="font-medium mb-2">💡 Astuce</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez la barre de recherche dans la section Propriétés pour trouver rapidement 
                    ce que vous cherchez.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Propriétés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-medium">Ajouter une Propriété</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur le bouton "Ajouter une Propriété" sur la page Propriétés et remplissez 
                    le formulaire avec les détails de votre bien.
                  </p>
                  
                  <h3 className="font-medium mt-4">Modifier une Propriété</h3>
                  <p className="text-sm text-muted-foreground">
                    Accédez à la page de détails d'une propriété et cliquez sur "Modifier".
                  </p>
                  
                  <h3 className="font-medium mt-4">Afficher les Statistiques</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez les performances de vos propriétés dans le tableau de bord principal.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Réservations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-medium">Consulter les Réservations</h3>
                  <p className="text-sm text-muted-foreground">
                    Accédez à la page "Réservations" pour voir toutes les réservations en cours et à venir.
                  </p>
                  
                  <h3 className="font-medium mt-4">Approuver une Réservation</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur "Approuver" dans le menu d'actions d'une réservation en attente.
                  </p>
                  
                  <h3 className="font-medium mt-4">Annuler une Réservation</h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez "Annuler" dans le menu d'actions et confirmez l'annulation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* API Documentation */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Notre API RESTful vous permet d'intégrer la plateforme à vos propres systèmes. Voici comment commencer:
                </p>
                
                <h3 className="text-lg font-semibold mt-6">Authentification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Toutes les requêtes API nécessitent un token JWT valide dans l'en-tête d'autorisation.
                </p>
                
                <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-x-auto mb-6">
                  <pre className="text-sm">
                    <code>
                      {`// Exemple d'authentification
fetch('https://api.example.com/properties', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})`}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mt-6">Endpoints Disponibles</h3>
                <div className="space-y-4 mt-4">
                  <div className="border border-border rounded-md">
                    <div className="bg-muted p-3 border-b border-border flex items-center">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium mr-2">GET</span>
                      <code className="text-sm">/api/properties</code>
                    </div>
                    <div className="p-3">
                      <p className="text-sm">Récupère la liste de toutes les propriétés</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Paramètres: page, limit, status
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md">
                    <div className="bg-muted p-3 border-b border-border flex items-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium mr-2">POST</span>
                      <code className="text-sm">/api/properties</code>
                    </div>
                    <div className="p-3">
                      <p className="text-sm">Crée une nouvelle propriété</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Corps: title, address, price, type, bedrooms, bathrooms, area
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md">
                    <div className="bg-muted p-3 border-b border-border flex items-center">
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium mr-2">PUT</span>
                      <code className="text-sm">/api/properties/:id</code>
                    </div>
                    <div className="p-3">
                      <p className="text-sm">Met à jour une propriété existante</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Paramètres: id
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Exemples de Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">JavaScript (Fetch)</h3>
                    <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        <code>
{`// Récupérer toutes les propriétés
async function getProperties() {
  const response = await fetch('https://api.example.com/properties', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });
  const data = await response.json();
  return data;
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Python (Requests)</h3>
                    <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        <code>
{`import requests

# Ajouter une nouvelle propriété
def add_property(property_data, token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.post('https://api.example.com/properties', 
                           json=property_data,
                           headers=headers)
    return response.json()`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquemment Posées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">Comment créer un compte?</h3>
                    <p className="text-muted-foreground mt-2">
                      Cliquez sur "S'inscrire" sur la page de connexion et remplissez le formulaire avec vos informations. 
                      Un email de confirmation sera envoyé à l'adresse fournie.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg">Comment ajouter une propriété?</h3>
                    <p className="text-muted-foreground mt-2">
                      Après connexion, accédez à la page "Propriétés" et cliquez sur le bouton 
                      "Ajouter une Propriété". Remplissez tous les champs requis et soumettez le formulaire.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg">Comment modifier mes informations personnelles?</h3>
                    <p className="text-muted-foreground mt-2">
                      Allez dans "Paramètres" via le menu principal, puis sélectionnez "Profil". 
                      Vous pourrez y modifier vos informations et sauvegarder les changements.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg">Comment générer des rapports?</h3>
                    <p className="text-muted-foreground mt-2">
                      Dans le tableau de bord, cliquez sur "Rapports" puis sélectionnez le type de rapport 
                      que vous souhaitez générer. Vous pouvez choisir la période et exporter au format PDF ou Excel.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg">Comment contacter le support technique?</h3>
                    <p className="text-muted-foreground mt-2">
                      Vous pouvez contacter notre équipe de support via l'option "Support" dans le menu principal 
                      ou par email à support@example.com. Notre temps de réponse moyen est de 24h.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dépannage Courant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h3 className="font-medium mb-2">Je ne peux pas me connecter</h3>
                    <p className="text-sm text-muted-foreground">
                      Vérifiez que votre email et mot de passe sont corrects. Si vous avez oublié 
                      votre mot de passe, utilisez l'option "Mot de passe oublié" sur la page de connexion.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h3 className="font-medium mb-2">Les images ne se chargent pas</h3>
                    <p className="text-sm text-muted-foreground">
                      Assurez-vous que les URL des images sont correctes et accessibles. Les formats 
                      supportés sont JPG, PNG et WebP avec une taille maximale de 5 MB.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h3 className="font-medium mb-2">Je ne vois pas mes propriétés</h3>
                    <p className="text-sm text-muted-foreground">
                      Vérifiez les filtres actifs sur la page des propriétés. Si le problème persiste, 
                      essayez de vous déconnecter puis de vous reconnecter.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h3 className="font-medium mb-2">L'application est lente</h3>
                    <p className="text-sm text-muted-foreground">
                      Essayez de vider le cache de votre navigateur ou d'utiliser un navigateur différent. 
                      Chrome, Firefox et Safari sont recommandés pour des performances optimales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>
        {`
          pre code {
            font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
          }
        `}
      </style>
    </Layout>
  );
};

export default Documentation;
