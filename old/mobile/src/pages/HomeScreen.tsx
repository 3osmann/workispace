
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star, Search, Filter, Wifi, Car, Building, Briefcase, X, ChevronsUpDown, Coffee, Printer, Wheelchair, Clock, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Property } from '../types';

/**
 * Villes populaires pour les bureaux professionnels
 * Popular cities for professional offices
 */
const FEATURED_LOCATIONS = [
  {
    id: '1',
    name: 'Paris',
    properties: 184,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    id: '2',
    name: 'Lyon',
    properties: 96,
    image: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&q=80',
  },
  {
    id: '3',
    name: 'Marseille',
    properties: 78,
    image: 'https://images.unsplash.com/photo-1589786742483-644a74b8b6de?w=800&q=80',
  },
];

/**
 * Fonction pour afficher les icônes d'équipement appropriées
 * Function to display the appropriate equipment icons
 */
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'Wifi haut débit':
      return <Wifi size={16} color="#666" />;
    case 'Parking sécurisé':
      return <Car size={16} color="#666" />;
    case 'Salles de réunion':
      return <Building size={16} color="#666" />;
    case 'Cuisine équipée':
      return <Coffee size={16} color="#666" />;
    case 'Café/Thé':
      return <Coffee size={16} color="#666" />;
    case 'Imprimantes':
      return <Printer size={16} color="#666" />;
    case 'Accessible':
      return <Wheelchair size={16} color="#666" />;
    case 'Horaires flexibles':
      return <Clock size={16} color="#666" />;
    default:
      return <Building size={16} color="#666" />;
  }
};

// Options de filtre pour les bureaux
const filterOptions = {
  types: [
    { id: 'bureau_prive', label: 'Bureau privé' },
    { id: 'espace_partage', label: 'Espace partagé' },
    { id: 'salle_reunion', label: 'Salle de réunion' },
  ],
  amenities: [
    { id: 'wifi', label: 'Wifi haut débit' },
    { id: 'parking', label: 'Parking' },
    { id: 'kitchen', label: 'Cuisine' },
    { id: 'coffee', label: 'Café/Thé' },
    { id: 'reception', label: 'Réception' },
    { id: 'secured', label: 'Sécurisé' },
    { id: 'accessible', label: 'Accessible' },
    { id: 'printers', label: 'Imprimantes' },
    { id: 'flexible_hours', label: 'Horaires flexibles' },
  ],
  priceRanges: [
    { id: 'range1', label: 'Moins de 100€', min: 0, max: 100 },
    { id: 'range2', label: '100€ - 300€', min: 100, max: 300 },
    { id: 'range3', label: '300€ - 500€', min: 300, max: 500 },
    { id: 'range4', label: '500€ - 1000€', min: 500, max: 1000 },
    { id: 'range5', label: 'Plus de 1000€', min: 1000, max: 10000 },
  ]
};

/**
 * Écran d'accueil pour utilisateurs standard
 * Home screen for standard users
 */
export default function HomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // États pour les filtres
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTypes, selectedAmenities, selectedPriceRange, properties]);

  /**
   * Récupère les propriétés depuis l'API
   * Fetch properties from the API
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using the server IP address
      const response = await fetch('http://192.168.1.7:3000/api/properties');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.data) {
        setProperties(result.data);
        setFilteredProperties(result.data);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des propriétés:', err);
      setError('Impossible de charger les propriétés. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Appliquer les filtres sur les propriétés
   * Apply filters to properties
   */
  const applyFilters = () => {
    let results = [...properties];
    
    // Filtre de recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(property => 
        property.title?.toLowerCase().includes(term) || 
        property.address?.toLowerCase().includes(term) ||
        property.city?.toLowerCase().includes(term) ||
        property.region?.toLowerCase().includes(term)
      );
    }
    
    // Filtre par type
    if (selectedTypes.length > 0) {
      results = results.filter(property => 
        selectedTypes.some(type => property.property_type === type || property.type === type)
      );
    }
    
    // Filtre par équipements
    if (selectedAmenities.length > 0) {
      results = results.filter(property => {
        return selectedAmenities.every(amenity => {
          switch(amenity) {
            case 'wifi': return property.wifi === 1 || property.wifi === true;
            case 'parking': return property.parking === 1 || property.parking === true;
            case 'kitchen': return property.kitchen === 1 || property.kitchen === true;
            case 'coffee': return property.coffee === 1 || property.coffee === true;
            case 'reception': return property.reception === 1 || property.reception === true;
            case 'secured': return property.secured === 1 || property.secured === true;
            case 'accessible': return property.accessible === 1 || property.accessible === true;
            case 'printers': return property.printers === 1 || property.printers === true;
            case 'flexible_hours': return property.flexible_hours === 1 || property.flexible_hours === true;
            default: return false;
          }
        });
      });
    }
    
    // Filtre par plage de prix
    if (selectedPriceRange) {
      const range = filterOptions.priceRanges.find(r => r.id === selectedPriceRange);
      if (range) {
        results = results.filter(property => {
          const price = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
          return price >= range.min && price <= range.max;
        });
      }
    }
    
    setFilteredProperties(results);
    setFiltersApplied(
      selectedTypes.length > 0 || 
      selectedAmenities.length > 0 || 
      selectedPriceRange !== null
    );
  };

  /**
   * Réinitialiser tous les filtres
   * Reset all filters
   */
  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedPriceRange(null);
    setFiltersApplied(false);
  };

  /**
   * Basculer une sélection dans un tableau
   * Toggle a selection in an array
   */
  const toggleSelection = (array: string[], item: string): string[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item) 
      : [...array, item];
  };

  /**
   * Récupère les équipements d'une propriété
   * Get amenities from property data
   */
  const getPropertyAmenities = (property: Property): string[] => {
    const amenities: string[] = [];
    
    if (property.wifi === 1 || property.wifi === true) amenities.push('Wifi haut débit');
    if (property.parking === 1 || property.parking === true) amenities.push('Parking sécurisé');
    if (property.meeting_rooms && property.meeting_rooms > 0) amenities.push('Salles de réunion');
    if (property.kitchen === 1 || property.kitchen === true) amenities.push('Cuisine équipée');
    if (property.coffee === 1 || property.coffee === true) amenities.push('Café/Thé');
    if (property.reception === 1 || property.reception === true) amenities.push('Réception');
    if (property.secured === 1 || property.secured === true) amenities.push('Sécurisé');
    if (property.printers === 1 || property.printers === true) amenities.push('Imprimantes');
    if (property.flexible_hours === 1 || property.flexible_hours === true) amenities.push('Horaires flexibles');
    if (property.accessible === 1 || property.accessible === true) amenities.push('Accessible');
    
    return amenities;
  };

  /**
   * Rendu du modal de filtrage
   * Render filter modal
   */
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {/* Type de bureau */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Type d'espace</Text>
              <View style={styles.filterOptions}>
                {filterOptions.types.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.filterChip,
                      selectedTypes.includes(type.id) && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedTypes(toggleSelection(selectedTypes, type.id))}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        selectedTypes.includes(type.id) && styles.filterChipTextSelected
                      ]}
                    >
                      {type.label}
                    </Text>
                    {selectedTypes.includes(type.id) && (
                      <Check size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Équipements */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Équipements</Text>
              <View style={styles.filterOptions}>
                {filterOptions.amenities.map((amenity) => (
                  <TouchableOpacity
                    key={amenity.id}
                    style={[
                      styles.filterChip,
                      selectedAmenities.includes(amenity.id) && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedAmenities(toggleSelection(selectedAmenities, amenity.id))}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        selectedAmenities.includes(amenity.id) && styles.filterChipTextSelected
                      ]}
                    >
                      {amenity.label}
                    </Text>
                    {selectedAmenities.includes(amenity.id) && (
                      <Check size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Plage de prix */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Prix (par mois)</Text>
              <View style={styles.filterOptions}>
                {filterOptions.priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.filterChip,
                      selectedPriceRange === range.id && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedPriceRange(
                      selectedPriceRange === range.id ? null : range.id
                    )}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        selectedPriceRange === range.id && styles.filterChipTextSelected
                      ]}
                    >
                      {range.label}
                    </Text>
                    {selectedPriceRange === range.id && (
                      <Check size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                applyFilters();
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderFilterModal()}
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour 👋</Text>
        <Text style={styles.title}>Trouvez votre espace de travail idéal</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Où cherchez-vous?"
            placeholderTextColor="#666"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, filtersApplied && styles.filterButtonActive]} 
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={filtersApplied ? "#fff" : "#0066FF"} />
          {filtersApplied && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {selectedTypes.length + selectedAmenities.length + (selectedPriceRange ? 1 : 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Villes d'affaires populaires</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsContainer}
        >
          {FEATURED_LOCATIONS.map((location) => (
            <TouchableOpacity key={location.id} style={styles.locationCard}>
              <Image source={{ uri: location.image }} style={styles.locationImage} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recommendedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filtersApplied 
              ? `Résultats (${filteredProperties.length})` 
              : 'Espaces de bureaux recommandés'}
          </Text>
          {!filtersApplied && (
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {loading ? (
          <View style={styles.loadingStateContainer}>
            <ActivityIndicator size="large" color="#0066FF" />
            <Text style={styles.loadingStateText}>Chargement des espaces...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorStateContainer}>
            <Text style={styles.errorStateText}>{error}</Text>
            <TouchableOpacity style={styles.retryStateButton} onPress={fetchProperties}>
              <Text style={styles.retryStateText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProperties.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/clouds/100/000000/search.png' }} 
              style={styles.emptyStateImage} 
            />
            <Text style={styles.emptyStateTitle}>Aucun résultat</Text>
            <Text style={styles.emptyStateText}>
              Aucun espace ne correspond à vos critères. Essayez d'ajuster vos filtres.
            </Text>
            {filtersApplied && (
              <TouchableOpacity 
                style={styles.resetFiltersButton} 
                onPress={resetFilters}
              >
                <Text style={styles.resetFiltersText}>Réinitialiser les filtres</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredProperties.map((property) => {
            const amenities = getPropertyAmenities(property);
            const propertyLocation = property.address || property.location || 'Emplacement non spécifié';
            
            return (
              <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
                onPress={() => router.push(`/property/${property.id}`)}
              >
                <Image 
                  source={{ uri: property.image_url }} 
                  style={styles.propertyImage} 
                />
                <View style={styles.propertyInfo}>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#0066FF" />
                    <Text style={styles.location}>{propertyLocation}</Text>
                  </View>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text numberOfLines={2} style={styles.propertyDescription}>{property.description}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.rating}>{property.rating || '4.8'}</Text>
                    <Text style={styles.reviews}>({property.reviews || 0} avis)</Text>
                  </View>
                  <View style={styles.amenitiesContainer}>
                    {amenities.slice(0, 3).map((amenity, index) => (
                      <View key={index} style={styles.amenity}>
                        {getAmenityIcon(amenity)}
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{property.price} TND</Text>
                    <Text style={styles.perNight}>/ mois</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#0066FF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    marginTop: -24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#0066FF',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  seeAllButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0066FF',
  },
  featuredSection: {
    paddingTop: 20,
  },
  locationsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 8,
  },
  locationCard: {
    width: 200,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  propertyCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  recommendedSection: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  propertyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  propertyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  propertyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  amenityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  loadingStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryStateButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  resetFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
  },
  resetFiltersText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0066FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  filterChipSelected: {
    backgroundColor: '#0066FF',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 34, // Extra padding for iOS home indicator
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#0066FF',
    borderRadius: 12,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
