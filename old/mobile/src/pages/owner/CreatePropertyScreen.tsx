
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import propertyService from '../../services/propertyService';
import * as ImagePicker from 'expo-image-picker';
import { Check, ChevronDown, ChevronLeft, Image, Upload } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CreatePropertyScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    address: '',
    city: '',
    zipcode: '',
    country: 'France',
    region: '',
    price: '',
    type: 'coworking',
    property_type: 'office',
    status: 'pending',
    description: '',
    workstations: 1,
    meeting_rooms: 0,
    area: 0,
    amenities: [] as string[],
    bedrooms: 0,
    bathrooms: 0,
    images: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = 'Le titre est requis';
    if (!form.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!form.city.trim()) newErrors.city = 'La ville est requise';
    if (!form.zipcode.trim()) newErrors.zipcode = 'Le code postal est requis';
    if (!form.price.trim()) newErrors.price = 'Le prix est requis';
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeText = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear the error for this field if there was one
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const numberValue = value === '' ? '' : value;
    handleChangeText(field, numberValue);
  };

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setForm(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation échouée', 'Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter une propriété.');
      return;
    }

    setLoading(true);
    try {
      const propertyData = {
        owner_id: user.id,
        title: form.title,
        address: form.address,
        city: form.city,
        zipcode: form.zipcode,
        country: form.country,
        region: form.region,
        price: Number(form.price),
        type: form.type,
        status: form.status,
        property_type: form.property_type,
        description: form.description,
        workstations: Number(form.workstations),
        meeting_rooms: Number(form.meeting_rooms),
        area: Number(form.area),
        amenities: form.amenities,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        images: form.images,
      };

      const response = await propertyService.createProperty(propertyData);
      
      Alert.alert(
        'Succès',
        'Votre propriété a été créée et est en attente de validation.',
        [{ text: 'OK', onPress: () => router.push('/properties') }]
      );
    } catch (error) {
      console.error('Error creating property:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la propriété.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter une propriété</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={form.title}
            onChangeText={(value) => handleChangeText('title', value)}
            placeholder="Titre de votre propriété"
            placeholderTextColor="#999"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textArea]}
            value={form.description}
            onChangeText={(value) => handleChangeText('description', value)}
            placeholder="Description de votre propriété"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.sectionTitle}>Adresse</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            value={form.address}
            onChangeText={(value) => handleChangeText('address', value)}
            placeholder="Adresse"
            placeholderTextColor="#999"
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Ville *</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              value={form.city}
              onChangeText={(value) => handleChangeText('city', value)}
              placeholder="Ville"
              placeholderTextColor="#999"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Code postal *</Text>
            <TextInput
              style={[styles.input, errors.zipcode && styles.inputError]}
              value={form.zipcode}
              onChangeText={(value) => handleChangeText('zipcode', value)}
              placeholder="Code postal"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode}</Text>}
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Pays</Text>
            <TextInput
              style={styles.input}
              value={form.country}
              onChangeText={(value) => handleChangeText('country', value)}
              placeholder="Pays"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Région</Text>
            <TextInput
              style={styles.input}
              value={form.region}
              onChangeText={(value) => handleChangeText('region', value)}
              placeholder="Région"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Détails</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix par jour (€) *</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={form.price}
            onChangeText={(value) => handleChangeText('price', value)}
            placeholder="Prix par jour"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Postes de travail</Text>
            <TextInput
              style={styles.input}
              value={String(form.workstations)}
              onChangeText={(value) => handleNumberChange('workstations', value)}
              placeholder="Nombre de postes"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Salles de réunion</Text>
            <TextInput
              style={styles.input}
              value={String(form.meeting_rooms)}
              onChangeText={(value) => handleNumberChange('meeting_rooms', value)}
              placeholder="Nombre de salles"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Surface (m²)</Text>
          <TextInput
            style={styles.input}
            value={form.area ? String(form.area) : ''}
            onChangeText={(value) => handleNumberChange('area', value)}
            placeholder="Surface en m²"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Images</Text>
        
        <TouchableOpacity 
          style={styles.imageUploadButton}
          onPress={handleSelectImage}
        >
          <Upload size={24} color="#9b87f5" />
          <Text style={styles.imageUploadText}>Ajouter des images</Text>
        </TouchableOpacity>
        
        {form.images.length > 0 && (
          <Text style={styles.imageCount}>{form.images.length} image(s) sélectionnée(s)</Text>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Check size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Créer la propriété</Text>
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
    backgroundColor: '#9b87f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  form: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0ebfe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0d8fc',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#9b87f5',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  imageCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    backgroundColor: '#9b87f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
  },
});
