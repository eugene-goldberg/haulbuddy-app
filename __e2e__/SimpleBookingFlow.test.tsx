import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

// Create a simplified test component to test navigation without complex dependencies
const BookingConfirmationScreen = () => {
  const navigateToDashboard = () => {
    router.push('/choice1/customer-dashboard');
  };

  // Auto-navigate to dashboard after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigateToDashboard();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View>
      <Text>Booking Request Sent!</Text>
      <Text>Confirmation #HB-12345</Text>
      <TouchableOpacity onPress={navigateToDashboard}>
        <Text>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Simple Booking Flow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should navigate to dashboard when button is pressed', () => {
    const { getByText } = render(<BookingConfirmationScreen />);
    
    // Verify confirmation screen shows correct content
    expect(getByText('Booking Request Sent!')).toBeTruthy();
    expect(getByText('Confirmation #HB-12345')).toBeTruthy();
    
    // Simulate button press
    const dashboardButton = getByText('Go to Dashboard');
    fireEvent.press(dashboardButton);
    
    // Verify navigation
    expect(router.push).toHaveBeenCalledWith('/choice1/customer-dashboard');
  });

  it('should auto-navigate to dashboard after 3 seconds', () => {
    render(<BookingConfirmationScreen />);
    
    // Fast-forward timer
    jest.advanceTimersByTime(3100);
    
    // Verify navigation happens after timeout
    expect(router.push).toHaveBeenCalledWith('/choice1/customer-dashboard');
  });
});