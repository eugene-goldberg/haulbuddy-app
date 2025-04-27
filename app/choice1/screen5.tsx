import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform,
  Linking
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function Choice1Screen5() {
  // Mock booking confirmation data
  const confirmation = {
    id: 'HB-29485',
    status: 'Pending Driver Acceptance',
    driver: {
      name: 'John D.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      phone: '(312) 555-7890',
    },
    pickup: {
      address: '123 Main St, Chicago, IL 60601',
      date: 'April 28, 2025',
      time: '2:00 PM',
    },
    expectedResponse: '15 minutes',
  };

  const callDriver = () => {
    // In a real app, this would use the Linking API to make a phone call
    Linking.openURL(`tel:${confirmation.driver.phone}`);
  };

  const messageDriver = () => {
    // In a real app, this would open a messaging screen or SMS
    alert('Messaging feature would open here');
  };

  const trackBooking = () => {
    // In a real app, this would navigate to a tracking screen
    alert('Booking tracking would open here');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.successIconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={80} color="white" />
          </View>
        </View>
        
        <Text style={styles.title}>Booking Request Sent!</Text>
        <Text style={styles.subtitle}>Confirmation #{confirmation.id}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{confirmation.status}</Text>
          </View>
          <Text style={styles.statusDescription}>
            Your booking request has been sent to {confirmation.driver.name}.
            You should receive a response within {confirmation.expectedResponse}.
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver Details</Text>
          <View style={styles.driverInfo}>
            <Image source={{ uri: confirmation.driver.avatar }} style={styles.avatar} />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{confirmation.driver.name}</Text>
              <Text style={styles.driverPhone}>{confirmation.driver.phone}</Text>
            </View>
          </View>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={[styles.contactButton, styles.callButton]}
              onPress={callDriver}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactButton, styles.messageButton]}
              onPress={messageDriver}
            >
              <Ionicons name="chatbubble" size={20} color="white" />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color="#4a80f5" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Pickup Address</Text>
              <Text style={styles.detailText}>{confirmation.pickup.address}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#4a80f5" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailText}>{confirmation.pickup.date}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#4a80f5" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailText}>{confirmation.pickup.time}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>Next Steps</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Wait for driver confirmation. You'll receive a notification when they accept.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Prepare your items for pickup at the scheduled time.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Meet your driver and complete your move.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={trackBooking}
        >
          <MaterialIcons name="location-searching" size={20} color="white" style={styles.trackIcon} />
          <Text style={styles.trackButtonText}>Track This Booking</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6efff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
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
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#fff9c4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    color: '#ff8f00',
    fontWeight: '600',
    fontSize: 14,
  },
  statusDescription: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  driverPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
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
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  nextStepsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a80f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a80f5',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 20,
  },
  trackIcon: {
    marginRight: 8,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  homeButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});