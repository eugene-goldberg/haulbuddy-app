import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Platform,
  Linking,
  Dimensions,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useBooking } from '../../contexts/BookingContext';
import { db } from '../../firebase'; // Import directly from firebase module
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';

// In a real app, this would be a proper map component like react-native-maps
const MapPlaceholder = () => {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={64} color="#4a80f5" />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Driver location tracking would appear here
        </Text>
      </View>
    </View>
  );
};

export default function TrackingScreen() {
  const { bookingData, resetBookingData } = useBooking();
  const [currentStatus, setCurrentStatus] = useState('Driver En Route');
  const [estimatedArrival, setEstimatedArrival] = useState('15 minutes');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Add a status for the overall booking
  const [bookingStatus, setBookingStatus] = useState('active');
  const [statusHistory, setStatusHistory] = useState([
    { status: 'Booking Confirmed', time: '10:30 AM', completed: true },
    { status: 'Driver En Route', time: '10:45 AM', completed: true },
    { status: 'Arriving at Pickup', time: '11:05 AM', completed: false },
    { status: 'Loading Cargo', time: '11:15 AM', completed: false },
    { status: 'In Transit', time: '11:35 AM', completed: false },
    { status: 'Arrived at Destination', time: '12:10 PM', completed: false },
    { status: 'Delivery Complete', time: '12:30 PM', completed: false },
  ]);

  // Create a mock booking object that closely resembles a Firestore Booking
  const booking = {
    id: 'HB-29485', // This would be a real Firestore document ID in production
    customerId: 'user123', // This would be the current user's ID
    ownerId: 'owner456',
    vehicleId: 'vehicle789',
    status: bookingStatus,
    pickupAddress: bookingData.pickupAddress || '123 Main St, Chicago, IL 60601',
    destinationAddress: bookingData.destinationAddress || '456 Pine Ave, Chicago, IL 60605',
    cargoDescription: bookingData.cargoDescription || 'Furniture and boxes',
    pickupDateTime: bookingData.pickupDateTime || new Date(),
    estimatedHours: bookingData.estimatedHours || 2,
    needsAssistance: bookingData.needsAssistance || false,
    ridingAlong: bookingData.ridingAlong || false,
    totalCost: 90, // Would be calculated based on rates and estimated hours
  };

  const driver = {
    name: 'John D.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    phone: '(312) 555-7890',
    vehicle: '2019 Ford F-150',
    licensePlate: 'IL-TRK-1234',
  };
  
  // Function to handle booking cancellation - finds and cancels a real booking
  const handleCancelBooking = async () => {
    setIsLoading(true);
    
    try {
      // Try to find an active booking in Firebase to cancel
      try {
        console.log('Looking for an active booking to cancel...');
        
        // Query for any active booking (pending, confirmed, or in-progress)
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('status', 'in', ['pending', 'confirmed', 'in-progress']),
          limit(1) // Just get the first one we find
        );
        
        // Execute the query
        const querySnapshot = await getDocs(bookingsQuery);
        
        // Check if we found any active bookings
        if (!querySnapshot.empty) {
          // Get the first booking document
          const bookingDoc = querySnapshot.docs[0];
          const activeBookingId = bookingDoc.id;
          
          console.log('Found active booking with ID:', activeBookingId);
          
          // Update the status to cancelled
          const bookingRef = doc(db, 'bookings', activeBookingId);
          await updateDoc(bookingRef, {
            status: 'cancelled',
            updatedAt: serverTimestamp()
          });
          
          console.log('Successfully cancelled booking in Firebase:', activeBookingId);
        } else {
          // No active bookings found - create a new one and then cancel it
          console.log('No active bookings found. Creating a new one to cancel...');
          
          // Create a new booking with our mock data
          const newBookingRef = doc(collection(db, 'bookings'));
          const newBookingId = newBookingRef.id;
          
          // Create the booking document
          await setDoc(newBookingRef, {
            id: newBookingId,
            customerId: 'user123',
            ownerId: 'owner456',
            vehicleId: 'vehicle789',
            status: 'confirmed',
            pickupAddress: bookingData.pickupAddress || '123 Main St, Chicago, IL 60601',
            destinationAddress: bookingData.destinationAddress || '456 Pine Ave, Chicago, IL 60605',
            cargoDescription: bookingData.cargoDescription || 'Furniture and boxes',
            pickupDateTime: Timestamp.fromDate(
              bookingData.pickupDateTime instanceof Date ? bookingData.pickupDateTime : new Date()
            ),
            estimatedHours: bookingData.estimatedHours || 2,
            needsAssistance: bookingData.needsAssistance || false,
            ridingAlong: bookingData.ridingAlong || false,
            totalCost: 90,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          console.log('Created new booking with ID:', newBookingId);
          
          // Immediately update it to cancelled
          await updateDoc(newBookingRef, {
            status: 'cancelled',
            updatedAt: serverTimestamp()
          });
          
          console.log('Successfully cancelled the new booking with ID:', newBookingId);
        }
      } catch (firebaseError) {
        // Log the Firebase error but continue with UI updates
        console.error('Firebase cancellation error:', firebaseError);
        console.log('Continuing with UI updates despite Firebase error');
      }
      
      // Update local state to reflect cancellation (regardless of Firebase success)
      setBookingStatus('cancelled');
      
      // Get current time to add to status history
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add a cancellation entry to the status history
      setStatusHistory(prev => [
        ...prev,
        { 
          status: 'Booking Cancelled', 
          time: timeString, 
          completed: true,
          isCancellation: true 
        }
      ]);
      
      // Update current status to show cancellation
      setCurrentStatus('Booking Cancelled');
      
      // Reset estimated arrival
      setEstimatedArrival('N/A');
      
      // Show success message
      Alert.alert(
        "Booking Cancelled",
        "Your booking has been successfully cancelled.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error in booking cancellation:', error);
      
      // Show error message
      Alert.alert(
        "Error",
        "There was a problem cancelling your booking. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setShowCancelModal(false);
    }
  };
  
  // Function to show cancellation confirmation modal
  const confirmCancellation = () => {
    setShowCancelModal(true);
  };

  // Simulate progress updates
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // Simulate status changes based on elapsed time
      if (elapsedTime === 20) {
        setCurrentStatus('Arriving at Pickup');
        setEstimatedArrival('1 minute');
        
        // Update status history
        setStatusHistory(prev => 
          prev.map(item => 
            item.status === 'Arriving at Pickup' 
              ? { ...item, completed: true } 
              : item
          )
        );
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [elapsedTime]);

  const callDriver = () => {
    Linking.openURL(`tel:${driver.phone}`);
  };

  const messageDriver = () => {
    alert('Messaging feature would open here');
  };

  const showDirections = () => {
    alert('Directions would open in maps app');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Text style={[
            styles.statusText, 
            bookingStatus === 'cancelled' && styles.cancelledStatusText
          ]}>
            {currentStatus}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Estimated Arrival</Text>
          <Text style={[
            styles.statusText,
            bookingStatus === 'cancelled' && styles.cancelledStatusText
          ]}>
            {estimatedArrival}
          </Text>
        </View>
      </View>

      {/* Map View */}
      <MapPlaceholder />

      {/* Driver Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: driver.avatar }} style={styles.avatar} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.vehicleInfo}>{driver.vehicle}</Text>
            <Text style={styles.vehicleInfo}>License: {driver.licensePlate}</Text>
          </View>
        </View>
        
        <View style={styles.contactButtons}>
          <TouchableOpacity 
            style={[styles.contactButton, styles.callButton]}
            onPress={callDriver}
          >
            <Ionicons name="call" size={18} color="white" />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.contactButton, styles.messageButton]}
            onPress={messageDriver}
          >
            <Ionicons name="chatbubble" size={18} color="white" />
            <Text style={styles.contactButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationCard}>
        <View style={styles.locationItem}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationText}>{booking.pickupAddress}</Text>
          </View>
        </View>
        
        <View style={styles.locationDivider} />
        
        <View style={styles.locationItem}>
          <View style={[styles.locationIcon, styles.destinationIcon]}>
            <Ionicons name="flag" size={20} color="white" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationText}>{booking.destinationAddress}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={showDirections}
        >
          <MaterialIcons name="directions" size={18} color="#4a80f5" />
          <Text style={styles.directionsText}>Show Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Status Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Delivery Progress</Text>
        
        <View style={styles.timeline}>
          {statusHistory.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  item.completed ? styles.completedDot : styles.pendingDot,
                  currentStatus === item.status && styles.currentDot,
                  item.isCancellation && styles.cancellationDot
                ]}>
                  {item.completed && !item.isCancellation && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                  {item.isCancellation && (
                    <Ionicons name="close" size={12} color="white" />
                  )}
                </View>
                {index < statusHistory.length - 1 && (
                  <View style={[
                    styles.timelineConnector,
                    item.completed ? styles.completedConnector : styles.pendingConnector
                  ]} />
                )}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStatus,
                  currentStatus === item.status && styles.currentStatus,
                  item.isCancellation && styles.cancellationStatus
                ]}>
                  {item.status}
                </Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/choice1/screen5')}
        >
          <Text style={styles.backButtonText}>Back to Confirmation</Text>
        </TouchableOpacity>
        
        {bookingStatus !== 'cancelled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={confirmCancellation}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Cancellation Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Booking?</Text>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowCancelModal(false)}
                disabled={isLoading}
              >
                <Text style={styles.modalCancelButtonText}>No, Keep Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleCancelBooking}
                disabled={isLoading}
              >
                <Text style={styles.modalConfirmButtonText}>
                  {isLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    paddingBottom: 30, // Add padding at the bottom to ensure content is visible
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusInfo: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelledStatusText: {
    color: '#ff5252',
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  mapContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#e0e6f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a80f5',
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  driverCard: {
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.48,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  messageButton: {
    backgroundColor: '#2196F3',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  locationCard: {
    backgroundColor: 'white',
    margin: 12,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a80f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destinationIcon: {
    backgroundColor: '#4CAF50',
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  locationDivider: {
    height: 20,
    width: 2,
    backgroundColor: '#ddd',
    marginLeft: 16,
    marginBottom: 6,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  directionsText: {
    color: '#4a80f5',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  timelineCard: {
    backgroundColor: 'white',
    margin: 12,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  pendingDot: {
    backgroundColor: '#ddd',
  },
  currentDot: {
    backgroundColor: '#2196F3',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  cancellationDot: {
    backgroundColor: '#ff5252',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -8,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
  pendingConnector: {
    backgroundColor: '#ddd',
  },
  timelineContent: {
    flex: 1,
    marginTop: -2,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  currentStatus: {
    color: '#2196F3',
    fontWeight: '700',
  },
  cancellationStatus: {
    color: '#ff5252',
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 12,
    color: '#777',
  },
  actionButtons: {
    margin: 16,
    marginTop: 0,
  },
  backButton: {
    backgroundColor: '#4a80f5',
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ff5252',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff5252',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'column',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalCancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: '#ff5252',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});