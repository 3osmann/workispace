
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour rediriger l'utilisateur après la connexion
import { useAuth } from '@/context/AuthContext'; // Contexte d'authentification personnalisé
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast'; // Pour afficher des notifications
import { User, Lock, LogIn } from 'lucide-react'; // Icônes

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si l'utilisateur est déjà authentifié, on le redirige vers la page des propriétés
  useEffect(() => {
    if (isAuthenticated) {
      // Délai court pour permettre au contexte de terminer son initialisation
      setTimeout(() => {
        navigate('/properties');
      }, 100);
    }
  }, [isAuthenticated, navigate]);

  // Liste d'utilisateurs de test pour simuler différents rôles
  const testUsers = [
    { role: 'Admin', email: 'admin@example.com', password: 'password123', access: 'Accès complet' },
    { role: 'Utilisateur', email: 'user@example.com', password: 'password123', access: 'Mobile uniquement (Propriétés)' }
  ];

  // Fonction déclenchée lors de la soumission du formulaire de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true);
    setError('');

    try {
      console.log("Attempting login with:", { email, password }); // Debug log
      const success = await login(email, password); // Appel au contexte d'authentification
      if (success) {
        // Redirection avec délai pour permettre au contexte de se mettre à jour
        setTimeout(() => {
          navigate('/properties');
        }, 100);
      } else {
        setError('Email ou mot de passe incorrect'); // Message d'erreur si échec
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  // Connexion rapide avec des comptes de test
  const handleQuickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setIsLoading(true);

    try {
      const success = await login(testEmail, testPassword);
      if (success) {
        // Redirection avec délai pour permettre au contexte de se mettre à jour
        setTimeout(() => {
          navigate('/properties');
        }, 100);
      } else {
        setError('Échec de la connexion rapide');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      {/* Carte centrale de connexion */}
      <Card className="w-full max-w-md glass-card shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">DARIAPP</CardTitle>
          <CardDescription>Connectez-vous à votre compte</CardDescription>
        </CardHeader>

        {/* Composant d’onglets pour séparer formulaire et test utilisateurs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="test-users">Utilisateurs de test</TabsTrigger>
          </TabsList>

          {/* Formulaire de connexion */}
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Champ email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Champ mot de passe */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              {/* Bouton de soumission */}
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">Connexion...</span>
                      {/* Icône de chargement */}
                      <span className="animate-spin">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Connexion
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* Onglet pour les utilisateurs de test */}
          <TabsContent value="test-users">
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Utilisez ces comptes pour tester les différents rôles
                </p>

                <div className="grid gap-3">
                  {/* Liste de boutons de connexion rapide */}
                  {testUsers.map((user, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex justify-start items-center"
                      onClick={() => handleQuickLogin(user.email, user.password)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{user.role}</div>
                        <div className="text-xs text-muted-foreground">{user.access}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
