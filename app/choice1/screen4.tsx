import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function Choice1Screen4() {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestComplete, setRequestComplete] = useState(false);
  
  // Mock driver data - in a real app, this would come from route params or a context
  const driver = {
    id: '1',
    name: 'John D.',
    rating: 4.8,
    tripsCompleted: 124,
    memberSince: 'Apr 2023',
    responseTime: '~15 minutes',
    vehicleType: 'Pickup Truck - Medium',
    vehicleDetails: '2019 Ford F-150, Clean record',
    price: '$45/hr',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };
  
  // Mock booking details - in a real app, this would come from form data
  const bookingDetails = {
    pickup: '123 Main St, Chicago, IL 60601',
    destination: '456 Pine Ave, Chicago, IL 60605',
    datetime: 'April 28, 2025 at 2:00 PM',
    cargoDescription: 'Moving a small sofa and dining table',
    needsAssistance: true,
  };
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`star-${i}`} name="star" size={16} color="#FFD700" style={styles.star} />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FontAwesome key="half-star" name="star-half-o" size={16} color="#FFD700" style={styles.star} />
      );
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome key={`empty-star-${i}`} name="star-o" size={16} color="#FFD700" style={styles.star} />
      );
    }

    return stars;
  };
  
  const requestBooking = () => {
    setIsRequesting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsRequesting(false);
      setRequestComplete(true);
      
      // Navigate to confirmation after brief delay
      setTimeout(() => {
        router.push('/choice1/screen5');
      }, 1500);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Booking Details</Text>
        
        {/* Driver Information */}
        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <Image source={{ uri: driver.avatar }} style={styles.avatar} />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.ratingContainer}>
                {renderRatingStars(driver.rating)}
                <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.driverDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="car-outline" size={18} color="#555" />
                <Text style={styles.detailText}>{driver.vehicleType}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={18} color="#555" />
                <Text style={styles.detailText}>{driver.price}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="history" size={18} color="#555" />
                <Text style={styles.detailText}>{driver.tripsCompleted} trips</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={18} color="#555" />
                <Text style={styles.detailText}>Responds in {driver.responseTime}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="information-circle-outline" size={18} color="#555" />
              <Text style={styles.detailText}>{driver.vehicleDetails}</Text>
            </View>
          </View>
        </View>
        
        {/* Booking Summary */}
        <View style={styles.bookingSummary}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          
          <View style={styles.summaryItem}>
            <Ionicons name="location-outline" size={20} color="#4a80f5" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Pickup Location</Text>
              <Text style={styles.summaryText}>{bookingDetails.pickup}</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="navigate-outline" size={20} color="#4a80f5" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Destination</Text>
              <Text style={styles.summaryText}>{bookingDetails.destination}</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={20} color="#4a80f5" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Date & Time</Text>
              <Text style={styles.summaryText}>{bookingDetails.datetime}</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="cube-outline" size={20} color="#4a80f5" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Cargo Description</Text>
              <Text style={styles.summaryText}>{bookingDetails.cargoDescription}</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="people-outline" size={20} color="#4a80f5" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Loading Assistance</Text>
              <Text style={styles.summaryText}>{bookingDetails.needsAssistance ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>
        
        {/* Price Estimate */}
        <View style={styles.priceEstimate}>
          <Text style={styles.sectionTitle}>Price Estimate</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Hourly Rate</Text>
              <Text style={styles.priceValue}>{driver.price}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Estimated Duration</Text>
              <Text style={styles.priceValue}>2 hours</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>$90.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {requestComplete ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            <Text style={styles.successText}>Booking Request Sent!</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={requestBooking}
              disabled={isRequesting}
            >
              {isRequesting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.requestButtonText}>Request Booking from {driver.name}</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/choice1/screen3')}
              disabled={isRequesting}
            >
              <Text style={styles.secondaryButtonText}>Back to Partner Search</Text>
            </TouchableOpacity>
          </>
        )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  driverCard: {
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
  driverHeader: {
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
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
  driverDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  bookingSummary: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 15,
    color: '#333',
  },
  priceEstimate: {
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
  priceBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#555',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a80f5',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  requestButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 16,
    borderRadius: 8,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
});