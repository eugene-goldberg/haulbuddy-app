import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface TruckOwner {
  id: string;
  name: string;
  rating: number;
  distance: string;
  vehicleType: string;
  price: string;
  avatar: string;
  available: boolean;
}

export default function Choice1Screen3() {
  const [isSearching, setIsSearching] = useState(false);
  const [partners, setPartners] = useState<TruckOwner[]>([]);

  // Mock data for available truck owners
  const mockTruckOwners: TruckOwner[] = [
    {
      id: '1',
      name: 'John D.',
      rating: 4.8,
      distance: '2.3 miles away',
      vehicleType: 'Pickup Truck - Medium',
      price: '$45/hr',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      available: true
    },
    {
      id: '2',
      name: 'Sarah M.',
      rating: 4.9,
      distance: '3.7 miles away',
      vehicleType: 'Pickup Truck - Large',
      price: '$55/hr',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      available: true
    },
    {
      id: '3',
      name: 'Robert J.',
      rating: 4.6,
      distance: '5.1 miles away',
      vehicleType: 'Cargo Van',
      price: '$60/hr',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      available: true
    }
  ];

  const findPartners = () => {
    setIsSearching(true);
    
    // Simulate network request
    setTimeout(() => {
      setPartners(mockTruckOwners);
      setIsSearching(false);
    }, 2000);
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

  const selectPartner = (partner: TruckOwner) => {
    // In a real app, store the selected partner and proceed
    router.push('/choice1/screen4');
  };

  const renderPartnerItem = ({ item }: { item: TruckOwner }) => (
    <TouchableOpacity 
      style={styles.partnerCard}
      onPress={() => selectPartner(item)}
      activeOpacity={0.7}
    >
      <View style={styles.partnerHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
      
      <View style={styles.partnerDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#777" />
          <Text style={styles.detailText}>{item.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="car-outline" size={16} color="#777" />
          <Text style={styles.detailText}>{item.vehicleType}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.selectButton}
        onPress={() => selectPartner(item)}
      >
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Available Partners</Text>
      <Text style={styles.content}>
        We'll match you with truck owners in your area who can help with your move.
      </Text>
      
      {!isSearching && partners.length === 0 ? (
        <View style={styles.searchSection}>
          <TouchableOpacity
            style={styles.findButton}
            onPress={findPartners}
          >
            <Ionicons name="search" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Find Available HaulBuddy Partner</Text>
          </TouchableOpacity>
          
          <View style={styles.emptyState}>
            <Ionicons name="car" size={64} color="#4a80f5" />
            <Text style={styles.emptyStateText}>No partners found yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap the button above to search</Text>
          </View>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a80f5" />
              <Text style={styles.loadingText}>Searching for available partners...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultHeader}>
                {partners.length} {partners.length === 1 ? 'partner' : 'partners'} available
              </Text>
              <FlatList
                data={partners}
                renderItem={renderPartnerItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.partnerList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/choice1/screen2')}
        >
          <Text style={styles.secondaryButtonText}>Back to Previous Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6efff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    lineHeight: 24,
  },
  searchSection: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  findButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    width: '90%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 16,
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#555',
  },
  partnerList: {
    paddingBottom: 20,
  },
  partnerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
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
  priceContainer: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a80f5',
  },
  partnerDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  selectButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});