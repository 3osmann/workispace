import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Search, MapPin, Star, Trash2, FolderPlus, Filter } from 'lucide-react-native';

/**
 * Données factices pour les propriétés favorites
 * @type {Array} Liste des propriétés favorites de l'utilisateur
 */
const FAVORITE_PROPERTIES = [
  {
    id: '1',
    title: 'Villa de luxe avec vue sur mer',
    location: 'Cannes, France',
    price: 450,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    savedDate: '2024-01-15',
    collection: 'Vacances d\'été'
  },
  {
    id: '2',
    title: 'Appartement moderne au cœur de Paris',
    location: 'Paris, France',
    price: 280,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    savedDate: '2024-01-10',
    collection: 'Week-ends'
  },
  {
    id: '3',
    title: 'Chalet cosy dans les Alpes',
    location: 'Chamonix, France',
    price: 320,
    rating: 4.8,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=800&q=80',
    savedDate: '2024-01-05',
    collection: 'Vacances d\'hiver'
  }
];

const { width } = Dimensions.get('window');
const cardWidth = width > 768 ? (width - 60) / 2 : width - 40;

/**
 * Interface pour les props du badge de collection
 * @interface CollectionBadgeProps
 * @property {string} name - Nom de la collection
 * @property {boolean} isSelected - État de sélection du badge
 * @property {() => void} onPress - Fonction appelée lors du clic sur le badge
 */
interface CollectionBadgeProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Écran des favoris
 * Permet à l'utilisateur de voir et gérer ses logements favoris
 */
export default function FavoritesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('Tous');
  const [showCollections, setShowCollections] = useState(false);

  /**
   * Collections disponibles pour filtrer les favoris
   */
  const collections = ['Tous', 'Vacances d\'été', 'Week-ends', 'Vacances d\'hiver'];

  /**
   * Filtrer les propriétés en fonction de la recherche et de la collection sélectionnée
   */
  const filteredProperties = FAVORITE_PROPERTIES.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = selectedCollection === 'Tous' || property.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  /**
   * Composant pour afficher un badge de collection
   * @param {CollectionBadgeProps} props - Propriétés du badge
   */
  const CollectionBadge = ({ name, isSelected, onPress }: CollectionBadgeProps) => (
    <TouchableOpacity
      style={[styles.collectionBadge, isSelected && styles.collectionBadgeSelected]}
      onPress={onPress}
    >
      <Text style={[styles.collectionBadgeText, isSelected && styles.collectionBadgeTextSelected]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoris</Text>
        <Text style={styles.subtitle}>{FAVORITE_PROPERTIES.length} logements enregistrés</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans vos favoris..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCollections(!showCollections)}
        >
          <Filter size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>

      {showCollections && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.collectionsScroll}
          contentContainerStyle={styles.collectionsContainer}
        >
          {collections.map((collection) => (
            <CollectionBadge
              key={collection}
              name={collection}
              isSelected={selectedCollection === collection}
              onPress={() => setSelectedCollection(collection)}
            />
          ))}
          <TouchableOpacity style={styles.newCollectionButton}>
            <FolderPlus size={20} color="#0066FF" />
            <Text style={styles.newCollectionText}>Nouvelle collection</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.propertiesGrid}>
          {filteredProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={[styles.propertyCard, { width: cardWidth }]}
              onPress={() => router.push(`/property/${property.id}`)}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: property.image }} style={styles.propertyImage} />
                <TouchableOpacity style={styles.removeButton}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
                <View style={styles.savedDate}>
                  <Text style={styles.savedDateText}>
                    Ajouté le {new Date(property.savedDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>
              <View style={styles.propertyInfo}>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#0066FF" />
                  <Text style={styles.location}>{property.location}</Text>
                </View>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#0066FF" fill="#0066FF" />
                  <Text style={styles.rating}>{property.rating}</Text>
                  <Text style={styles.reviews}>({property.reviews} avis)</Text>
                </View>
                <Text style={styles.price}>{property.price} TND <Text style={styles.perNight}>/ nuit</Text></Text>
                <View style={styles.collectionTag}>
                  <Text style={styles.collectionTagText}>{property.collection}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#0066FF',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionsScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  collectionsContainer: {
    padding: 16,
    gap: 8,
  },
  collectionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  collectionBadgeSelected: {
    backgroundColor: '#0066FF',
  },
  collectionBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  collectionBadgeTextSelected: {
    color: '#fff',
  },
  newCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  newCollectionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0066FF',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  propertiesGrid: {
    padding: 20,
    gap: 20,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savedDate: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 6,
  },
  savedDateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#fff',
  },
  propertyInfo: {
    padding: 15,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  collectionTag: {
    marginTop: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  collectionTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
  },
});
