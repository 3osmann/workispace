
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  User, 
  Home, 
  Lock, 
  Accessibility, 
  Printer,
  Clock,
  ChefHat
} from 'lucide-react-native';
import { getPropertyById, deleteProperty } from '../../services/propertyService';

interface PropertyDetailsScreenProps {
  propertyId: string;
}

/**
 * Écran de détails d'une propriété
 * Affiche toutes les informations d'une propriété avec options d'édition et de suppression
 */
const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({ propertyId }) => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [error, setError] = useState('');

  // Récupération des données de la propriété
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la propriété:", err);
        setError('Impossible de charger les détails de la propriété');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);

  // Suppression d'une propriété
  const handleDeleteProperty = () => {
    Alert.alert(
      "Confirmation de suppression",
      `Êtes-vous sûr de vouloir supprimer cette propriété ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              Alert.alert("Succès", "Propriété supprimée avec succès");
              router.back();
            } catch (err) {
              console.error("Erreur lors de la suppression:", err);
              Alert.alert("Erreur", "Impossible de supprimer la propriété");
            }
          }
        }
      ]
    );
  };

  // Rendu d'une commodité
  const renderAmenity = (isActive: boolean, icon: React.ReactElement, label: string) => (
    <View style={[styles.amenityItem, !isActive && styles.amenityInactive]}>
      {React.cloneElement(icon, { size: 20, color: isActive ? '#9b87f5' : '#ccc' })}
      <Text style={[styles.amenityText, !isActive && styles.amenityTextInactive]}>
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backHomeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backHomeButtonText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: property?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }}
            style={styles.propertyImage}
          />
          
          <View style={styles.overlay} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.roundButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.roundButton, styles.editButton]}
                onPress={() => router.push({
                  pathname: '/(owner-tabs)/properties/edit',
                  params: { propertyId }
                })}
              >
                <Edit2 size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roundButton, styles.deleteButton]}
                onPress={handleDeleteProperty}
              >
                <Trash2 size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{property?.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#fff" />
              <Text style={styles.location}>{property?.address}</Text>
            </View>
            
            <View style={styles.priceStatusContainer}>
              <Text style={styles.price}>{property?.price}€ /mois</Text>
              
              <View style={[
                styles.statusBadge,
                property?.status === 'available' ? styles.availableStatus : 
                property?.status === 'maintenance' ? styles.maintenanceStatus :
                styles.bookedStatus
              ]}>
                <Text style={styles.statusText}>
                  {property?.status === 'available' ? 'Disponible' : 
                   property?.status === 'maintenance' ? 'Maintenance' :
                   'Réservé'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {property?.description || "Aucune description disponible."}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Home size={20} color="#9b87f5" />
                <Text style={styles.featureValue}>{property?.area || 0} m²</Text>
                <Text style={styles.featureLabel}>Surface</Text>
              </View>
              
              <View style={styles.featureItem}>
                <User size={20} color="#9b87f5" />
                <Text style={styles.featureValue}>{property?.workstations || 0}</Text>
                <Text style={styles.featureLabel}>Postes</Text>
              </View>
              
              <View style={styles.featureItem}>
                <User size={20} color="#9b87f5" />
                <Text style={styles.featureValue}>{property?.meeting_rooms || 0}</Text>
                <Text style={styles.featureLabel}>Salles de réunion</Text>
              </View>
              
              <View style={styles.featureItem}>
                <MapPin size={20} color="#9b87f5" />
                <Text style={styles.featureValue}>{property?.region || '-'}</Text>
                <Text style={styles.featureLabel}>Région</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commodités</Text>
            <View style={styles.amenitiesContainer}>
              {renderAmenity(property?.wifi, <Wifi />, 'WiFi')}
              {renderAmenity(property?.parking, <Car />, 'Parking')}
              {renderAmenity(property?.coffee, <Coffee />, 'Machine à café')}
              {renderAmenity(property?.reception, <User />, 'Réception')}
              {renderAmenity(property?.kitchen, <ChefHat />, 'Cuisine')}
              {renderAmenity(property?.secured, <Lock />, 'Sécurisé')}
              {renderAmenity(property?.accessible, <Accessibility />, 'Accessible PMR')}
              {renderAmenity(property?.printers, <Printer />, 'Imprimantes')}
              {renderAmenity(property?.flexible_hours, <Clock />, 'Horaires flexibles')}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 16,
  },
  backHomeButton: {
    backgroundColor: '#9b87f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'relative',
    height: 300,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: 'rgba(155, 135, 245, 0.8)',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  headerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
    marginLeft: 4,
  },
  priceStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  availableStatus: {
    backgroundColor: '#E8F5E9',
  },
  maintenanceStatus: {
    backgroundColor: '#FFF3E0',
  },
  bookedStatus: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  featureValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginTop: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityInactive: {
    backgroundColor: '#f0f0f0',
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 8,
  },
  amenityTextInactive: {
    color: '#999',
  },
});

export default PropertyDetailsScreen;
