import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render, mockBookingContext } from './test-utils';
import Screen1 from '../app/choice1/screen1';
import Screen4 from '../app/choice1/screen4';
import Screen5 from '../app/choice1/screen5';
import { router } from 'expo-router';

// Mock the booking service
jest.mock('../services/booking-service', () => ({
  submitBooking: jest.fn(() => Promise.resolve({
    id: 'booking-123',
    status: 'pending',
    customerId: 'test-uid',
    ownerId: 'owner-456',
    vehicleId: 'vehicle-789',
    createdAt: new Date(),
  })),
  getActiveBookings: jest.fn(() => Promise.resolve([])),
  getPastBookings: jest.fn(() => Promise.resolve([])),
}));

// Set up test data for the booking context
const testBookingData = {
  cargoDescription: 'Moving furniture and boxes',
  pickupAddress: '123 Main St, Chicago, IL',
  destinationAddress: '456 Oak Ave, Chicago, IL',
  pickupDateTime: new Date(2025, 4, 15, 14, 0),
  needsAssistance: true,
  ridingAlong: false,
  estimatedHours: 2
};

describe('Booking Flow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows users to enter pickup and destination addresses in screen1', () => {
    // Custom setBookingData implementation to verify data is set correctly
    const setBookingData = jest.fn();
    
    const { getByPlaceholderText, getByText } = render(
      <Screen1 />,
      {
        customBookingContext: {
          ...mockBookingContext,
          bookingData: {},
          setBookingData
        }
      }
    );
    
    // Find address inputs
    const pickupInput = getByPlaceholderText('Enter pickup address');
    const destinationInput = getByPlaceholderText('Enter destination address');
    
    // Enter addresses
    fireEvent.changeText(pickupInput, '123 Main St, Chicago, IL');
    fireEvent.changeText(destinationInput, '456 Oak Ave, Chicago, IL');
    
    // Press the next button
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Verify booking data was updated with addresses
    expect(setBookingData).toHaveBeenCalledWith(expect.objectContaining({
      pickupAddress: '123 Main St, Chicago, IL',
      destinationAddress: '456 Oak Ave, Chicago, IL'
    }));
    
    // Verify navigation to next screen
    expect(router.push).toHaveBeenCalledWith('/choice1/screen2');
  });

  it('submits the booking on screen4 and navigates to confirmation', async () => {
    const { getByText } = render(
      <Screen4 />,
      {
        customBookingContext: {
          bookingData: testBookingData
        }
      }
    );
    
    // Find and press the request booking button
    const requestButton = getByText(/Request Booking/);
    fireEvent.press(requestButton);
    
    // Verify booking service was called
    await waitFor(() => {
      const { submitBooking } = require('../services/booking-service');
      expect(submitBooking).toHaveBeenCalled();
    });
    
    // Check navigation to confirmation screen
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/choice1/screen5');
    });
  });

  it('shows booking confirmation and redirects to dashboard', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<Screen5 />);
    
    // Verify confirmation screen content
    expect(getByText('Booking Request Sent!')).toBeTruthy();
    expect(getByText('Go to Dashboard')).toBeTruthy();
    
    // Test the manual navigation to dashboard
    const dashboardButton = getByText('Go to Dashboard');
    fireEvent.press(dashboardButton);
    
    expect(router.push).toHaveBeenCalledWith('/choice1/customer-dashboard');
    
    // Reset mocks to test automatic navigation
    jest.clearAllMocks();
    
    // Fast-forward timer to trigger the auto-navigation
    jest.advanceTimersByTime(3100);
    
    // Verify auto-navigation to dashboard
    expect(router.push).toHaveBeenCalledWith('/choice1/customer-dashboard');
    
    jest.useRealTimers();
  });

  it('handles full booking flow from screen1 to dashboard', async () => {
    jest.useFakeTimers();
    
    // Step 1: Start with screen1
    const setBookingData = jest.fn();
    const { getByPlaceholderText, getByText, rerender } = render(
      <Screen1 />,
      {
        customBookingContext: {
          bookingData: {},
          setBookingData
        }
      }
    );
    
    // Fill in screen1 form
    const pickupInput = getByPlaceholderText('Enter pickup address');
    const destinationInput = getByPlaceholderText('Enter destination address');
    
    fireEvent.changeText(pickupInput, '123 Main St, Chicago, IL');
    fireEvent.changeText(destinationInput, '456 Oak Ave, Chicago, IL');
    
    // Move to next screen
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    expect(router.push).toHaveBeenCalledWith('/choice1/screen2');
    
    // Clear router mock for next steps
    jest.clearAllMocks();
    
    // Step 2: Jump to screen4 (skipping screen2 and screen3 for test simplicity)
    rerender(
      <Screen4 />,
      {
        customBookingContext: {
          bookingData: testBookingData,
          setBookingData
        }
      }
    );
    
    // Submit booking
    const requestButton = getByText(/Request Booking/);
    fireEvent.press(requestButton);
    
    // Check booking submission
    await waitFor(() => {
      const { submitBooking } = require('../services/booking-service');
      expect(submitBooking).toHaveBeenCalled();
    });
    
    // Verify navigation to confirmation
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/choice1/screen5');
    });
    
    // Clear router mock for confirmation screen
    jest.clearAllMocks();
    
    // Step 3: Confirmation screen
    rerender(<Screen5 />);
    
    // Verify we see confirmation page
    expect(getByText('Booking Request Sent!')).toBeTruthy();
    
    // Test auto-navigation to dashboard
    jest.advanceTimersByTime(3100);
    
    // Verify navigation to dashboard
    expect(router.push).toHaveBeenCalledWith('/choice1/customer-dashboard');
    
    jest.useRealTimers();
  });
});