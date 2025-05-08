
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, CircleHelp, LogOut, Mail, Phone, MapPin, ChevronDown, Lock, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { EditableField } from '../../src/types';

/**
 * Questions fréquemment posées
 */
const FAQ_ITEMS = [
  {
    question: 'Comment modifier mes informations personnelles ?',
    answer: 'Vous pouvez modifier vos informations en cliquant sur le champ que vous souhaitez modifier. Un formulaire s\'ouvrira pour vous permettre de mettre à jour vos informations.'
  },
  {
    question: 'Comment contacter le support ?',
    answer: 'Notre équipe support est disponible 24/7. Vous pouvez nous contacter par email à support@example.com ou via le chat en direct dans l\'application.'
  },
  {
    question: 'Comment fonctionne le système de réservation ?',
    answer: 'Pour réserver un logement, sélectionnez vos dates, vérifiez la disponibilité et procédez au paiement. La confirmation sera envoyée par email.'
  }
];

export default function UserProfileTab() {
  const router = useRouter();
  const { user, updateUserInfo, logout, deleteUserAccount } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    email: user?.email || '',
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour la modale de confirmation
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'update' | 'delete' | null>(null);
  const [fieldToUpdate, setFieldToUpdate] = useState<EditableField | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  /**
   * Demande confirmation avant de sauvegarder les modifications
   */
  const confirmSave = (field: EditableField) => {
    setFieldToUpdate(field);
    setModalType('update');
    setModalVisible(true);
  };

  /**
   * Demande confirmation avant de supprimer le compte
   */
  const confirmDelete = () => {
    setModalType('delete');
    setModalVisible(true);
  };

  /**
   * Sauvegarde les modifications après confirmation
   */
  const handleSave = async () => {
    if (!user || !fieldToUpdate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (fieldToUpdate === 'password') {
        if (!editValues.currentPassword) {
          setError('Veuillez entrer votre mot de passe actuel');
          setLoading(false);
          return;
        }
        if (editValues.newPassword !== editValues.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        
        await updateUserInfo(user.id, { 
          password: editValues.newPassword 
        });
        
        setEditValues({
          ...editValues,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        await updateUserInfo(user.id, { 
          [fieldToUpdate]: editValues[fieldToUpdate]
        });
      }
      
      setActiveDropdown(null);
      setModalVisible(false);
      Alert.alert('Succès', 'Vos informations ont été mises à jour avec succès.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprime le compte utilisateur après confirmation
   */
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (deleteConfirmText !== 'SUPPRIMER') {
      setError('Veuillez écrire "SUPPRIMER" pour confirmer');
      return;
    }
    
    setLoading(true);
    
    try {
      await deleteUserAccount(user.id);
      setModalVisible(false);
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion de l'utilisateur - simplified to just clear local storage and navigate
   */
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rendu d'un champ modifiable avec dropdown
   */
  const renderDropdownItem = (
    icon: React.ReactNode,
    title: string,
    value: string,
    field: EditableField
  ) => (
    <View style={styles.settingsItem}>
      <TouchableOpacity
        style={[
          styles.settingsItemHeader,
          activeDropdown === field && styles.settingsItemHeaderActive
        ]}
        onPress={() => setActiveDropdown(activeDropdown === field ? null : field)}
      >
        <View style={styles.settingsItemLeft}>
          {icon}
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsItemTitle}>{title}</Text>
            {field !== 'password' && (
              <Text style={styles.settingsItemValue}>{value}</Text>
            )}
          </View>
        </View>
        <ChevronDown
          size={20}
          color="#666"
          style={[
            styles.dropdownIcon,
            activeDropdown === field && styles.dropdownIconActive,
          ]}
        />
      </TouchableOpacity>
      {activeDropdown === field && (
        <View style={styles.dropdownContent}>
          {field === 'password' ? (
            <>
              <TextInput
                style={styles.input}
                value={editValues.currentPassword}
                onChangeText={(text) => setEditValues({ ...editValues, currentPassword: text })}
                placeholder="Mot de passe actuel"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={editValues.newPassword}
                onChangeText={(text) => setEditValues({ ...editValues, newPassword: text })}
                placeholder="Nouveau mot de passe"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={editValues.confirmPassword}
                onChangeText={(text) => setEditValues({ ...editValues, confirmPassword: text })}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
                placeholderTextColor="#999"
              />
            </>
          ) : (
            <TextInput
              style={styles.input}
              value={editValues[field]}
              onChangeText={(text) => setEditValues({ ...editValues, [field]: text })}
              placeholder={`Nouveau ${title.toLowerCase()}`}
              keyboardType={field === 'email' ? 'email-address' : 'default'}
              placeholderTextColor="#999"
            />
          )}
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={() => confirmSave(field)}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  /**
   * Rendu de la modale de confirmation
   */
  const renderConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setError(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === 'update' ? 'Confirmer les modifications' : 'Supprimer le compte'}
          </Text>
          
          <Text style={styles.modalText}>
            {modalType === 'update' 
              ? 'Êtes-vous sûr de vouloir enregistrer ces modifications ?'
              : 'Cette action est irréversible. Votre compte et toutes vos données seront définitivement supprimés.'}
          </Text>
          
          {modalType === 'delete' && (
            <>
              <Text style={styles.modalWarning}>
                Écrivez "SUPPRIMER" pour confirmer:
              </Text>
              <TextInput
                style={styles.input}
                value={deleteConfirmText}
                onChangeText={setDeleteConfirmText}
                placeholder="SUPPRIMER"
                placeholderTextColor="#999"
              />
            </>
          )}
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setModalVisible(false);
                setError(null);
                if (modalType === 'delete') {
                  setDeleteConfirmText('');
                }
              }}
              disabled={loading}
            >
              <Text style={styles.modalCancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                modalType === 'update' ? styles.modalConfirmButton : styles.modalDeleteButton,
                loading && styles.saveButtonDisabled
              ]}
              onPress={modalType === 'update' ? handleSave : handleDeleteAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.modalConfirmButtonText}>
                  {modalType === 'update' ? 'Confirmer' : 'Supprimer'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderConfirmationModal()}
      
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}</Text>
            <Text style={styles.userType}>Compte {user?.role || 'utilisateur'}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {renderDropdownItem(
            <Mail size={20} color="#0066FF" style={styles.itemIcon} />,
            'Email',
            user?.email || '',
            'email'
          )}
          {renderDropdownItem(
            <User size={20} color="#0066FF" style={styles.itemIcon} />,
            'Prénom',
            user?.prenom || '',
            'prenom'
          )}
          {renderDropdownItem(
            <User size={20} color="#0066FF" style={styles.itemIcon} />,
            'Nom',
            user?.nom || '',
            'nom'
          )}
          {renderDropdownItem(
            <Lock size={20} color="#0066FF" style={styles.itemIcon} />,
            'Mot de passe',
            '••••••••',
            'password'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.faqItem}
            >
              <View style={styles.faqHeader}>
                <CircleHelp size={20} color="#0066FF" style={styles.itemIcon} />
                <Text style={styles.faqQuestion}>{item.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.deleteAccountButton}
          onPress={confirmDelete}
        >
          <Trash2 size={20} color="#FF3B30" />
          <Text style={styles.deleteAccountText}>Supprimer mon compte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FF3B30" size="small" />
          ) : (
            <>
              <LogOut size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  userType: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: -40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
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
  settingsItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingsItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsItemHeaderActive: {
    backgroundColor: '#F8F8F8',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  settingsItemValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContent: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  faqItem: {
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  faqQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginLeft: 32,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFDDDD',
  },
  deleteAccountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 20,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#0066FF80',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
  },
  modalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalWarning: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginRight: 8,
  },
  modalCancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#666',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
  modalDeleteButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
