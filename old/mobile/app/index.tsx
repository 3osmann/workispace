
import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user) {
      console.log(`Root index: User authenticated (${user.role}), will redirect to tabs`);
    } else if (!loading) {
      console.log("Root index: No user found, will redirect to login");
    }
  }, [user, loading]);
  
  // Show loading indicator while checking auth state
  if (loading) {
    console.log("Root index: Auth is still loading, showing loading indicator");
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Once loaded, redirect based on auth state
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
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
