
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getFavorites, FavoriteProperty, removeFromFavorites } from '../utils/favoriteUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterOption {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterOption> = ({ name, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, isSelected && styles.selectedFilterChipText]}>
      {name}
    </Text>
  </TouchableOpacity>
);

export default function FavoritesScreen() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const filters = [
    { id: '1', name: 'Tous' },
    { id: '2', name: 'Bureaux' },
    { id: '3', name: 'Salles de réunion' },
    { id: '4', name: 'Espaces événementiels' }
  ];

  useEffect(() => {
    loadFavorites();
    
    // Add a listener to refresh favorites when coming back to this screen
    const unsubscribe = () => {
      // This would be the cleanup function if we had navigation events
      // For now, we'll just reload on mount
    };
    
    return unsubscribe;
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFromFavorites(id);
      // Refresh the list
      loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFilterChip = ({ item }: { item: { id: string, name: string } }) => (
    <FilterChip
      name={item.name}
      isSelected={activeFilter === item.name}
      onPress={() => setActiveFilter(item.name)}
    />
  );

  // Filter favorites based on activeFilter
  const filteredFavorites = favorites.filter(favorite => {
    if (activeFilter === 'Tous') return true;
    // Here you would need logic to determine the type of property
    // For now we'll assume all are "Bureaux" 
    return activeFilter === 'Bureaux';
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes favoris</Text>
        <Text style={styles.subtitle}>
          {favorites.length} espace{favorites.length !== 1 ? 's' : ''} enregistré{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={renderFilterChip}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Chargement des favoris...</Text>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>Aucun favori pour le moment</Text>
            <Text style={styles.emptyStateText}>
              Ajoutez des espaces à vos favoris pour les retrouver ici
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.favoritesList}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <TouchableOpacity
                style={styles.favoriteCard}
                onPress={() => router.push(`/property/${item.id}`)}
              >
                <Image source={{ uri: item.image_url }} style={styles.favoriteImage} />
                <View style={styles.favoriteInfo}>
                  <View style={styles.favoriteLocationContainer}>
                    <MapPin size={16} color="#0066FF" />
                    <Text style={styles.favoriteLocation}>{item.address || item.location || 'Emplacement non spécifié'}</Text>
                  </View>
                  <Text style={styles.favoriteTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.favoriteRatingContainer}>
                    <Star size={16} color="#0066FF" fill="#0066FF" />
                    <Text style={styles.favoriteRating}>{item.rating}</Text>
                  </View>
                  <View style={styles.favoritePriceContainer}>
                    <Text style={styles.favoritePrice}>{item.price} TND</Text>
                    <Text style={styles.favoritePerMonth}>/ mois</Text>
                  </View>
                  <Text style={styles.favoriteSavedDate}>
                    Ajouté le {new Date(item.savedDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFavorite(item.id)}
                >
                  <Heart size={20} color="#FF3B30" fill="#FF3B30" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
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
  filtersContainer: {
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  filtersList: {
    gap: 12,
  },
  filterChip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedFilterChip: {
    backgroundColor: '#0066FF',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  selectedFilterChipText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 24,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  favoritesList: {
    paddingVertical: 16,
  },
  favoriteItem: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  favoriteImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  favoriteInfo: {
    flex: 1,
    padding: 12,
  },
  favoriteLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  favoriteLocation: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favoriteTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  favoriteRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  favoriteRating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  favoritePriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  favoritePrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#0066FF',
  },
  favoritePerMonth: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favoriteSavedDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 6,
  },
});