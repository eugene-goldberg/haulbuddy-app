import React from 'react';
import { BookingContext } from '../contexts/BookingContext';

export const mockBookingContext = {
  bookingData: {
    cargoDescription: 'Moving a small sofa and dining table',
    pickupAddress: '123 Main St, Chicago, IL 60601',
    destinationAddress: '456 Pine Ave, Chicago, IL 60605',
    pickupDateTime: new Date(2025, 4, 15, 14, 0),
    needsAssistance: true,
    ridingAlong: false,
    estimatedHours: 2
  },
  setBookingData: jest.fn(),
  resetBookingData: jest.fn(),
};

export const BookingContextProvider: React.FC = ({ children }) => (
  <BookingContext.Provider value={mockBookingContext}>
    {children}
  </BookingContext.Provider>
);

export default mockBookingContext;