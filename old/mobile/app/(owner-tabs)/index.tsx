
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import OwnerDashboard from '../../src/pages/owner/OwnerDashboard';

export default function OwnerHomeTab() {
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

  // Ensure we have a user
  if (!user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  console.log('OwnerHomeTab: Showing owner dashboard');
  return <OwnerDashboard />;
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
