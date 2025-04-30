import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

// Mock booking data for testing
const mockBookings = [
  {
    id: 'booking-1',
    status: 'pending',
    pickupAddress: '123 Main St',
    destinationAddress: '456 Pine Ave',
    date: 'April 30, 2025',
    time: '2:00 PM'
  },
  {
    id: 'booking-2',
    status: 'confirmed',
    pickupAddress: '789 Oak Blvd',
    destinationAddress: '321 Maple Dr',
    date: 'May 2, 2025',
    time: '10:00 AM'
  }
];

// Simplified Dashboard Component
const SimpleDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching bookings from an API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setBookings(mockBookings);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const handleNewBooking = () => {
    router.push('/choice1/screen1');
  };
  
  const viewBookingDetails = (bookingId) => {
    router.push('/choice1/tracking');
  };
  
  const renderBookingItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => viewBookingDetails(item.id)} 
      testID={`booking-${item.id}`}
    >
      <View>
        <Text>{item.status}</Text>
        <Text>From: {item.pickupAddress}</Text>
        <Text>To: {item.destinationAddress}</Text>
        <Text>{item.date} at {item.time}</Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/choice1/tracking')}
          testID={`track-${item.id}`}
        >
          <Text>Track</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View>
      <Text>Customer Dashboard</Text>
      
      <TouchableOpacity onPress={handleNewBooking} testID="new-booking-button">
        <Text>New Booking</Text>
      </TouchableOpacity>
      
      {isLoading ? (
        <Text testID="loading-indicator">Loading bookings...</Text>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          testID="bookings-list"
        />
      ) : (
        <View testID="empty-state">
          <Text>No active bookings</Text>
          <Text>Your current bookings will appear here</Text>
        </View>
      )}
    </View>
  );
};

describe('Simple Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('shows loading state and then displays bookings', async () => {
    const { getByTestId, findByTestId } = render(<SimpleDashboard />);
    
    // Should show loading initially
    expect(getByTestId('loading-indicator')).toBeTruthy();
    
    // Wait for bookings to load
    await findByTestId('bookings-list');
    
    // Verify both booking items are rendered
    await findByTestId('booking-booking-1');
    await findByTestId('booking-booking-2');
  });
  
  it('navigates to new booking flow when button is pressed', async () => {
    const { getByTestId, findByTestId } = render(<SimpleDashboard />);
    
    // Wait for dashboard to load
    await findByTestId('bookings-list');
    
    // Press new booking button
    fireEvent.press(getByTestId('new-booking-button'));
    
    // Verify navigation to booking screen
    expect(router.push).toHaveBeenCalledWith('/choice1/screen1');
  });
  
  it('navigates to tracking screen when a booking is selected', async () => {
    const { findByTestId } = render(<SimpleDashboard />);
    
    // Wait for bookings to load and find first booking
    const bookingItem = await findByTestId('booking-booking-1');
    
    // Press the booking
    fireEvent.press(bookingItem);
    
    // Verify navigation to tracking screen
    expect(router.push).toHaveBeenCalledWith('/choice1/tracking');
  });
  
  it('navigates to tracking screen when track button is pressed', async () => {
    const { findByTestId } = render(<SimpleDashboard />);
    
    // Wait for bookings to load and find track button for first booking
    const trackButton = await findByTestId('track-booking-1');
    
    // Press the track button
    fireEvent.press(trackButton);
    
    // Verify navigation to tracking screen
    expect(router.push).toHaveBeenCalledWith('/choice1/tracking');
  });
});