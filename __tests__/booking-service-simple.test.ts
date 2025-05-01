import {
  submitBooking,
  getActiveBookings,
  getPastBookings,
  cancelBooking
} from '../services/booking-service';

describe('Booking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock the required modules
  jest.mock('../firebase/firestore-service', () => ({
    createBooking: jest.fn(),
    getCustomerBookings: jest.fn(),
    updateBookingStatus: jest.fn()
  }));

  test('submitBooking creates a new booking', async () => {
    // Import and configure mocks
    const { createBooking } = require('../firebase/firestore-service');
    
    // Mock successful booking creation
    const mockBooking = {
      id: 'booking-123',
      customerId: 'customer-123',
      status: 'pending',
      cargoDescription: 'Moving furniture',
      // Other booking properties
    };
    createBooking.mockResolvedValueOnce(mockBooking);
    
    // Test data
    const bookingData = {
      cargoDescription: 'Moving furniture',
      pickupAddress: '123 Main St',
      destinationAddress: '456 Elm St',
      pickupDateTime: new Date('2025-05-15'),
      needsAssistance: true,
      ridingAlong: false,
      estimatedHours: 2,
      ownerId: 'owner-123',
      vehicleId: 'vehicle-123'
    };
    
    // Call the function
    const result = await submitBooking('customer-123', bookingData);
    
    // Verify result
    expect(result).toEqual(mockBooking);
    
    // Verify createBooking was called with correct data
    expect(createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'customer-123',
        cargoDescription: 'Moving furniture',
        ownerId: 'owner-123',
        vehicleId: 'vehicle-123',
        needsAssistance: true
      })
    );
  });

  test('getActiveBookings returns only active bookings', async () => {
    // Import and configure mocks
    const { getCustomerBookings } = require('../firebase/firestore-service');
    
    // Mock bookings with various statuses
    const mockBookings = [
      { id: 'b1', status: 'pending', customerId: 'customer-123' },
      { id: 'b2', status: 'confirmed', customerId: 'customer-123' },
      { id: 'b3', status: 'in-progress', customerId: 'customer-123' },
      { id: 'b4', status: 'completed', customerId: 'customer-123' },
      { id: 'b5', status: 'cancelled', customerId: 'customer-123' }
    ];
    
    getCustomerBookings.mockResolvedValueOnce(mockBookings);
    
    // Call the function
    const result = await getActiveBookings('customer-123');
    
    // Verify only active bookings are returned
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('b1');
    expect(result[1].id).toBe('b2');
    expect(result[2].id).toBe('b3');
    
    // Verify function was called with correct customer ID
    expect(getCustomerBookings).toHaveBeenCalledWith('customer-123');
  });

  test('getPastBookings returns only past bookings', async () => {
    // Import and configure mocks
    const { getCustomerBookings } = require('../firebase/firestore-service');
    
    // Mock bookings with various statuses
    const mockBookings = [
      { id: 'b1', status: 'pending', customerId: 'customer-123' },
      { id: 'b2', status: 'completed', customerId: 'customer-123' },
      { id: 'b3', status: 'cancelled', customerId: 'customer-123' },
      { id: 'b4', status: 'declined', customerId: 'customer-123' }
    ];
    
    getCustomerBookings.mockResolvedValueOnce(mockBookings);
    
    // Call the function
    const result = await getPastBookings('customer-123');
    
    // Verify only past bookings are returned
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('b2');
    expect(result[1].id).toBe('b3');
    expect(result[2].id).toBe('b4');
    
    // Verify function was called with correct customer ID
    expect(getCustomerBookings).toHaveBeenCalledWith('customer-123');
  });

  test('cancelBooking updates booking status', async () => {
    // Import and configure mocks
    const { updateBookingStatus } = require('../firebase/firestore-service');
    
    // Mock successful update
    updateBookingStatus.mockResolvedValueOnce(undefined);
    
    // Call the function
    await cancelBooking('booking-123');
    
    // Verify function was called with correct booking ID and status
    expect(updateBookingStatus).toHaveBeenCalledWith('booking-123', 'cancelled');
  });
});