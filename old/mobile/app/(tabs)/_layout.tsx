
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { Redirect } from 'expo-router';

/**
 * Main tabs layout component that redirects users to the appropriate tab layout
 * based on user role (owner or standard user)
 */
export default function TabLayout() {
  const { user, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    console.log("TabLayout: Loading auth state...");
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }
  
  // If no user is available, show loading indicator
  if (!user) {
    console.log("TabLayout: No user available, not rendering tabs");
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  // Determine which tab layout to use based on user role
  const isOwner = user.role === 'owner';
  console.log(`TabLayout: Redirecting ${user.prenom} ${user.nom} (${user.role}) to appropriate tabs`);
  
  // Redirect to owner or standard user tabs based on role
  return isOwner ? <Redirect href="/(owner-tabs)" /> : <Redirect href="/(user-tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});
