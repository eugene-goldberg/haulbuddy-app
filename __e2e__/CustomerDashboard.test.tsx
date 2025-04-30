import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render, mockAuthContext } from './test-utils';
import CustomerDashboard from '../app/choice1/customer-dashboard';
import { router } from 'expo-router';

// Mock active bookings data
const mockActiveBookings = [
  {
    id: 'booking-1',
    status: 'pending',
    pickupDateTime: {
      toDate: () => new Date(2025, 3, 20)
    },
    pickupAddress: '123 Main St, Chicago, IL',
    destinationAddress: '456 Pine St, Chicago, IL',
    ownerId: 'owner-1',
    customerId: 'test-uid',
    createdAt: { toDate: () => new Date(2025, 3, 15) },
    updatedAt: { toDate: () => new Date(2025, 3, 15) }
  },
  {
    id: 'booking-2',
    status: 'confirmed',
    pickupDateTime: {
      toDate: () => new Date(2025, 3, 22)
    },
    pickupAddress: '789 Oak St, Chicago, IL',
    destinationAddress: '101 Elm St, Chicago, IL',
    ownerId: 'owner-2',
    customerId: 'test-uid',
    createdAt: { toDate: () => new Date(2025, 3, 16) },
    updatedAt: { toDate: () => new Date(2025, 3, 17) }
  }
];

// Mock past bookings data
const mockPastBookings = [
  {
    id: 'booking-3',
    status: 'completed',
    pickupDateTime: {
      toDate: () => new Date(2025, 2, 10)
    },
    ownerId: 'owner-1',
    customerId: 'test-uid',
    createdAt: { toDate: () => new Date(2025, 2, 5) },
    completedAt: { toDate: () => new Date(2025, 2, 10) }
  }
];

// Mock the booking service
jest.mock('../services/booking-service', () => ({
  getActiveBookings: jest.fn(() => Promise.resolve(mockActiveBookings)),
  getPastBookings: jest.fn(() => Promise.resolve(mockPastBookings)),
}));

describe('Customer Dashboard Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state and then shows active bookings', async () => {
    const { getByText, findByText } = render(<CustomerDashboard />);
    
    // Verify loading state is shown initially
    expect(getByText('Loading your bookings...')).toBeTruthy();
    
    // Wait for bookings to load
    await findByText('Pending Confirmation');
    await findByText('Confirmed');
    
    // Verify active bookings section is displayed
    expect(getByText('Active Bookings')).toBeTruthy();
    
    // Verify booking history section is displayed
    expect(getByText('Booking History')).toBeTruthy();
    
    // Verify booking service was called with the correct user ID
    const { getActiveBookings, getPastBookings } = require('../services/booking-service');
    expect(getActiveBookings).toHaveBeenCalledWith(mockAuthContext.user.uid);
    expect(getPastBookings).toHaveBeenCalledWith(mockAuthContext.user.uid);
  });

  it('navigates to booking details when a booking is tapped', async () => {
    const { findByText, getAllByText } = render(<CustomerDashboard />);
    
    // Wait for bookings to load
    await findByText('Pending Confirmation');
    
    // Find all booking cards 
    const pendingBooking = await findByText('Pending Confirmation');
    
    // Get the parent booking card element and tap it
    const bookingCard = pendingBooking.parentNode.parentNode;
    fireEvent.press(bookingCard);
    
    // Verify navigation to tracking screen
    expect(router.push).toHaveBeenCalledWith('/choice1/tracking');
  });

  it('allows the user to create a new booking', async () => {
    const { findByText } = render(<CustomerDashboard />);
    
    // Wait for the New Booking button to appear
    const newBookingButton = await findByText('New Booking');
    
    // Tap the new booking button
    fireEvent.press(newBookingButton);
    
    // Verify navigation to the booking flow
    expect(router.push).toHaveBeenCalledWith('/choice1/screen1');
  });

  it('displays track button that navigates to tracking screen', async () => {
    const { findAllByText } = render(<CustomerDashboard />);
    
    // Wait for the Track buttons to appear
    const trackButtons = await findAllByText('Track');
    expect(trackButtons.length).toBeGreaterThan(0);
    
    // Tap the first Track button
    fireEvent.press(trackButtons[0]);
    
    // Verify navigation to tracking screen
    expect(router.push).toHaveBeenCalledWith('/choice1/tracking');
  });

  it('displays empty state when no active bookings', async () => {
    // Override mock to return empty bookings array
    const { getActiveBookings } = require('../services/booking-service');
    getActiveBookings.mockImplementationOnce(() => Promise.resolve([]));
    
    const { findByText } = render(<CustomerDashboard />);
    
    // Wait for empty state text to appear
    const emptyStateText = await findByText('No active bookings');
    expect(emptyStateText).toBeTruthy();
    
    // Verify empty state subtext
    expect(await findByText('Your current bookings will appear here')).toBeTruthy();
  });
});