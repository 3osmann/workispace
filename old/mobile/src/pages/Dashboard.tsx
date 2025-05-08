
/**
 * Tableau de bord
 * Affiche un aperçu des statistiques et activités récentes de l'application de gestion d'espaces de bureaux
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ActivityItem, ActivityType } from '../types';
import ActivityFeed from '../components/ActivityFeed';

/**
 * Données factices pour la démonstration des activités récentes
 * Exemple d'activités de gestion d'espaces de bureaux professionnels
 */
const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'space' as ActivityType,
    title: 'Nouvel espace ajouté',
    description: 'Bureau privé premium ajouté au catalogue',
    time: 'Il y a 2 heures',
    status: 'completed',
    user: {
      name: 'Marc Dubois',
      initials: 'MD',
    },
  },
  {
    id: '2',
    type: 'rental' as ActivityType,
    title: 'Réservation confirmée',
    description: 'Espace de coworking réservé pour 3 mois',
    time: 'Il y a 3 heures',
    status: 'pending',
    user: {
      name: 'Sophie Martin',
      initials: 'SM',
    },
  },
  {
    id: '3',
    type: 'user' as ActivityType,
    title: 'Nouvelle entreprise inscrite',
    description: 'StartupTech a créé un compte professionnel',
    time: 'Il y a 5 heures',
  },
  {
    id: '4',
    type: 'maintenance' as ActivityType,
    title: 'Maintenance programmée',
    description: 'Mise à jour du système de climatisation',
    time: 'Il y a 1 jour',
    status: 'inProgress',
    user: {
      name: 'Pierre Lemoine',
      initials: 'PL',
    },
  },
];

/**
 * Statistiques des espaces de bureaux pour la démonstration
 * Aperçu du statut des espaces disponibles
 */
const spaceStats = [
  { id: '1', label: 'Total Espaces', value: 126, color: '#0066FF' },
  { id: '2', label: 'Occupés', value: 68, color: '#FF9500' },
  { id: '3', label: 'Disponibles', value: 52, color: '#4CAF50' },
  { id: '4', label: 'En maintenance', value: 6, color: '#FF3B30' },
];

/**
 * Statistiques des réservations pour la démonstration
 * Aperçu de l'activité de location d'espaces de bureaux
 */
const rentalStats = [
  { id: '1', label: 'Réservations Actives', value: 68, change: '+12%', positive: true },
  { id: '2', label: 'Fins de Contrat ce Mois', value: 14, change: '+3', positive: true },
  { id: '3', label: 'Demandes en Attente', value: 21, change: '-5%', positive: false },
];

/**
 * Composant de tableau de bord
 * Affiche un aperçu de l'activité de gestion des espaces de bureaux et des statistiques
 */
const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de Bord</Text>
        <Text style={styles.subtitle}>Aperçu de l'activité des espaces de bureaux</Text>
      </View>

      <View style={styles.statsCards}>
        {rentalStats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <View style={[
              styles.changeIndicator,
              stat.positive ? styles.positiveChange : styles.negativeChange
            ]}>
              <Text style={[
                styles.changeText,
                stat.positive ? styles.positiveChangeText : styles.negativeChangeText
              ]}>
                {stat.change}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statut des Espaces de Bureaux</Text>
        <View style={styles.devicesStats}>
          {spaceStats.map((stat) => (
            <View key={stat.id} style={styles.deviceStat}>
              <View style={[styles.deviceStatIcon, { backgroundColor: stat.color }]}>
                <Text style={styles.deviceStatIconText}>
                  {stat.label.charAt(0)}
                </Text>
              </View>
              <View style={styles.deviceStatInfo}>
                <Text style={styles.deviceStatValue}>{stat.value}</Text>
                <Text style={styles.deviceStatLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ActivityFeed 
        activities={recentActivities}
        title="Activité Récente"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  positiveChange: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  negativeChange: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  positiveChangeText: {
    color: '#4CAF50',
  },
  negativeChangeText: {
    color: '#FF3B30',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  devicesStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceStat: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceStatIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deviceStatInfo: {
    flex: 1,
  },
  deviceStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceStatLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default Dashboard;
