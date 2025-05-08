
/**
 * UserForm.tsx
 * 
 * Description (FR):
 * Ce composant fournit un formulaire pour créer ou modifier un utilisateur.
 * Il utilise:
 * - React Hook Form pour la gestion du formulaire
 * - Zod pour la validation des données
 * - Les composants UI de formulaire pour l'interface
 * Il gère deux modes: création et modification d'utilisateur.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserData } from './UserItem';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }).optional(),
  role: z.enum(['admin', 'user', 'owner'], { 
    message: 'Veuillez sélectionner un rôle valide' 
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (data: Partial<UserData> & { password?: string }) => void;
  onCancel: () => void;
  initialData?: Partial<UserData>;
  isEditMode?: boolean;
}

/**
 * Composant de formulaire d'utilisateur
 * 
 * Ce formulaire permet l'ajout ou la modification des informations utilisateur.
 * Il adapte son comportement selon le mode (création ou édition).
 * La validation des champs est assurée par Zod et React Hook Form.
 */
export const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditMode = false
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(
      isEditMode 
        ? formSchema.partial({ password: true }) 
        : formSchema
    ),
    defaultValues: {
      nom: initialData?.nom || '',
      prenom: initialData?.prenom || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || 'user',
    },
  });

  /**
   * Gère la soumission du formulaire
   * Supprime le mot de passe vide lors des mises à jour
   */
  const handleSubmit = (values: FormValues) => {
    // Remove empty password for updates
    const userData = { ...values };
    if (isEditMode && !userData.password) {
      delete userData.password;
    }
    
    onSubmit({
      ...userData,
      user_id: initialData?.user_id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="owner">Propriétaire</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditMode ? 'Mettre à jour' : 'Ajouter'} l'utilisateur
          </Button>
        </div>
      </form>
    </Form>
  );
};
