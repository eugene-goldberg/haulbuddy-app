// Mock the firestore service first
jest.mock('../firebase/firestore-service', () => ({
  createBooking: jest.fn(),
  getCustomerBookings: jest.fn(),
  updateBookingStatus: jest.fn(),
}));

// Import after mocking
import { 
  submitBooking, 
  getActiveBookings, 
  getPastBookings, 
  cancelBooking 
} from '../services/booking-service';
import { 
  createBooking, 
  getCustomerBookings, 
  updateBookingStatus 
} from '../firebase/firestore-service';
import { Booking, BookingStatus } from '../firebase/firestore-schema';

// Mock booking data
const mockBookingFormData = {
  cargoDescription: 'Moving furniture',
  pickupAddress: '123 Main St',
  destinationAddress: '456 Elm St',
  pickupDateTime: new Date('2025-05-15T14:00:00'),
  needsAssistance: true,
  ridingAlong: false,
  estimatedHours: 2,
  ownerId: 'owner-123',
  vehicleId: 'vehicle-123'
};

const mockBooking: Booking = {
  id: 'booking-123',
  customerId: 'customer-123',
  ownerId: 'owner-123',
  vehicleId: 'vehicle-123',
  cargoDescription: 'Moving furniture',
  pickupAddress: '123 Main St',
  destinationAddress: '456 Elm St',
  pickupDateTime: { toDate: () => new Date('2025-05-15T14:00:00') } as any,
  estimatedHours: 2,
  needsAssistance: true,
  ridingAlong: false,
  totalCost: 110,
  assistanceCost: 40,
  status: 'pending',
  createdAt: { toDate: () => new Date() } as any,
  updatedAt: { toDate: () => new Date() } as any
};

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Booking Service', () => {
  
  test('submitBooking creates a new booking', async () => {
    // Mock createBooking to return a booking
    (createBooking as jest.Mock).mockResolvedValue(mockBooking);
    
    // Call the function
    const result = await submitBooking('customer-123', mockBookingFormData);
    
    // Verify the result
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockBooking);
    
    // Check parameters passed to createBooking
    const createBookingArg = (createBooking as jest.Mock).mock.calls[0][0];
    expect(createBookingArg).toHaveProperty('customerId', 'customer-123');
    expect(createBookingArg).toHaveProperty('ownerId', 'owner-123');
    expect(createBookingArg).toHaveProperty('vehicleId', 'vehicle-123');
    expect(createBookingArg).toHaveProperty('cargoDescription', 'Moving furniture');
    expect(createBookingArg).toHaveProperty('totalCost');
    expect(createBookingArg).toHaveProperty('assistanceCost');
  });

  test('submitBooking handles missing fields', async () => {
    // Mock createBooking to return a booking
    (createBooking as jest.Mock).mockResolvedValue(mockBooking);
    
    // Create booking data with missing fields
    const incompleteData = {
      cargoDescription: 'Moving furniture',
      pickupAddress: '123 Main St',
      destinationAddress: '456 Elm St',
      pickupDateTime: new Date('2025-05-15'),
      // Missing: needsAssistance, ridingAlong, estimatedHours, ownerId, vehicleId
    };
    
    // Call the function
    const result = await submitBooking('customer-123', incompleteData as any);
    
    // Verify createBooking was called with default fallback values
    const createBookingArg = (createBooking as jest.Mock).mock.calls[0][0];
    expect(createBookingArg).toHaveProperty('needsAssistance', false);
    expect(createBookingArg).toHaveProperty('ridingAlong', false);
    expect(createBookingArg).toHaveProperty('estimatedHours', 2);
    expect(createBookingArg).toHaveProperty('ownerId', 'owner-default');
    expect(createBookingArg).toHaveProperty('vehicleId', 'vehicle-default');
  });

  test('getActiveBookings returns only active bookings', async () => {
    // Create mock bookings with different statuses
    const pendingBooking = { ...mockBooking, id: 'pending-123', status: 'pending' };
    const confirmedBooking = { ...mockBooking, id: 'confirmed-123', status: 'confirmed' };
    const inProgressBooking = { ...mockBooking, id: 'inprogress-123', status: 'in-progress' };
    const completedBooking = { ...mockBooking, id: 'completed-123', status: 'completed' };
    const cancelledBooking = { ...mockBooking, id: 'cancelled-123', status: 'cancelled' };
    
    // Mock getCustomerBookings to return all bookings
    (getCustomerBookings as jest.Mock).mockResolvedValue([
      pendingBooking,
      confirmedBooking,
      inProgressBooking,
      completedBooking,
      cancelledBooking
    ]);
    
    // Call the function
    const result = await getActiveBookings('customer-123');
    
    // Verify getCustomerBookings was called
    expect(getCustomerBookings).toHaveBeenCalledWith('customer-123');
    
    // Verify only active bookings are returned
    expect(result).toHaveLength(3);
    expect(result).toContainEqual(pendingBooking);
    expect(result).toContainEqual(confirmedBooking);
    expect(result).toContainEqual(inProgressBooking);
    expect(result).not.toContainEqual(completedBooking);
    expect(result).not.toContainEqual(cancelledBooking);
  });

  test('getPastBookings returns only past bookings', async () => {
    // Create mock bookings with different statuses
    const pendingBooking = { ...mockBooking, id: 'pending-123', status: 'pending' };
    const completedBooking = { ...mockBooking, id: 'completed-123', status: 'completed' };
    const cancelledBooking = { ...mockBooking, id: 'cancelled-123', status: 'cancelled' };
    const declinedBooking = { ...mockBooking, id: 'declined-123', status: 'declined' };
    
    // Mock getCustomerBookings to return all bookings
    (getCustomerBookings as jest.Mock).mockResolvedValue([
      pendingBooking,
      completedBooking,
      cancelledBooking,
      declinedBooking
    ]);
    
    // Call the function
    const result = await getPastBookings('customer-123');
    
    // Verify getCustomerBookings was called
    expect(getCustomerBookings).toHaveBeenCalledWith('customer-123');
    
    // Verify only past bookings are returned
    expect(result).toHaveLength(3);
    expect(result).not.toContainEqual(pendingBooking);
    expect(result).toContainEqual(completedBooking);
    expect(result).toContainEqual(cancelledBooking);
    expect(result).toContainEqual(declinedBooking);
  });

  test('cancelBooking calls updateBookingStatus with cancelled status', async () => {
    // Call the function
    await cancelBooking('booking-123');
    
    // Verify updateBookingStatus was called with correct parameters
    expect(updateBookingStatus).toHaveBeenCalledWith('booking-123', 'cancelled');
  });

  test('submitBooking handles booking errors', async () => {
    // Mock createBooking to throw an error
    (createBooking as jest.Mock).mockRejectedValue(new Error('Booking failed'));
    
    // Call the function and expect it to throw
    await expect(submitBooking('customer-123', mockBookingFormData))
      .rejects
      .toThrow('Booking failed');
  });
});