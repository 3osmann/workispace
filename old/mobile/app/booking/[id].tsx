import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, ArrowLeft, User, Phone, Mail, CreditCard } from 'lucide-react-native';

const BOOKINGS = {
  '1': {
    id: '1',
    propertyName: 'Villa de luxe avec vue sur mer',
    location: 'Cannes, France',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    price: 2250,
    guest: {
      name: 'Thomas Martin',
      email: 'thomas.martin@example.com',
      phone: '+33 6 12 34 56 78',
    },
    payment: {
      method: 'Carte bancaire',
      last4: '4242',
      amount: 2250,
      status: 'Payé',
      date: '2024-01-15',
    },
    property: {
      rooms: 3,
      bathrooms: 2,
      guests: 6,
      amenities: ['Wifi', 'Piscine', 'Parking', 'Cuisine équipée'],
    },
  },
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return '#0066FF';
    case 'upcoming':
      return '#00A3FF';
    case 'completed':
      return '#00C48C';
    default:
      return '#666';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmée';
    case 'upcoming':
      return 'À venir';
    case 'completed':
      return 'Terminée';
    default:
      return status;
  }
};

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const booking = BOOKINGS[id as keyof typeof BOOKINGS];

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Réservation non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Détails de la réservation</Text>
      </View>

      <View style={styles.content}>
        <Image source={{ uri: booking.image }} style={styles.propertyImage} />
        
        <View style={styles.bookingInfo}>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: `${getStatusColor(booking.status)}15` }
              ]}
            >
              <Text 
                style={[
                  styles.statusText, 
                  { color: getStatusColor(booking.status) }
                ]}
              >
                {getStatusText(booking.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.propertyName}>{booking.propertyName}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666" />
            <Text style={styles.location}>{booking.location}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates du séjour</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateInfo}>
                <Calendar size={16} color="#666" />
                <Text style={styles.dateText}>
                  Du {formatDate(booking.checkIn)} au {formatDate(booking.checkOut)}
                </Text>
              </View>
              <View style={styles.dateInfo}>
                <Clock size={16} color="#666" />
                <Text style={styles.dateText}>5 nuits</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations voyageur</Text>
            <View style={styles.guestInfo}>
              <View style={styles.infoRow}>
                <User size={16} color="#666" />
                <Text style={styles.infoText}>{booking.guest.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Mail size={16} color="#666" />
                <Text style={styles.infoText}>{booking.guest.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Phone size={16} color="#666" />
                <Text style={styles.infoText}>{booking.guest.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paiement</Text>
            <View style={styles.paymentInfo}>
              <View style={styles.infoRow}>
                <CreditCard size={16} color="#666" />
                <Text style={styles.infoText}>
                  {booking.payment.method} •••• {booking.payment.last4}
                </Text>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentLabel}>Montant total</Text>
                <Text style={styles.paymentAmount}>{booking.payment.amount} TND</Text>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentLabel}>Statut</Text>
                <Text style={[styles.paymentStatus, { color: '#00C48C' }]}>
                  {booking.payment.status}
                </Text>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentLabel}>Date de paiement</Text>
                <Text style={styles.paymentDate}>
                  {formatDate(booking.payment.date)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contacter le support</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  propertyImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  bookingInfo: {
    padding: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  propertyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  dateContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  guestInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  paymentInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  paymentAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
  },
  paymentStatus: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  paymentDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
  supportButton: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  supportButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0066FF',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});