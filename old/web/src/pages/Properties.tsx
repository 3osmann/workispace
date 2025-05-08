/**
 * Properties.tsx
 * 
 * Description (FR):
 * Page principale de gestion des bureaux et espaces professionnels.
 * Cette page permet de visualiser, filtrer et gérer l'ensemble des locaux
 * professionnels avec différentes vues (grille et tableau) et options de filtrage.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  SlidersHorizontal,
  Table as TableIcon,
  Loader2,
  X,
  Image as ImageIcon,
  Flag,
  MapPin,
  Globe
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { OfficePropertyCard, OfficePropertyData } from '@/components/OfficePropertyCard';
import { OfficePropertyTable } from '@/components/OfficePropertyTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { propertyApi, PropertyCreate, Property } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PropertyModal from '@/components/PropertyModal';
import { Textarea } from '@/components/ui/textarea';
import { countries, getRegionsByCountryId } from '@/data/locationData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

/**
 * Composant principal de la page des espaces professionnels
 */
const Properties = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { toast } = useToast();
  const { user, canDelete } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<OfficePropertyData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  
  // Nouveaux états pour les filtres pays/région
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [availableFilterRegions, setAvailableFilterRegions] = useState<{id: string, name: string}[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const isMounted = useRef(true);
  const hasLoadedData = useRef(false);
  
  const [selectedCountry, setSelectedCountry] = useState<string>('fr');
  const [availableRegions, setAvailableRegions] = useState(getRegionsByCountryId('fr'));
  
  const [newProperty, setNewProperty] = useState<Partial<PropertyCreate>>({
    title: '',
    address: '',
    price: 0,
    type: 'bureau_prive',
    workstations: 1,
    meeting_rooms: 0,
    area: 0,
    rating: 4.0,
    status: 'available',
    property_type: 'office',
    description: '',
    wifi: false,
    parking: false,
    coffee: false,
    reception: false,
    secured: false,
    accessible: false,
    printers: false,
    kitchen: false,
    flexible_hours: false,
    country: 'fr',
    region: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedPropertyId(id);
      setIsPropertyModalOpen(true);
    } else {
      setIsPropertyModalOpen(false);
      setSelectedPropertyId(null);
    }
  }, [id]);

  // Add effect to update available regions when country changes
  useEffect(() => {
    setAvailableRegions(getRegionsByCountryId(selectedCountry));
    // Reset region when country changes
    if (newProperty.country !== selectedCountry) {
      setNewProperty(prev => ({
        ...prev,
        country: selectedCountry,
        region: ''
      }));
    }
  }, [selectedCountry]);
  
  // Add effect to update filter regions when filter country changes
  useEffect(() => {
    if (filterCountry && filterCountry !== 'all') {
      setAvailableFilterRegions(getRegionsByCountryId(filterCountry));
      // Reset region filter when country filter changes
      setFilterRegion('all');
    } else {
      setAvailableFilterRegions([]);
    }
  }, [filterCountry]);

  const fetchProperties = useCallback(async () => {
    if (!isMounted.current || (loading && hasLoadedData.current)) {
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching properties...");
      const apiProperties = await propertyApi.getAllProperties();
      
      if (isMounted.current) {
        if (Array.isArray(apiProperties)) {
          const officeProperties = apiProperties
            .filter(prop => prop.property_type === 'office')
            .map(prop => propertyApi.mapApiPropertyToOfficePropertyData(prop));
          
          setProperties(officeProperties);
          hasLoadedData.current = true;
        } else {
          console.error('API did not return an array of properties:', apiProperties);
          setProperties([]);
          toast({
            title: 'Erreur de format',
            description: 'Le format des données reçues est incorrect',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les propriétés',
          variant: 'destructive',
        });
        setProperties([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [toast, loading]);

  useEffect(() => {
    if (!hasLoadedData.current) {
      fetchProperties();
    }
  }, [fetchProperties]);

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsPropertyModalOpen(true);
    navigate(`/properties/${propertyId}`, { replace: true });
  };

  const handleClosePropertyModal = () => {
    setIsPropertyModalOpen(false);
    setSelectedPropertyId(null);
    navigate('/properties', { replace: true });
    
    if (hasLoadedData.current) {
      hasLoadedData.current = false;
      fetchProperties();
    }
  };

  // Mise à jour du filtrage pour inclure pays et région
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesCountry = filterCountry === 'all' || property.country === filterCountry;
    const matchesRegion = filterRegion === 'all' || property.region === filterRegion;
    
    return matchesSearch && matchesStatus && matchesCountry && matchesRegion;
  });
  
  // Reset des filtres
  const resetFilters = () => {
    setFilterStatus('all');
    setFilterCountry('all');
    setFilterRegion('all');
    setSearchQuery('');
  };

  const handleDeleteProperty = async (id: string) => {
    if (!canDelete('properties')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour supprimer des propriétés.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await propertyApi.deleteProperty(id);
      
      setProperties(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Supprimer l'espace",
        description: `L'espace ID: ${id} a été supprimé.`,
      });
      
      hasLoadedData.current = false;
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'espace ID: ${id}`,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    setNewProperty({
      title: '',
      address: '',
      price: 0,
      type: 'bureau_prive',
      workstations: 1,
      meeting_rooms: 0,
      area: 0,
      rating: 4.0,
      status: 'available',
      property_type: 'office',
      description: '',
      wifi: false,
      parking: false,
      coffee: false,
      reception: false,
      secured: false,
      accessible: false,
      printers: false,
      kitchen: false,
      flexible_hours: false,
      country: 'fr',
      region: ''
    });
    setSelectedCountry('fr');
    setAvailableRegions(getRegionsByCountryId('fr'));
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateNumericFields = () => {
    const errors: string[] = [];
    
    if (newProperty.price && (isNaN(Number(newProperty.price)) || Number(newProperty.price) < 0)) {
      errors.push("Le prix doit être un nombre positif");
    }
    
    if (newProperty.workstations && (isNaN(Number(newProperty.workstations)) || !Number.isInteger(Number(newProperty.workstations)) || Number(newProperty.workstations) < 0)) {
      errors.push("Le nombre de postes de travail doit être un entier positif");
    }
    
    if (newProperty.meeting_rooms !== undefined && (isNaN(Number(newProperty.meeting_rooms)) || !Number.isInteger(Number(newProperty.meeting_rooms)) || Number(newProperty.meeting_rooms) < 0)) {
      errors.push("Le nombre de salles de réunion doit être un entier positif");
    }
    
    if (newProperty.area && (isNaN(Number(newProperty.area)) || Number(newProperty.area) < 0)) {
      errors.push("La surface doit être un nombre positif");
    }
    
    if (newProperty.rating && (isNaN(Number(newProperty.rating)) || Number(newProperty.rating) < 0 || Number(newProperty.rating) > 5)) {
      errors.push("La note doit être un nombre entre 0 et 5");
    }
    
    return errors;
  };

  const handleAddProperty = async () => {
    if (!newProperty.title || !newProperty.address || !selectedFile) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires et ajouter une image.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newProperty.country || !newProperty.region) {
      toast({
        title: "Localisation incomplète",
        description: "Veuillez sélectionner un pays et une région.",
        variant: "destructive",
      });
      return;
    }
    
    const validationErrors = validateNumericFields();
    if (validationErrors.length > 0) {
      toast({
        title: "Erreurs de validation",
        description: validationErrors.join('. '),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const propertyData: PropertyCreate = {
        title: newProperty.title || '',
        address: newProperty.address || '',
        price: Number(newProperty.price) || 0,
        type: newProperty.type || 'bureau_prive',
        workstations: Number(newProperty.workstations) || 0,
        meeting_rooms: Number(newProperty.meeting_rooms) || 0,
        area: Number(newProperty.area) || 0,
        rating: Number(newProperty.rating) || 4.0,
        status: newProperty.status as 'available' | 'booked' | 'maintenance' || 'available',
        property_type: 'office',
        description: newProperty.description || '',
        wifi: Boolean(newProperty.wifi),
        parking: Boolean(newProperty.parking),
        coffee: Boolean(newProperty.coffee),
        reception: Boolean(newProperty.reception),
        secured: Boolean(newProperty.secured),
        accessible: Boolean(newProperty.accessible),
        printers: Boolean(newProperty.printers),
        kitchen: Boolean(newProperty.kitchen),
        flexible_hours: Boolean(newProperty.flexible_hours),
        country: newProperty.country || 'fr',
        region: newProperty.region || ''
      };
      
      console.log("Submitting property with data:", propertyData);
      
      const response = await propertyApi.createProperty(propertyData, selectedFile);
      
      hasLoadedData.current = false;
      fetchProperties();
      
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: "Espace Professionnel Ajouté",
        description: "Le nouvel espace a été ajouté avec succès.",
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'espace. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const isOwner = user?.role === 'owner';

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Espaces Professionnels</h1>
            <p className="text-muted-foreground mt-1">Gérez vos bureaux et locaux commerciaux</p>
          </div>
          
          {isOwner && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un Espace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouvel Espace Professionnel</DialogTitle>
                  <DialogDescription>
                    Entrez les détails de votre nouvel espace de travail.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium">Nom de l'Espace *</Label>
                    <Input 
                      id="title" 
                      placeholder="Entrez le nom de l'espace" 
                      value={newProperty.title || ''}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  {/* Country and Region selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="country" className="text-sm font-medium">Pays *</Label>
                      <Select 
                        value={selectedCountry} 
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem 
                              key={country.id} 
                              value={country.id}
                              leftIcon={<Flag className="h-4 w-4" />}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region" className="text-sm font-medium">Région *</Label>
                      <Select 
                        value={newProperty.region || ''} 
                        onValueChange={(value) => setNewProperty(prev => ({ ...prev, region: value }))}
                        disabled={availableRegions.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une région" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRegions.map(region => (
                            <SelectItem 
                              key={region.id} 
                              value={region.id}
                              leftIcon={<MapPin className="h-4 w-4" />}
                            >
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type" className="text-sm font-medium">Type d'Espace *</Label>
                      <Select 
                        value={newProperty.type} 
                        onValueChange={(value) => setNewProperty(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bureau_prive">Bureau privé</SelectItem>
                          <SelectItem value="coworking">Espace coworking</SelectItem>
                          <SelectItem value="salle_reunion">Salle de réunion</SelectItem>
                          <SelectItem value="local_commercial">Local commercial</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price" className="text-sm font-medium">Prix par Jour (TND) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="0" 
                        value={newProperty.price || ''}
                        min="0"
                        step="0.01"
                        onChange={(e) => setNewProperty(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="text-sm font-medium">Adresse *</Label>
                    <Input 
                      id="address" 
                      placeholder="Entrez l'adresse de l'espace" 
                      value={newProperty.address || ''}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="workstations" className="text-sm font-medium">Postes de travail</Label>
                      <Input 
                        id="workstations" 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        step="1"
                        value={newProperty.workstations === undefined ? '' : newProperty.workstations}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          workstations: e.target.value === '' ? undefined : parseInt(e.target.value) 
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meetingRooms" className="text-sm font-medium">Salles de Réunion</Label>
                      <Input 
                        id="meetingRooms" 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        step="1"
                        value={newProperty.meeting_rooms === undefined ? '' : newProperty.meeting_rooms}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          meeting_rooms: e.target.value === '' ? undefined : parseInt(e.target.value) 
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="area" className="text-sm font-medium">Surface (m²)</Label>
                      <Input 
                        id="area" 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        step="0.01"
                        value={newProperty.area || ''}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, area: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="rating" className="text-sm font-medium">Note (0-5)</Label>
                    <Input 
                      id="rating" 
                      type="number" 
                      placeholder="4.0" 
                      min="0" 
                      max="5" 
                      step="0.1"
                      value={newProperty.rating || ''}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Équipements</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="wifi" 
                          checked={newProperty.wifi || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, wifi: checked === true }))
                          }
                        />
                        <label htmlFor="wifi" className="text-sm">WiFi</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="parking" 
                          checked={newProperty.parking || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, parking: checked === true }))
                          }
                        />
                        <label htmlFor="parking" className="text-sm">Parking</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="coffee" 
                          checked={newProperty.coffee || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, coffee: checked === true }))
                          }
                        />
                        <label htmlFor="coffee" className="text-sm">Machine à café</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="secured" 
                          checked={newProperty.secured || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, secured: checked === true }))
                          }
                        />
                        <label htmlFor="secured" className="text-sm">Accès sécurisé</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="flexible_hours" 
                          checked={newProperty.flexible_hours || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, flexible_hours: checked === true }))
                          }
                        />
                        <label htmlFor="flexible_hours" className="text-sm">Horaires 24/7</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="reception" 
                          checked={newProperty.reception || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, reception: checked === true }))
                          }
                        />
                        <label htmlFor="reception" className="text-sm">Réception</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="accessible" 
                          checked={newProperty.accessible || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, accessible: checked === true }))
                          }
                        />
                        <label htmlFor="accessible" className="text-sm">Accès PMR</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="printers" 
                          checked={newProperty.printers || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, printers: checked === true }))
                          }
                        />
                        <label htmlFor="printers" className="text-sm">Imprimantes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="kitchen" 
                          checked={newProperty.kitchen || false}
                          onCheckedChange={(checked) => 
                            setNewProperty(prev => ({ ...prev, kitchen: checked === true }))
                          }
                        />
                        <label htmlFor="kitchen" className="text-sm">Cuisine</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Décrivez votre espace..." 
                      value={newProperty.description || ''}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="image" className="text-sm font-medium">Image *</Label>
                    <div className="flex flex-col gap-4">
                      <Input 
                        id="image" 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        required
                        className="cursor-pointer"
                      />
                      
                      {previewUrl ? (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={previewUrl} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 w-6 h-6 rounded-full"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-40 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              L'aperçu de l'image apparaîtra ici
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleAddProperty}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des espaces professionnels..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Statut filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="booked">Réservé</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Popover pour les filtres pays/région */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className={filterCountry !== 'all' || filterRegion !== 'all' ? "bg-primary/20" : ""}>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtres avancés</h4>
                  <div className="space-y-2">
                    <Label htmlFor="filterCountry">Pays</Label>
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                      <SelectTrigger id="filterCountry" className="w-full">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les pays</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id}>
                            <div className="flex items-center">
                              <Flag className="h-4 w-4 mr-2" />
                              {country.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filterRegion">Région</Label>
                    <Select 
                      value={filterRegion} 
                      onValueChange={setFilterRegion}
                      disabled={filterCountry === 'all' || availableFilterRegions.length === 0}
                    >
                      <SelectTrigger id="filterRegion" className="w-full">
                        <SelectValue placeholder="Sélectionner une région" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les régions</SelectItem>
                        {availableFilterRegions.map(region => (
                          <SelectItem key={region.id} value={region.id}>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              {region.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Réinitialiser
                    </Button>
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      Appliquer
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Tabs defaultValue={viewMode} className="w-auto h-9">
              <TabsList>
                <TabsTrigger 
                  value="grid" 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger 
                  value="table" 
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Affichage des filtres actifs */}
        {(filterStatus !== 'all' || filterCountry !== 'all' || filterRegion !== 'all') && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            
            {filterStatus !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Statut: {filterStatus === 'available' ? 'Disponible' : filterStatus === 'booked' ? 'Réservé' : 'Maintenance'}
                <button onClick={() => setFilterStatus('all')} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterCountry !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Pays: {countries.find(c => c.id === filterCountry)?.name || filterCountry}
                <button onClick={() => setFilterCountry('all')} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filterRegion !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Région: {availableFilterRegions.find(r => r.id === filterRegion)?.name || filterRegion}
                <button onClick={() => setFilterRegion('all')} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
              Effacer tous les filtres
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des espaces professionnels...</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
            <Building2 className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-medium">Aucun espace professionnel trouvé</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez.
            </p>
            {isOwner && (
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Votre Premier Espace
              </Button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <OfficePropertyCard 
                    key={property.id} 
                    property={property}
                    onDelete={canDelete('properties') ? handleDeleteProperty : undefined}
                    showActions={canDelete('properties')}
                    onClick={() => handlePropertyClick(property.id)}
                  />
                ))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="flex flex-col space-y-6">
                {filteredProperties.map((property) => (
                  <OfficePropertyCard 
                    key={property.id} 
                    property={property}
                    onDelete={canDelete('properties') ? handleDeleteProperty : undefined}
                    className="flex flex-row h-auto max-h-64"
                    showActions={canDelete('properties')}
                    onClick={() => handlePropertyClick(property.id)}
                  />
                ))}
              </div>
            )}
            
            {viewMode === 'table' && (
              <OfficePropertyTable
                properties={filteredProperties}
                onDelete={canDelete('properties') ? handleDeleteProperty : undefined}
                showActions={canDelete('properties')}
                onPropertyClick={handlePropertyClick}
              />
            )}
          </>
        )}

        <PropertyModal 
          isOpen={isPropertyModalOpen}
          onClose={handleClosePropertyModal}
          propertyId={selectedPropertyId}
        />
      </div>
    </Layout>
  );
};

export default Properties;
