import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  
  // Mock data for customer dashboard
  const [activeBookings, setActiveBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Import booking service
  const { getActiveBookings, getPastBookings } = require('../../services/booking-service');
  
  // Load the user's bookings
  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('DEBUG - customer-dashboard - Loading bookings for user:', user.uid);
        const bookings = await getActiveBookings(user.uid);
        console.log('DEBUG - customer-dashboard - Raw bookings received:', 
          bookings.length ? JSON.stringify(bookings) : 'No bookings found');
        
        // Format bookings for display
        const formattedBookings = bookings.map(booking => {
          console.log('DEBUG - customer-dashboard - Processing booking:', booking.id);
          console.log('DEBUG - customer-dashboard - Booking pickupDateTime:', 
            booking.pickupDateTime ? booking.pickupDateTime.toString() : 'undefined');
          
          try {
            // Safely handle potential timestamp issues
            let formattedDate = 'Unknown date';
            if (booking.pickupDateTime) {
              if (typeof booking.pickupDateTime.toDate === 'function') {
                formattedDate = booking.pickupDateTime.toDate().toLocaleString();
              } else if (booking.pickupDateTime instanceof Date) {
                formattedDate = booking.pickupDateTime.toLocaleString();
              }
            }
            
            return {
              id: booking.id,
              status: booking.status,
              date: formattedDate,
              driver: 'John D.', // In a real app, you'd fetch the driver name
              vehicleType: 'Pickup Truck',
              pickup: booking.pickupAddress,
              destination: booking.destinationAddress
            };
          } catch (err) {
            console.error('DEBUG - customer-dashboard - Error formatting booking:', err);
            return {
              id: booking.id,
              status: booking.status,
              date: 'Error formatting date',
              driver: 'John D.',
              vehicleType: 'Pickup Truck',
              pickup: booking.pickupAddress || 'Unknown',
              destination: booking.destinationAddress || 'Unknown'
            };
          }
        });
        
        console.log('DEBUG - customer-dashboard - Formatted bookings:', 
          formattedBookings.length ? JSON.stringify(formattedBookings) : 'No formatted bookings');
        setActiveBookings(formattedBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, [user]);
  
  const [pastBookings, setPastBookings] = useState([]);
  
  // Load past bookings
  useEffect(() => {
    const loadPastBookings = async () => {
      if (!user) return;
      
      try {
        const bookings = await getPastBookings(user.uid);
        
        // Format past bookings for display
        const formattedBookings = bookings.map(booking => ({
          id: booking.id,
          date: new Date(booking.pickupDateTime.toDate()).toLocaleDateString(),
          driver: booking.ownerId === 'owner123' ? 'John D.' : 'Mike S.', // Mock names
          vehicleType: booking.vehicleId.includes('van') ? 'Cargo Van' : 'Pickup Truck',
          status: booking.status
        }));
        
        setPastBookings(formattedBookings);
      } catch (error) {
        console.error('Error loading past bookings:', error);
      }
    };
    
    loadPastBookings();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFB74D';
      case 'confirmed': return '#4CAF50';
      case 'in-progress': return '#2196F3';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'confirmed': return 'Confirmed';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleNewBooking = () => {
    router.push('/choice1/screen1');
  };

  const viewBookingDetails = (bookingId) => {
    // In a real app, this would navigate to booking details
    // For now we'll go to the tracking screen
    router.push('/choice1/tracking');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'there'}!</Text>
          <Text style={styles.date}>Monday, April 28, 2025</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.newBookingCard}>
          <Text style={styles.newBookingTitle}>Need to move something?</Text>
          <Text style={styles.newBookingText}>Book a truck with just a few taps</Text>
          <TouchableOpacity 
            style={styles.newBookingButton}
            onPress={handleNewBooking}
          >
            <Text style={styles.newBookingButtonText}>New Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Bookings</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a80f5" />
            <Text style={styles.loadingText}>Loading your bookings...</Text>
          </View>
        ) : (
          activeBookings.length > 0 ? (
            activeBookings.map(booking => (
              <TouchableOpacity 
                key={booking.id} 
                style={styles.bookingCard}
                onPress={() => viewBookingDetails(booking.id)}
              >
              <View style={styles.bookingHeader}>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.status) }]} />
                  <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                </View>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              
              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="directions-car" size={20} color="#4a80f5" style={styles.detailIcon} />
                  <Text style={styles.detailText}>{booking.vehicleType} • {booking.driver}</Text>
                </View>
                
                <View style={styles.locationContainer}>
                  <View style={styles.locationRow}>
                    <View style={styles.locationIconContainer}>
                      <MaterialIcons name="trip-origin" size={16} color="#4CAF50" />
                    </View>
                    <Text style={styles.locationText} numberOfLines={1}>{booking.pickup}</Text>
                  </View>
                  
                  <View style={styles.locationConnector}>
                    <View style={styles.connectorLine} />
                  </View>
                  
                  <View style={styles.locationRow}>
                    <View style={styles.locationIconContainer}>
                      <MaterialIcons name="place" size={16} color="#F44336" />
                    </View>
                    <Text style={styles.locationText} numberOfLines={1}>{booking.destination}</Text>
                  </View>
                </View>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="chat" size={16} color="#4a80f5" />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="local-phone" size={16} color="#4a80f5" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.trackButton]}
                    onPress={() => router.push('/choice1/tracking')}
                  >
                    <MaterialIcons name="location-searching" size={16} color="white" />
                    <Text style={styles.trackButtonText}>Track</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialIcons name="local-shipping" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No active bookings</Text>
              <Text style={styles.emptyStateSubtext}>Your current bookings will appear here</Text>
            </View>
          )
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booking History</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {pastBookings.map(booking => (
          <TouchableOpacity 
            key={booking.id} 
            style={styles.historyCard}
            onPress={() => viewBookingDetails(booking.id)}
          >
            <View style={styles.historyLeft}>
              <Text style={styles.historyDate}>{booking.date}</Text>
              <Text style={styles.historyInfo}>{booking.vehicleType} • {booking.driver}</Text>
            </View>
            <View style={[styles.historyStatus, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
              <Text style={[styles.historyStatusText, { color: getStatusColor(booking.status) }]}>
                {getStatusText(booking.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#4a80f5" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="history" size={24} color="#888" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="notifications" size={24} color="#888" />
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 5,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4a80f5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  newBookingCard: {
    backgroundColor: '#4a80f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  newBookingTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newBookingText: {
    color: 'white',
    opacity: 0.9,
    fontSize: 14,
    marginBottom: 16,
  },
  newBookingButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBookingButtonText: {
    color: '#4a80f5',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4a80f5',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  bookingDate: {
    fontSize: 12,
    color: '#777',
  },
  bookingDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  locationConnector: {
    paddingLeft: 12,
    marginVertical: 2,
  },
  connectorLine: {
    width: 1,
    height: 10,
    backgroundColor: '#ccc',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 12,
  },
  actionText: {
    color: '#4a80f5',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  trackButton: {
    backgroundColor: '#4a80f5',
    marginLeft: 'auto',
    marginRight: 0,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    marginBottom: 16,
    minHeight: 150,
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  historyInfo: {
    fontSize: 12,
    color: '#777',
  },
  historyStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeNavText: {
    color: '#4a80f5',
  },
});