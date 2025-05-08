/**
 * Tab principal - Écran d'accueil
 * Main tab - Home screen
 * 
 * Ce fichier gère la redirection selon le rôle de l'utilisateur:
 * - Propriétaire: OwnerDashboard
 * - Utilisateur standard: HomeScreen
 * 
 * This file manages redirection based on user role:
 * - Owner: OwnerDashboard
 * - Standard user: HomeScreen
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import OwnerDashboard from '../../src/pages/owner/OwnerDashboard';
import HomeScreen from '../../src/pages/HomeScreen';

export default function HomeTab() {
  const { user, loading } = useAuth();
  
  // Show loading indicator when checking auth state
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Ensure we have a user (should be handled by the parent layout already)
  if (!user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  // Show the owner dashboard for owner users
  if (user.role === 'owner') {
    console.log('HomeTab: Showing owner dashboard');
    return <OwnerDashboard />;
  }

  // Show the HomeScreen for standard users
  console.log('HomeTab: Showing standard user home screen');
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  }
});
