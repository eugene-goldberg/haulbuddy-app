import { UserProfile, Vehicle, Booking, OwnerProfile } from '../firebase/firestore-schema';

// Set up mock implementations before imports
jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    serverTimestamp: jest.fn(() => new Date()),
    Timestamp: {
      fromDate: jest.fn(date => ({ toDate: () => date })),
      now: jest.fn(() => ({ toDate: () => new Date() }))
    }
  };
});

jest.mock('firebase/storage', () => {
  return {
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn()
  };
});

jest.mock('../firebase', () => ({
  db: {},
  storage: {}
}));

// Import after the mocks are set up
import { 
  createUserProfile, 
  getUserProfile,
  updateUserProfile,
  completeUserOnboarding,
  createVehicle,
  getVehicle,
  getOwnerVehicles,
  updateVehicle,
  createBooking,
  getBooking,
  getCustomerBookings,
  getOwnerBookings,
  updateBookingStatus
} from '../firebase/firestore-service';
import { Timestamp } from 'firebase/firestore';

// Mock data
const mockUser: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
  uid: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  hasCompletedOnboarding: false
};

const mockOwner: Omit<OwnerProfile, 'createdAt' | 'updatedAt'> = {
  uid: 'test-owner-123',
  name: 'Test Owner',
  email: 'owner@example.com',
  role: 'owner',
  hasCompletedOnboarding: true,
  vehicles: []
};

const mockVehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> = {
  ownerId: 'test-owner-123',
  type: 'pickup',
  make: 'Ford',
  model: 'F-150',
  year: '2022',
  licensePlate: 'TEST123',
  capacity: '1500 lbs',
  photos: {
    front: 'https://example.com/front.jpg'
  },
  hourlyRate: 45,
  offerAssistance: true,
  assistanceRate: 20,
  isActive: true
};

const mockBooking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
  customerId: 'test-user-123',
  ownerId: 'test-owner-123',
  vehicleId: 'test-vehicle-123',
  cargoDescription: 'Moving furniture',
  pickupAddress: '123 Main St',
  destinationAddress: '456 Elm St',
  pickupDateTime: Timestamp.fromDate(new Date('2025-05-15')),
  estimatedHours: 2,
  needsAssistance: true,
  ridingAlong: false,
  totalCost: 110,
  assistanceCost: 40
};

// Reset the mock state between tests
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Firestore User Profile Functions', () => {
  
  test('createUserProfile creates a new user profile', async () => {
    // Mock dependencies
    const setDoc = require('firebase/firestore').setDoc;
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockUser,
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      }),
      exists: () => true
    });
    
    // Execute the function
    const result = await createUserProfile(mockUser);
    
    // Assertions
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('uid', mockUser.uid);
    expect(result).toHaveProperty('name', mockUser.name);
    expect(result).toHaveProperty('email', mockUser.email);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('getUserProfile retrieves a user profile', async () => {
    // Mock dependencies
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockUser,
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      }),
      exists: () => true
    });
    
    // Execute the function
    const result = await getUserProfile(mockUser.uid);
    
    // Assertions
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('uid', mockUser.uid);
    expect(result).toHaveProperty('name', mockUser.name);
  });

  test('getUserProfile returns null for non-existent user', async () => {
    // Mock dependencies
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      exists: () => false
    });
    
    // Execute the function
    const result = await getUserProfile('non-existent-user');
    
    // Assertions
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  test('updateUserProfile updates a user profile', async () => {
    // Mock dependencies
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Setup the update data
    const updates = { name: 'Updated Name' };
    
    // Execute the function
    await updateUserProfile(mockUser.uid, updates);
    
    // Assertions
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: 'Updated Name',
        updatedAt: expect.anything()
      })
    );
  });

  test('completeUserOnboarding marks onboarding as complete', async () => {
    // Mock dependencies
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Execute the function
    await completeUserOnboarding(mockUser.uid);
    
    // Assertions
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        hasCompletedOnboarding: true,
        updatedAt: expect.anything()
      })
    );
  });
});

describe('Firestore Vehicle Functions', () => {
  
  test('createVehicle creates a new vehicle', async () => {
    // Mock dependencies
    const setDoc = require('firebase/firestore').setDoc;
    const getDoc = require('firebase/firestore').getDoc;
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Mock the document ID
    const mockDocRef = { id: 'test-vehicle-123' };
    require('firebase/firestore').doc.mockReturnValue(mockDocRef);
    
    // Mock user doc data
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockOwner,
        vehicles: []
      }),
      exists: () => true
    });
    
    // Mock vehicle doc data
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockVehicle,
        id: 'test-vehicle-123',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      })
    });
    
    // Execute the function
    const result = await createVehicle(mockVehicle);
    
    // Assertions
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(result).toHaveProperty('id', 'test-vehicle-123');
    expect(result).toHaveProperty('ownerId', mockVehicle.ownerId);
    expect(result).toHaveProperty('make', mockVehicle.make);
  });

  test('getVehicle retrieves a vehicle', async () => {
    // Mock dependencies
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockVehicle,
        id: 'test-vehicle-123',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      }),
      exists: () => true
    });
    
    // Execute the function
    const result = await getVehicle('test-vehicle-123');
    
    // Assertions
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('id', 'test-vehicle-123');
    expect(result).toHaveProperty('ownerId', mockVehicle.ownerId);
  });

  test('getOwnerVehicles retrieves all vehicles for an owner', async () => {
    // Mock dependencies
    const getDocs = require('firebase/firestore').getDocs;
    
    // Mock the getDocs return value
    getDocs.mockReturnValueOnce({ 
      docs: [
        { 
          data: () => ({
            ...mockVehicle,
            id: 'test-vehicle-123',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        },
        { 
          data: () => ({
            ...mockVehicle,
            id: 'test-vehicle-456',
            make: 'Toyota',
            model: 'Tacoma',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        }
      ]
    });
    
    // Execute the function
    const result = await getOwnerVehicles(mockOwner.uid);
    
    // Assertions
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id', 'test-vehicle-123');
    expect(result[1]).toHaveProperty('id', 'test-vehicle-456');
    expect(result[1]).toHaveProperty('make', 'Toyota');
  });

  test('updateVehicle updates a vehicle', async () => {
    // Mock dependencies
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Setup the update data
    const updates = { hourlyRate: 50, isActive: false };
    
    // Execute the function
    await updateVehicle('test-vehicle-123', updates);
    
    // Assertions
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        hourlyRate: 50,
        isActive: false,
        updatedAt: expect.anything()
      })
    );
  });
});

describe('Firestore Booking Functions', () => {
  
  test('createBooking creates a new booking', async () => {
    // Mock dependencies
    const setDoc = require('firebase/firestore').setDoc;
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the document ID
    const mockDocRef = { id: 'test-booking-123' };
    require('firebase/firestore').doc.mockReturnValue(mockDocRef);
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockBooking,
        id: 'test-booking-123',
        status: 'pending',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      })
    });
    
    // Execute the function
    const result = await createBooking(mockBooking);
    
    // Assertions
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('id', 'test-booking-123');
    expect(result).toHaveProperty('customerId', mockBooking.customerId);
    expect(result).toHaveProperty('status', 'pending');
  });

  test('getBooking retrieves a booking', async () => {
    // Mock dependencies
    const getDoc = require('firebase/firestore').getDoc;
    
    // Mock the getDoc return value
    getDoc.mockReturnValueOnce({ 
      data: () => ({
        ...mockBooking,
        id: 'test-booking-123',
        status: 'pending',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      }),
      exists: () => true
    });
    
    // Execute the function
    const result = await getBooking('test-booking-123');
    
    // Assertions
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('id', 'test-booking-123');
    expect(result).toHaveProperty('customerId', mockBooking.customerId);
  });

  test('getCustomerBookings retrieves all bookings for a customer', async () => {
    // Mock dependencies
    const getDocs = require('firebase/firestore').getDocs;
    
    // Mock the getDocs return value
    getDocs.mockReturnValueOnce({ 
      docs: [
        { 
          id: 'test-booking-123',
          data: () => ({
            ...mockBooking,
            id: 'test-booking-123',
            status: 'pending',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        },
        { 
          id: 'test-booking-456',
          data: () => ({
            ...mockBooking,
            id: 'test-booking-456',
            status: 'completed',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() },
            completedAt: { toDate: () => new Date() }
          })
        }
      ]
    });
    
    // Execute the function
    const result = await getCustomerBookings(mockUser.uid);
    
    // Assertions
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id', 'test-booking-123');
    expect(result[0]).toHaveProperty('status', 'pending');
    expect(result[1]).toHaveProperty('id', 'test-booking-456');
    expect(result[1]).toHaveProperty('status', 'completed');
  });

  test('getOwnerBookings retrieves all bookings for an owner', async () => {
    // Mock dependencies
    const getDocs = require('firebase/firestore').getDocs;
    
    // Mock the getDocs return value
    getDocs.mockReturnValueOnce({ 
      docs: [
        { 
          data: () => ({
            ...mockBooking,
            id: 'test-booking-123',
            status: 'pending',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        },
        { 
          data: () => ({
            ...mockBooking,
            id: 'test-booking-456',
            status: 'confirmed',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        }
      ]
    });
    
    // Execute the function
    const result = await getOwnerBookings(mockOwner.uid);
    
    // Assertions
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id', 'test-booking-123');
    expect(result[1]).toHaveProperty('id', 'test-booking-456');
  });

  test('updateBookingStatus updates status to completed', async () => {
    // Mock dependencies
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Execute the function
    await updateBookingStatus('test-booking-123', 'completed');
    
    // Assertions
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: 'completed',
        completedAt: expect.anything(),
        updatedAt: expect.anything()
      })
    );
  });

  test('updateBookingStatus updates to non-completed status', async () => {
    // Mock dependencies
    const updateDoc = require('firebase/firestore').updateDoc;
    
    // Execute the function
    await updateBookingStatus('test-booking-123', 'cancelled');
    
    // Assertions
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: 'cancelled',
        updatedAt: expect.anything()
      })
    );
    
    // Check that completedAt is not included in the update
    const updateDocCall = updateDoc.mock.calls[0][1];
    expect(updateDocCall).not.toHaveProperty('completedAt');
  });
});