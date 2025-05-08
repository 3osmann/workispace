
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing favorites in AsyncStorage
const FAVORITES_STORAGE_KEY = 'PROPERTY_FAVORITES';

// Interface for property details that will be stored
export interface FavoriteProperty {
  id: string;
  title: string;
  location?: string;
  address?: string;
  price: string;
  rating: string;
  image_url: string;
  savedDate: string; // Date when item was added to favorites
}

/**
 * Get all favorite properties from AsyncStorage
 */
export const getFavorites = async (): Promise<FavoriteProperty[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Check if a property is in favorites
 * @param propertyId The ID of the property to check
 */
export const isPropertyFavorite = async (propertyId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === propertyId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

/**
 * Add a property to favorites
 * @param property The property object to add to favorites
 */
export const addToFavorites = async (property: FavoriteProperty): Promise<void> => {
  try {
    // First get current favorites
    const currentFavorites = await getFavorites();
    
    // Check if already in favorites
    if (!currentFavorites.some(fav => fav.id === property.id)) {
      // Add the saved date
      const propertyWithDate = {
        ...property,
        savedDate: new Date().toISOString(),
      };
      
      // Append the new property
      const updatedFavorites = [...currentFavorites, propertyWithDate];
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

/**
 * Remove a property from favorites
 * @param propertyId The ID of the property to remove
 */
export const removeFromFavorites = async (propertyId: string): Promise<void> => {
  try {
    const currentFavorites = await getFavorites();
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== propertyId);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

/**
 * Toggle favorite status of a property
 * @param property The property to toggle favorite status
 */
export const toggleFavorite = async (property: FavoriteProperty): Promise<boolean> => {
  try {
    const isFavorite = await isPropertyFavorite(property.id);
    
    if (isFavorite) {
      await removeFromFavorites(property.id);
      return false;
    } else {
      await addToFavorites(property);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};
