/**
 * Écran de support client
 * Fournit différentes options pour contacter le service client et obtenir de l'aide
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react-native';
import { SupportCategory } from '../../src/types';

/**
 * Catégories d'aide disponibles
 */
const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: '1',
    title: 'Réservations',
    description: 'Questions sur vos réservations actuelles ou passées',
    icon: <Clock size={24} color="#0066FF" />,
  },
  {
    id: '2',
    title: 'Paiements',
    description: 'Assistance pour les questions de paiement',
    icon: <Mail size={24} color="#0066FF" />,
  },
  {
    id: '3',
    title: 'Compte',
    description: 'Aide avec votre compte et vos paramètres',
    icon: <Phone size={24} color="#0066FF" />,
  },
];

const PHONE_NUMBER = '+33612345678';

/**
 * Composant d'écran de support
 */
export default function SupportScreen() {
  const router = useRouter();

  /**
   * Ouvre l'application téléphone pour appeler le support
   */
  const handleCall = () => {
    Linking.openURL(`tel:${PHONE_NUMBER}`);
  };

  /**
   * Naviguer vers une catégorie de support spécifique
   */
  const handleCategoryPress = (categoryId: string) => {
    // Dans une application réelle, cette méthode naviguerait vers la page de catégorie
    // Pour l'instant, on redirige vers le chat
    router.push('/support/chat');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Comment pouvons-nous vous aider ?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => router.push('/support/chat')}
            >
              <View style={styles.contactIconContainer}>
                <MessageCircle size={24} color="#0066FF" />
              </View>
              <Text style={styles.contactTitle}>Chat en direct</Text>
              <Text style={styles.contactDescription}>Réponse en quelques minutes</Text>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>En ligne</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactCard}
              onPress={handleCall}
            >
              <View style={styles.contactIconContainer}>
                <Phone size={24} color="#0066FF" />
              </View>
              <Text style={styles.contactTitle}>Appelez-nous</Text>
              <Text style={styles.contactDescription}>Lun-Ven, 9h-18h</Text>
              <Text style={styles.phoneNumber}>{PHONE_NUMBER}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories d'aide</Text>
          <View style={styles.categories}>
            {SUPPORT_CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={styles.categoryIcon}>
                  {category.icon}
                </View>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => router.push('/support/chat')}
      >
        <MessageCircle size={20} color="#fff" />
        <Text style={styles.newChatButtonText}>Nouvelle conversation</Text>
      </TouchableOpacity>
    </ScrollView>
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
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  contactDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  phoneNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0066FF',
    marginTop: 8,
  },
  categories: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    margin: 24,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  newChatButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
