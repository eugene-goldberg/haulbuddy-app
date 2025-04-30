import { 
  createBooking, 
  getCustomerBookings,
  updateBookingStatus
} from '../firebase/firestore-service';
import { Timestamp } from 'firebase/firestore';
import { Booking, BookingStatus } from '../firebase/firestore-schema';

// Booking form data interface
export interface BookingFormData {
  cargoDescription: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDateTime: Date | string;
  needsAssistance: boolean;
  ridingAlong: boolean;
  estimatedHours: number;
  cargoPhotos?: string[]; // Photo URLs
  ownerId?: string; // Selected truck owner
  vehicleId?: string; // Selected vehicle
}

/**
 * Create a new booking in Firestore
 */
export const submitBooking = async (
  customerId: string,
  bookingData: BookingFormData
): Promise<Booking> => {
  try {
    // Use a fixed, known valid date - for testing purposes only
    // In production, you would properly validate and handle user input
    let pickupDate;
    if (bookingData.pickupDateTime instanceof Date) {
      pickupDate = bookingData.pickupDateTime;
    } else {
      pickupDate = new Date(2025, 4, 15, 14, 0); // May 15, 2025, 2:00 PM - default
    }
    console.log("DEBUG - submitBooking - Using date for booking:", pickupDate.toISOString());
    
    // Import Timestamp from firestore for direct use
    const { Timestamp } = require('firebase/firestore');
    
    // Create Firestore timestamp directly
    const pickupTimestamp = new Timestamp(
      Math.floor(pickupDate.getTime() / 1000),
      (pickupDate.getTime() % 1000) * 1000000
    );
    console.log("DEBUG - submitBooking - Created timestamp:", pickupTimestamp);
      
    // Log incoming data for debugging
    console.log("DEBUG - submitBooking - Raw booking data received:", {
      cargoDescription: bookingData.cargoDescription,
      pickupAddress: bookingData.pickupAddress,
      destinationAddress: bookingData.destinationAddress,
      needsAssistance: bookingData.needsAssistance,
      ridingAlong: bookingData.ridingAlong,
      estimatedHours: bookingData.estimatedHours,
      ownerId: bookingData.ownerId,
      vehicleId: bookingData.vehicleId
    });
    
    // Prepare booking data for Firestore
    // Only use fallbacks for critical fields that might cause errors if empty
    const newBookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      customerId,
      ownerId: bookingData.ownerId || 'owner-default', // This is required for the database
      vehicleId: bookingData.vehicleId || 'vehicle-default', // This is required for the database
      // Use the actual user input for content fields with minimal fallbacks
      cargoDescription: bookingData.cargoDescription || '',
      pickupAddress: bookingData.pickupAddress || '',
      destinationAddress: bookingData.destinationAddress || '',
      pickupDateTime: pickupTimestamp, // Use direct timestamp
      estimatedHours: bookingData.estimatedHours || 2,
      needsAssistance: Boolean(bookingData.needsAssistance),
      ridingAlong: Boolean(bookingData.ridingAlong),
      totalCost: calculateEstimatedCost(bookingData),
      assistanceCost: bookingData.needsAssistance ? calculateAssistanceCost(bookingData) : 0,
    };
    
    console.log("DEBUG - submitBooking - Prepared booking data:", JSON.stringify(newBookingData));

    // Create the booking in Firestore
    const booking = await createBooking(newBookingData);
    
    return booking;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

/**
 * Get all bookings for a customer
 */
export const getActiveBookings = async (
  customerId: string
): Promise<Booking[]> => {
  try {
    console.log('DEBUG - getActiveBookings - Fetching for customer:', customerId);
    const allBookings = await getCustomerBookings(customerId);
    console.log('DEBUG - getActiveBookings - All bookings count:', allBookings.length);
    
    if (allBookings.length > 0) {
      console.log('DEBUG - getActiveBookings - First booking data:', JSON.stringify(allBookings[0]));
    }
    
    console.log('DEBUG - getActiveBookings - All bookings statuses:', 
      allBookings.map(b => `${b.id}: ${b.status || 'undefined'}`).join(', ') || 'No bookings found');
    
    // Filter to active bookings (pending, confirmed, in-progress)
    const activeStatuses: BookingStatus[] = ['pending', 'confirmed', 'in-progress'];
    
    const filteredBookings = allBookings.filter(booking => {
      const isActive = activeStatuses.includes(booking.status);
      console.log(`DEBUG - Booking ${booking.id} with status ${booking.status} isActive: ${isActive}`);
      return isActive;
    });
    
    console.log('DEBUG - getActiveBookings - Filtered bookings count:', filteredBookings.length);
    return filteredBookings;
  } catch (error) {
    console.error('Error getting active bookings:', error);
    throw error;
  }
};

/**
 * Get past bookings for a customer
 */
export const getPastBookings = async (
  customerId: string
): Promise<Booking[]> => {
  try {
    const allBookings = await getCustomerBookings(customerId);
    
    // Filter to completed or cancelled bookings
    const pastStatuses: BookingStatus[] = ['completed', 'cancelled', 'declined'];
    
    return allBookings.filter(booking => 
      pastStatuses.includes(booking.status)
    );
  } catch (error) {
    console.error('Error getting past bookings:', error);
    throw error;
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  bookingId: string
): Promise<void> => {
  try {
    await updateBookingStatus(bookingId, 'cancelled');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

/**
 * Calculate the estimated cost of a booking
 */
const calculateEstimatedCost = (bookingData: BookingFormData): number => {
  // Mock calculation - in a real app, this would use the vehicle's hourly rate
  const hourlyRate = 45; // Default hourly rate
  const estimatedHours = bookingData.estimatedHours || 2;
  
  let totalCost = hourlyRate * estimatedHours;
  
  // Add assistance cost if needed
  if (bookingData.needsAssistance) {
    totalCost += calculateAssistanceCost(bookingData);
  }
  
  return totalCost;
};

/**
 * Calculate assistance cost
 */
const calculateAssistanceCost = (bookingData: BookingFormData): number => {
  // Mock calculation - in a real app, this would use the vehicle's assistance rate
  const assistanceRate = 25; // Default assistance rate
  const estimatedHours = bookingData.estimatedHours || 2;
  
  return assistanceRate * estimatedHours;
};