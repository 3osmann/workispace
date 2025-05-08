
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Star, ArrowLeft, Wifi, School as Pool, Twitch as Kitchen, Car } from 'lucide-react-native';
import { useEffect, useState } from 'react';

// Define TypeScript interfaces
interface Property {
  id: string;
  title: string;
  location?: string;
  address?: string;
  price: string;
  rating: string;
  reviews?: number;
  image_url: string;
  description: string;
  type?: string;
  area?: string;
  workstations?: number;
  meeting_rooms?: number;
  // Amenities flags
  wifi?: number;
  parking?: number;
  coffee?: number;
  reception?: number;
  secured?: number;
  accessible?: number;
  printers?: number;
  kitchen?: number;
  flexible_hours?: number;
}

const { width } = Dimensions.get('window');

export default function PropertyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://192.168.1.7:3000/api/properties/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setProperty(result.data);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la propriété:', err);
      setError('Impossible de charger les détails. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wifi haut débit':
        return <Wifi size={24} color="#0066FF" />;
      case 'Piscine':
        return <Pool size={24} color="#0066FF" />;
      case 'Cuisine équipée':
      case 'Café/Thé':
        return <Kitchen size={24} color="#0066FF" />;
      case 'Parking sécurisé':
      case 'Parking':
        return <Car size={24} color="#0066FF" />;
      default:
        return null;
    }
  };

  /**
   * Converts API property data amenities to display format
   */
  const getPropertyAmenities = (property: Property): string[] => {
    const amenities: string[] = [];
    
    if (property.wifi === 1) amenities.push('Wifi haut débit');
    if (property.parking === 1) amenities.push('Parking sécurisé');
    if (property.meeting_rooms && property.meeting_rooms > 0) amenities.push('Salles de réunion');
    if (property.kitchen === 1) amenities.push('Cuisine équipée');
    if (property.coffee === 1) amenities.push('Café/Thé');
    if (property.reception === 1) amenities.push('Réception');
    if (property.secured === 1) amenities.push('Sécurisé');
    if (property.printers === 1) amenities.push('Imprimantes');
    if (property.flexible_hours === 1) amenities.push('Heures flexibles');
    
    return amenities;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Propriété non trouvée"}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPropertyDetails}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonErrorText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get location from address or location field
  const locationText = property.address || property.location || 'Emplacement non spécifié';
  // Get amenities in display format
  const amenities = getPropertyAmenities(property);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Image 
            source={{
              uri: property.image_url,
            }}
            style={styles.coverImage}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#0066FF" />
              <Text style={styles.location}>{locationText}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Star size={16} color="#0066FF" fill="#0066FF" />
            <Text style={styles.rating}>{property.rating}</Text>
            <Text style={styles.reviews}>({property.reviews || 0} avis)</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>À propos de ce logement</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.statsContainer}>
            {[
              { value: property.type || 'Bureau standard', label: 'Type d\'espace' },
              { value: `${property.workstations || 0} pers.`, label: 'Capacité' },
              { value: `${property.area || 0}m²`, label: 'Surface' },
            ].map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.infoTitle}>Équipements</Text>
              <View style={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenity}>
                    {renderAmenityIcon(amenity)}
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{property.price} TND</Text>
          <Text style={styles.perNight}>/ mois</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // Add booking logic here
          }}
        >
          <Text style={styles.bookButtonText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  backButtonError: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonErrorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0066FF',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amenitiesContainer: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenity: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
