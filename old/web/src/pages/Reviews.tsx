/**
 * Reviews.tsx
 * 
 * Description (FR):
 * Cette page affiche et gère les avis des utilisateurs sur les propriétés.
 * Elle permet:
 * - Visualiser tous les avis reçus
 * - Filtrer les avis par statut (publiés, en attente, rejetés)
 * - Rechercher des avis par nom de propriété ou utilisateur
 * - Répondre aux avis des clients
 * - Gérer le workflow d'approbation des avis
 */

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Star, Search, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  response?: string;
}

const Reviews = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  const reviewsData: Review[] = [
    {
      id: 'rev1',
      propertyId: 'prop1',
      propertyName: 'Villa de Luxe en Bord de Mer',
      userId: 'user1',
      userName: 'Sophie Martin',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: "Séjour incroyable! La vue sur l'océan était à couper le souffle et la villa était parfaitement entretenue.",
      date: '2023-06-15',
      status: 'published',
      response: "Merci beaucoup pour votre commentaire chaleureux!"
    },
    {
      id: 'rev2',
      propertyId: 'prop2',
      propertyName: 'Appartement Moderne au Centre-Ville',
      userId: 'user2',
      userName: 'Thomas Dubois',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      comment: "Emplacement parfait, au cœur de la ville avec toutes les commodités à proximité.",
      date: '2023-07-02',
      status: 'published'
    },
    {
      id: 'rev3',
      propertyId: 'prop3',
      propertyName: 'Chalet Cosy en Montagne',
      userId: 'user3',
      userName: 'Émilie Leroy',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      comment: "Ce chalet est un véritable havre de paix! Parfait pour une escapade en famille.",
      date: '2023-01-20',
      status: 'published',
      response: "Merci Émilie pour ce beau commentaire!"
    },
    {
      id: 'rev4',
      propertyId: 'prop4',
      propertyName: 'Loft Urbain Stylé',
      userId: 'user4',
      userName: 'Nicolas Petit',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      rating: 2,
      comment: "Déçu de mon séjour. Les photos sont trompeuses, l'appartement est beaucoup plus petit qu'il n'y paraît.",
      date: '2023-05-10',
      status: 'pending'
    }
  ];

  const filteredReviews = reviewsData.filter(review => {
    const matchesSearch = review.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentTab === 'all' || 
                      (currentTab === 'responded' && review.response) || 
                      (currentTab === 'unresponded' && !review.response) ||
                      (currentTab === 'pending' && review.status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  const handleApprove = (id: string) => {
    toast({
      title: "Avis approuvé",
      description: `L'avis a été publié.`,
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Avis rejeté",
      description: `L'avis a été rejeté.`,
      variant: "destructive",
    });
  };

  const handleRespond = (id: string) => {
    toast({
      title: "Réponse envoyée",
      description: `Votre réponse a été publiée.`,
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Avis</h1>
          <p className="text-muted-foreground mt-1">Gérez les avis de vos clients</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="responded">Répondus</TabsTrigger>
            <TabsTrigger value="unresponded">Non répondus</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-medium">Aucun avis trouvé</h3>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{review.userName}</h3>
                            <div className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <Badge 
                            variant={
                              review.status === 'published' ? 'default' : 
                              review.status === 'pending' ? 'outline' : 
                              'destructive'
                            }
                          >
                            {review.status === 'published' ? 'Publié' : 
                             review.status === 'pending' ? 'En attente' : 
                             'Rejeté'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {review.propertyName}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      
                      {review.response && (
                        <div className="mt-3 pl-3 border-l-2 border-primary/30">
                          <p className="text-sm text-muted-foreground">{review.response}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2">
                      {review.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(review.id)}
                          >
                            Approuver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(review.id)}
                          >
                            Rejeter
                          </Button>
                        </div>
                      )}
                      {review.status === 'published' && !review.response && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRespond(review.id)}
                        >
                          Répondre
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reviews;
