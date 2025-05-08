
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Edit2, Trash2, Plus } from 'lucide-react-native';
import { getPropertiesByOwner, deleteProperty } from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyData } from '../../services/propertyService';

/**
 * Écran de liste des propriétés
 * Affiche toutes les propriétés avec options de recherche, modification et suppression
 */
const PropertiesListScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  // Récupération des propriétés au chargement
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Utiliser l'ID du propriétaire connecté pour récupérer ses propriétés
      if (!user || !user.id) {
        setError('Utilisateur non authentifié ou ID manquant');
        setLoading(false);
        return;
      }
      
      const data = await getPropertiesByOwner(user.id);
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des propriétés:", err);
      setError('Impossible de charger les propriétés');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user?.id]);
  
  // Filtrage des propriétés par recherche
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => 
        property?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        property?.address?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [searchText, properties]);

  // Actualisation de la liste
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  // Suppression d'une propriété
  const handleDeleteProperty = (propertyId: string, propertyName: string) => {
    Alert.alert(
      "Confirmation de suppression",
      `Êtes-vous sûr de vouloir supprimer la propriété "${propertyName}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              // Rafraîchir la liste après la suppression
              fetchProperties();
              Alert.alert("Succès", "Propriété supprimée avec succès");
            } catch (err) {
              console.error("Erreur lors de la suppression:", err);
              Alert.alert("Erreur", "Impossible de supprimer la propriété");
            }
          }
        }
      ]
    );
  };

  // Rendu d'une propriété dans la liste
  const renderProperty = ({ item }: { item: PropertyData }) => (
    <View style={styles.propertyCard}>
      <TouchableOpacity 
        onPress={() => router.push({
          pathname: '/(owner-tabs)/properties/details',
          params: { propertyId: item.id }
        })}
      >
        <Image 
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }} 
          style={styles.propertyImage} 
        />
      </TouchableOpacity>
      
      <View style={styles.propertyInfo}>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/(owner-tabs)/properties/details',
            params: { propertyId: item.id }
          })}
        >
          <Text style={styles.propertyTitle}>{item.title}</Text>
          <Text style={styles.propertyAddress}>{item.address}</Text>
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyPrice}>{item.price}€ /mois</Text>
            <View style={[
              styles.statusBadge,
              item.status === 'available' ? styles.availableStatus : 
              item.status === 'maintenance' ? styles.maintenanceStatus :
              styles.bookedStatus
            ]}>
              <Text style={styles.statusText}>
                {item.status === 'available' ? 'Disponible' : 
                 item.status === 'maintenance' ? 'Maintenance' :
                 'Réservé'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push({
              pathname: '/(owner-tabs)/properties/edit',
              params: { propertyId: item.id }
            })}
          >
            <Edit2 size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProperty(item.id || '', item.title || '')}
          >
            <Trash2 size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes propriétés</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(owner-tabs)/properties/create')}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une propriété..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Chargement des propriétés...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProperties}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderProperty}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchText ? 'Aucune propriété ne correspond à votre recherche' : 'Aucune propriété disponible'}
              </Text>
              {!searchText && (
                <TouchableOpacity 
                  style={styles.addPropertyButton}
                  onPress={() => router.push('/(owner-tabs)/properties/create')}
                >
                  <Text style={styles.addPropertyButtonText}>Ajouter une propriété</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0066FF',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0066FF',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
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
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#0066FF',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addPropertyButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  addPropertyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default PropertiesListScreen;
