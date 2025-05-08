import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { UserItem, UserData } from '@/components/UserItem';
import { UserModifyModal } from '@/components/UserModifyModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserForm } from '@/components/UserForm';
import { userApi, ApiError } from '@/services/api';

const Users = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [usersData, setUsersData] = useState<UserData[]>([]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const users = await userApi.getAllUsers();
      setUsersData(users);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = 
      `${user.prenom} ${user.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.user_id).includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setIsModifyModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userApi.deleteUser(id);
      setUsersData(prevUsers => prevUsers.filter(user => user.user_id !== id));
      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur ID: ${id} a été supprimé.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres d'utilisateurs ont été réinitialisés.",
    });
  };

  const handleAddUser = async (userData: Partial<UserData> & { password?: string }) => {
  try {
    if (!userData.password) {
      throw new Error("Le mot de passe est requis");
    }
    
    const response = await userApi.register({
      nom: userData.nom || '',
      prenom: userData.prenom || '',
      email: userData.email || '',
      password: userData.password,
      role: userData.role || 'user'
    });
    
    fetchUsers(); // Refresh the list after adding
    
    toast({
      title: "Utilisateur ajouté",
      description: `Nouvel utilisateur ${userData.prenom} ${userData.nom} ajouté avec succès.`,
    });
    setIsFormOpen(false);
  } catch (error) {
    console.error("Error adding user:", error);
    
    if (error instanceof ApiError) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de l'utilisateur",
        variant: "destructive",
      });
    } else if (error instanceof Error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de l'utilisateur",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'utilisateur",
        variant: "destructive",
      });
    }
  }
};

  const handleUpdateUser = async (updatedUserData: Partial<UserData> & { password?: string }) => {
    if (!updatedUserData.user_id) return;
    
    try {
      await userApi.updateUser(updatedUserData.user_id, {
        nom: updatedUserData.nom,
        prenom: updatedUserData.prenom,
        email: updatedUserData.email,
        password: updatedUserData.password,
        role: updatedUserData.role
      });
      
      // Refresh the data
      fetchUsers();
      
      toast({
        title: "Utilisateur modifié",
        description: `Les informations de ${updatedUserData.prenom} ${updatedUserData.nom} ont été mises à jour.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Gérer les utilisateurs et invités</p>
          </div>
          <div>
            <Button onClick={() => setIsFormOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des utilisateurs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="user">Utilisateurs</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetFilters}
              className="hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchUsers}
              className="hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-muted/20 rounded-lg">
            <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Erreur</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchUsers}>
              Réessayer
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-lg">
            <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Aucun utilisateur trouvé</h3>
            <p className="text-muted-foreground">
              Essayez d'ajuster votre recherche ou vos filtres.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <UserItem 
                key={user.user_id} 
                user={user}
                onClick={handleUserClick}
                onDelete={handleDeleteUser}
              />
            ))}

            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Affichage de {filteredUsers.length} sur {usersData.length} utilisateurs
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur
            </DialogDescription>
          </DialogHeader>
          <UserForm onSubmit={handleAddUser} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <UserModifyModal
        user={selectedUser}
        open={isModifyModalOpen}
        onOpenChange={setIsModifyModalOpen}
        onSubmit={handleUpdateUser}
      />
    </Layout>
  );
};

export default Users;
