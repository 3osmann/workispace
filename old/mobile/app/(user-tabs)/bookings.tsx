import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const BOOKINGS = [
  {
    id: '1',
    propertyName: 'Villa de luxe avec vue sur mer',
    location: 'Cannes, France',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    price: 2250,
  },
  {
    id: '2',
    propertyName: 'Appartement moderne au cœur de Paris',
    location: 'Paris, France',
    checkIn: '2024-03-10',
    checkOut: '2024-03-15',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    price: 1400,
  },
  {
    id: '3',
    propertyName: 'Chalet cosy dans les Alpes',
    location: 'Chamonix, France',
    checkIn: '2024-01-05',
    checkOut: '2024-01-10',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=800&q=80',
    price: 1600,
  },
];

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

export default function BookingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes réservations</Text>
        <Text style={styles.subtitle}>{BOOKINGS.length} réservations trouvées</Text>
      </View>

      <View style={styles.content}>
        {BOOKINGS.map((booking) => (
          <TouchableOpacity 
            key={booking.id} 
            style={styles.bookingCard}
            onPress={() => router.push(`/booking/${booking.id}`)}
          >
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

              <View style={styles.footer}>
                <Text style={styles.price}>{booking.price} TND</Text>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => router.push(`/booking/${booking.id}`)}
                >
                  <Text style={styles.detailsText}>Voir les détails</Text>
                  <ChevronRight size={16} color="#0066FF" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bookingInfo: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 12,
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  dateContainer: {
    gap: 8,
    marginBottom: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0066FF',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0066FF',
  },
});