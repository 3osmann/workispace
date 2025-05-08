import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Users, MessageSquare, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to properties
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/properties');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const features = [
    {
      title: 'Gestion des espaces professionnels',
      description: 'Ajoutez, modifiez et gérez vos bureaux et locaux professionnels.',
      icon: <Building2 className="h-12 w-12" />,
      color: 'bg-blue-50 text-blue-600',
      path: '/properties'
    },
    {
      title: 'Gestion des réservations',
      description: 'Suivez et approuvez les réservations, gérez les annulations.',
      icon: <Calendar className="h-12 w-12" />,
      color: 'bg-green-50 text-green-600',
      path: '/bookings'
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérez les utilisateurs, les permissions et les demandes des clients.',
      icon: <Users className="h-12 w-12" />,
      color: 'bg-purple-50 text-purple-600',
      path: '/users'
    },
    {
      title: 'Gestion des avis',
      description: 'Consultez et modérez les avis des clients.',
      icon: <MessageSquare className="h-12 w-12" />,
      color: 'bg-red-50 text-red-600',
      path: '/reviews'
    },
    {
      title: 'Paramètres',
      description: 'Configurez votre compte et les paramètres du système.',
      icon: <Settings className="h-12 w-12" />,
      color: 'bg-cyan-50 text-cyan-600',
      path: '/settings'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Bienvenue sur</span>
          <span className="block text-primary mt-1">DARIAPP Offices</span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
          Plateforme professionnelle de gestion d'espaces de travail et locaux commerciaux.
        </p>
        
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
              <CardHeader>
                <div className={cn(
                  "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
                  feature.color
                )}>
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(feature.path)}
                >
                  Explorer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12">
          <Button 
            size="lg" 
            className="text-base px-8 py-6"
            onClick={() => navigate('/properties')}
          >
            Voir les espaces professionnels
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
