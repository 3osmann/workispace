
/**
 * PropertyDetails.tsx
 * 
 * Description (FR):
 * Page de détails d'une propriété, affichant toutes les informations
 * relatives à un espace de travail spécifique.
 * Cette page permet de visualiser les caractéristiques complètes d'une propriété
 * et offre des options pour la modifier ou la supprimer selon les permissions de l'utilisateur.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Building2, 
  Wifi, 
  ParkingCircle, 
  Coffee, 
  Users, 
  Monitor, 
  Check, 
  X,
  Briefcase,
  CalendarClock,
  UtensilsCrossed,
  Printer,
  BadgeCheck,
  Accessibility,
  ShieldCheck,
  Edit,
  Save,
  Flag,
  Globe
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { propertyApi, Property, PropertyUpdate } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Composant principal pour l'affichage des détails d'une propriété
 * Permet la visualisation, la modification et la suppression selon les droits utilisateur
 */
const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canDelete, user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PropertyUpdate>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // État pour éviter les multiples chargements

  /**
   * Fonction optimisée pour charger les détails de la propriété une seule fois
   */
  const fetchProperty = useCallback(async () => {
    if (!id || dataFetched) return;
    
    try {
      setLoading(true);
      console.log("Récupération de la propriété avec ID:", id);
      const propertyData = await propertyApi.getPropertyById(id);
      console.log("Propriété récupérée:", propertyData);
      setProperty(propertyData);
      setFormData({
        title: propertyData.title,
        address: propertyData.address,
        price: propertyData.price,
        description: propertyData.description || '',
        type: propertyData.type,
        status: propertyData.status,
        wifi: propertyData.wifi,
        parking: propertyData.parking,
        coffee: propertyData.coffee,
        reception: propertyData.reception,
        secured: propertyData.secured,
        accessible: propertyData.accessible,
        printers: propertyData.printers,
        kitchen: propertyData.kitchen,
        flexible_hours: propertyData.flexible_hours,
      });
      setDataFetched(true); // Marquer les données comme chargées
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la propriété:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la propriété",
        variant: "destructive",
      });
      // Ne pas naviguer immédiatement, afficher plutôt l'état d'erreur
      setProperty(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [id, toast, dataFetched]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    if (id && property?.image_url) {
      const img = new Image();
      img.src = property.image_url;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImgError(true);
    }
  }, [id, property]);

  /**
   * Fonction pour supprimer une propriété
   */
  const handleDelete = async () => {
    if (!id || !property || !canDelete('properties')) return;
    
    try {
      await propertyApi.deleteProperty(id);
      toast({
        title: "Propriété supprimée",
        description: "La propriété a été supprimée avec succès",
      });
      navigate('/properties');
    } catch (error) {
      console.error('Erreur lors de la suppression de la propriété:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la propriété",
        variant: "destructive",
      });
    }
  };

  /**
   * Gestion des changements dans le formulaire
   */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  /**
   * Gestion des changements dans les cases à cocher
   */
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  /**
   * Gestion du changement de fichier image
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  /**
   * Soumission du formulaire pour mettre à jour la propriété
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !property) return;

    try {
      setLoading(true);
      // S'assurer d'envoyer les données complètes du formulaire incluant tous les états des équipements
      const updatedProperty = await propertyApi.updateProperty(id, formData, imageFile || undefined);
      
      setProperty(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...formData,
          image_url: updatedProperty.image_url || prev.image_url
        } as Property;
      });
      
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Propriété mise à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la propriété:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la propriété",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Disponible' },
    booked: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Réservé' },
    maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Maintenance' }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/properties')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-10 w-64" />
          </div>
          
          <div className="relative overflow-hidden rounded-xl bg-background shadow-md border border-border/30">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] rounded-lg shadow-sm" />
            <Skeleton className="h-[300px] rounded-lg shadow-sm" />
            <Skeleton className="h-[300px] rounded-lg shadow-sm" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-16 bg-background rounded-lg shadow-sm border border-border/20 animate-fade-in">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h2 className="text-2xl font-bold mt-4">Propriété non trouvée</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">La propriété que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button className="mt-6" onClick={() => navigate('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Propriétés
          </Button>
        </div>
      </Layout>
    );
  }

  const statusStyle = statusColors[property.status as keyof typeof statusColors] || statusColors.available;
  const isOfficeProperty = property.property_type === 'office';
  const canEdit = user?.role === 'admin' || user?.role === 'owner';

  if (isEditing) {
    return (
      <Layout>
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-background p-4 rounded-lg shadow-sm border border-border/20">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => setIsEditing(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Modifier la propriété</h1>
                <p className="text-sm text-muted-foreground mt-1">Modifiez les détails de cette propriété</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>Modifiez les informations principales de la propriété</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title || ''} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address || ''} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix ( TND/jour)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      value={formData.price || ''} 
                      onChange={handleFormChange} 
                      required 
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input 
                      id="type" 
                      name="type" 
                      value={formData.type || ''} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <select 
                      id="status" 
                      name="status" 
                      value={formData.status || 'available'} 
                      onChange={handleFormChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="available">Disponible</option>
                      <option value="booked">Réservé</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description || ''} 
                    onChange={handleFormChange} 
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image (optionnel)</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  {property.image_url && !imageFile && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Image actuelle:</p>
                      <img 
                        src={property.image_url} 
                        alt={property.title} 
                        className="h-32 object-cover rounded-md" 
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {isOfficeProperty && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipements</CardTitle>
                  <CardDescription>Sélectionnez les équipements disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="wifi" 
                        checked={!!formData.wifi} 
                        onCheckedChange={(checked) => handleCheckboxChange('wifi', !!checked)} 
                      />
                      <Label htmlFor="wifi" className="cursor-pointer">WiFi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="parking" 
                        checked={!!formData.parking} 
                        onCheckedChange={(checked) => handleCheckboxChange('parking', !!checked)} 
                      />
                      <Label htmlFor="parking" className="cursor-pointer">Parking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="coffee" 
                        checked={!!formData.coffee} 
                        onCheckedChange={(checked) => handleCheckboxChange('coffee', !!checked)} 
                      />
                      <Label htmlFor="coffee" className="cursor-pointer">Machine à café</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="kitchen" 
                        checked={!!formData.kitchen} 
                        onCheckedChange={(checked) => handleCheckboxChange('kitchen', !!checked)} 
                      />
                      <Label htmlFor="kitchen" className="cursor-pointer">Cuisine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="printers" 
                        checked={!!formData.printers} 
                        onCheckedChange={(checked) => handleCheckboxChange('printers', !!checked)} 
                      />
                      <Label htmlFor="printers" className="cursor-pointer">Imprimantes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="secured" 
                        checked={!!formData.secured} 
                        onCheckedChange={(checked) => handleCheckboxChange('secured', !!checked)} 
                      />
                      <Label htmlFor="secured" className="cursor-pointer">Sécurisé</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reception" 
                        checked={!!formData.reception} 
                        onCheckedChange={(checked) => handleCheckboxChange('reception', !!checked)} 
                      />
                      <Label htmlFor="reception" className="cursor-pointer">Réception</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="accessible" 
                        checked={!!formData.accessible} 
                        onCheckedChange={(checked) => handleCheckboxChange('accessible', !!checked)} 
                      />
                      <Label htmlFor="accessible" className="cursor-pointer">Accessible PMR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="flexible_hours" 
                        checked={!!formData.flexible_hours} 
                        onCheckedChange={(checked) => handleCheckboxChange('flexible_hours', !!checked)} 
                      />
                      <Label htmlFor="flexible_hours" className="cursor-pointer">Accès 24h/24 et 7j/7</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex gap-2 items-center">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-background p-4 rounded-lg shadow-sm border border-border/20">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigate('/properties')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="text-sm md:text-base">{property.address}</span>
              </div>
              {/* Informations pays et région */}
              {(property.country || property.region) && (
                <div className="flex items-center mt-2 space-x-4">
                  {property.country && (
                    <div className="flex items-center text-muted-foreground">
                      <Flag className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{property.country}</span>
                    </div>
                  )}
                  {property.region && (
                    <div className="flex items-center text-muted-foreground">
                      <Globe className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{property.region}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 self-start md:self-auto">
            <Badge className={cn("px-3 py-1.5 rounded-md font-medium", statusStyle.bg, statusStyle.text)}>
              {statusStyle.label}
            </Badge>
            {canEdit && (
              <Button variant="outline" size="sm" className="h-9" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {canDelete('properties') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="h-9">
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette propriété?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement cette propriété
                      et toutes les données associées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-background shadow-md border border-border/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
          
          <AspectRatio ratio={16/9} className="bg-muted">
            {!imageLoaded && !imgError && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-xl" />
            )}
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Building2 className="h-16 w-16 text-muted-foreground/50" />
                <span className="ml-2 text-muted-foreground">Image non disponible</span>
              </div>
            ) : (
              <img
                src={property.image_url}
                alt={property.title}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}
          </AspectRatio>
          
          <div className="absolute bottom-4 right-4 z-20">
            <Badge className="px-3 py-2 text-lg font-semibold bg-primary/90 text-primary-foreground rounded-md shadow-lg">
              {property.price} TND <span className="text-sm font-normal opacity-90">/ jour</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Informations de Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="font-medium">{property.type}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prix</span>
                <span className="font-medium text-lg text-primary">{property.price} TND / jour</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Note</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Surface</span>
                <span className="font-medium">{property.area} m²</span>
              </div>
              <Separator />
              {isOfficeProperty ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Postes de travail</span>
                    <span className="font-medium">{property.workstations}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Salles de réunion</span>
                    <span className="font-medium">{property.meeting_rooms}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Chambres</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Salles de bain</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {isOfficeProperty && (
            <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-primary" />
                  Équipements
                </CardTitle>
                <CardDescription>Équipements disponibles pour cet espace</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  <div className="flex items-center">
                    {property.wifi ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Wifi className="h-4 w-4 mr-1.5" /> 
                          <span>WiFi</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Wifi className="h-4 w-4 mr-1.5" /> 
                          <span>WiFi</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.parking ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <ParkingCircle className="h-4 w-4 mr-1.5" /> 
                          <span>Parking</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <ParkingCircle className="h-4 w-4 mr-1.5" /> 
                          <span>Parking</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.coffee ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Coffee className="h-4 w-4 mr-1.5" /> 
                          <span>Machine à café</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Coffee className="h-4 w-4 mr-1.5" /> 
                          <span>Machine à café</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.kitchen ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <UtensilsCrossed className="h-4 w-4 mr-1.5" /> 
                          <span>Cuisine</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <UtensilsCrossed className="h-4 w-4 mr-1.5" /> 
                          <span>Cuisine</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.printers ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Printer className="h-4 w-4 mr-1.5" /> 
                          <span>Imprimantes</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Printer className="h-4 w-4 mr-1.5" /> 
                          <span>Imprimantes</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.secured ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1.5" /> 
                          <span>Sécurisé</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1.5" /> 
                          <span>Sécurisé</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.reception ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 mr-1.5" /> 
                          <span>Réception</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 mr-1.5" /> 
                          <span>Réception</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.accessible ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Accessibility className="h-4 w-4 mr-1.5" /> 
                          <span>Accessible PMR</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <Accessibility className="h-4 w-4 mr-1.5" /> 
                          <span>Accessible PMR</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {property.flexible_hours ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="rounded-full bg-green-100 p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1.5" /> 
                          <span>Accès 24h/24 et 7j/7</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-1">
                          <X className="h-4 w-4" />
                        </div>
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1.5" /> 
                          <span>Accès 24h/24 et 7j/7</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "Aucune description disponible pour cette propriété."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;

