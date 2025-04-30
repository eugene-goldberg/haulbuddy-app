import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BookingFormData } from '../services/booking-service';

// Initial booking form data
const initialBookingFormData: BookingFormData = {
  cargoDescription: '',
  pickupAddress: '',
  destinationAddress: '',
  pickupDateTime: new Date(2025, 4, 15, 14, 0), // May 15, 2025, 2:00 PM - Fixed valid date
  needsAssistance: false,
  ridingAlong: true,
  estimatedHours: 2,
  cargoPhotos: [],
};

// Interface for our booking context
interface BookingContextType {
  bookingData: BookingFormData;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  resetBookingData: () => void;
}

// Create context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider component
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingFormData>(initialBookingFormData);

  // Update booking data
  const updateBookingData = (data: Partial<BookingFormData>) => {
    setBookingData(prevData => ({
      ...prevData,
      ...data,
    }));
  };

  // Reset booking data to initial state
  const resetBookingData = () => {
    setBookingData(initialBookingFormData);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        resetBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook to use the booking context
export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}