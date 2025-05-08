
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Building, PlusSquare, Package, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import propertyService from '../../services/propertyService';
import { PropertyData } from '../../types';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    revenue: 0
  });

  const fetchOwnerProperties = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const ownerProps = await propertyService.getPropertiesByOwner(user.id);
      setProperties(ownerProps);
      
      // Calculate stats
      const totalRevenue = ownerProps.reduce((sum, prop) => sum + (prop.price || 0), 0);
      
      setStats({
        total: ownerProps.length,
        active: ownerProps.filter((p: PropertyData) => p.status === 'active').length,
        pending: ownerProps.filter((p: PropertyData) => p.status === 'pending').length,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching owner properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOwnerProperties();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOwnerProperties();
  };

  const handleAddProperty = () => {
    router.push('/properties/create');
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push({
      pathname: "/property/[id]",
      params: { id: propertyId }
    });
  };

  const renderPropertyCard = (property: PropertyData) => {
    return (
      <TouchableOpacity
        key={property.id}
        style={styles.propertyCard}
        onPress={() => property.id && handlePropertyPress(property.id)}
      >
        <Image
          source={{ uri: property.image_url || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=300' }}
          style={styles.propertyImage}
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.propertyAddress} numberOfLines={1}>{property.address}</Text>
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyPrice}>{property.price}€/jour</Text>
            <View style={[
              styles.statusBadge,
              property.status === 'active' ? styles.activeBadge : styles.pendingBadge
            ]}>
              <Text style={[
                styles.statusText,
                property.status === 'active' ? styles.activeText : styles.pendingText
              ]}>
                {property.status === 'active' ? 'Active' : 'En attente'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#9b87f5"]} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.prenom || 'Propriétaire'}</Text>
        <Text style={styles.subtitle}>Voici le résumé de votre activité</Text>
      </View>

      <View style={styles.statsOverviewContainer}>
        <View style={styles.statsOverviewCard}>
          <BarChart3 size={24} color="#9b87f5" style={styles.overviewIcon} />
          <Text style={styles.overviewText}>Vue d'ensemble</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Building size={24} color="#9b87f5" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Propriétés</Text>
        </View>
        <View style={styles.statCard}>
          <Package size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Actives</Text>
        </View>
        <View style={styles.statCard}>
          <AlertCircle size={24} color="#FF9800" />
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#2196F3" />
          <Text style={styles.statValue}>{stats.revenue}€</Text>
          <Text style={styles.statLabel}>Revenus</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes propriétés</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddProperty}
          >
            <PlusSquare size={20} color="#9b87f5" />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesContainer}>
          {properties.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Vous n'avez pas encore de propriétés. Ajoutez-en une pour commencer.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddProperty}
              >
                <PlusSquare size={20} color="#fff" />
                <Text style={styles.emptyStateButtonText}>
                  Ajouter une propriété
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            properties.map(renderPropertyCard)
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9fc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#9b87f5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  statsOverviewContainer: {
    paddingHorizontal: 24,
    marginTop: -20,
  },
  statsOverviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIcon: {
    marginRight: 12,
  },
  overviewText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  section: {
    padding: 24,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0ecff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#9b87f5',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  propertiesContainer: {
    marginTop: 8,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9b87f5',
    fontFamily: 'Inter-Bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  activeText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyStateButton: {
    flexDirection: 'row',
    backgroundColor: '#9b87f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
});
