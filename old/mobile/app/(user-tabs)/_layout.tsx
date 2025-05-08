
import React from 'react';
import { Tabs } from 'expo-router';
import { Home, User, Building, Bookmark, MessageCircle } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';

/**
 * Tab layout specifically for standard users
 * Displays: Home, Favorites, Bookings, Support, Profile
 */
export default function StandardUserTabLayout() {
  const { user } = useAuth();
  
  console.log('Rendering standard user tabs layout');
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0066FF',  // Blue theme for standard users
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <Bookmark size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Réservations',
          tabBarIcon: ({ color, size }) => (
            <Building size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
