import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Text, View, Button, TextInput, FlatList } from 'react-native';

// Set up mock implementations before imports
jest.mock('../firebase', () => ({
  auth: {},
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  Timestamp: {
    fromDate: jest.fn(date => ({ toDate: () => date })),
    now: jest.fn(() => ({ toDate: () => new Date() }))
  }
}));

// Mock contexts
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { uid: 'test-customer-id', email: 'test@example.com' },
    userRole: 'user',
    isLoading: false
  }))
}));

// Import after mocks are set up
import { BookingFormData, submitBooking, getActiveBookings, getPastBookings, cancelBooking } from '../services/booking-service';
import { createBooking, getCustomerBookings, updateBookingStatus } from '../firebase/firestore-service';
import { Booking } from '../firebase/firestore-schema';

// A simple booking form component that uses the booking service
const BookingForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = React.useState<BookingFormData>({
    cargoDescription: '',
    pickupAddress: '',
    destinationAddress: '',
    pickupDateTime: new Date(),
    needsAssistance: false,
    ridingAlong: false,
    estimatedHours: 2,
    ownerId: 'test-owner-id',
    vehicleId: 'test-vehicle-id'
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await submitBooking('test-customer-id', formData);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        testID="cargo-input"
        placeholder="Cargo Description"
        value={formData.cargoDescription}
        onChangeText={(text) => setFormData({ ...formData, cargoDescription: text })}
      />
      <TextInput
        testID="pickup-input"
        placeholder="Pickup Address"
        value={formData.pickupAddress}
        onChangeText={(text) => setFormData({ ...formData, pickupAddress: text })}
      />
      <TextInput
        testID="destination-input"
        placeholder="Destination Address"
        value={formData.destinationAddress}
        onChangeText={(text) => setFormData({ ...formData, destinationAddress: text })}
      />
      <Button 
        testID="submit-button" 
        title="Submit Booking" 
        onPress={handleSubmit} 
        disabled={loading} 
      />
      {error ? <Text testID="error-message">{error}</Text> : null}
    </View>
  );
};

// A component to display active bookings
const ActiveBookings = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getActiveBookings('test-customer-id');
      setBookings(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Text testID="loading-message">Loading bookings...</Text>;
  }

  if (error) {
    return <Text testID="error-message">{error}</Text>;
  }

  return (
    <View>
      {bookings.length === 0 ? (
        <Text testID="no-bookings-message">No active bookings</Text>
      ) : (
        <FlatList
          testID="bookings-list"
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View testID={`booking-${item.id}`}>
              <Text>{item.cargoDescription}</Text>
              <Text>{item.status}</Text>
              <Button
                testID={`cancel-${item.id}`}
                title="Cancel"
                onPress={() => handleCancel(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

describe('Firestore Booking Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('booking form submits data to Firestore', async () => {
    // Mock successful booking creation
    const mockBooking: Booking = {
      id: 'test-booking-id',
      customerId: 'test-customer-id',
      ownerId: 'test-owner-id',
      vehicleId: 'test-vehicle-id',
      cargoDescription: 'Moving furniture',
      pickupAddress: '123 Main St',
      destinationAddress: '456 Elm St',
      pickupDateTime: { toDate: () => new Date() } as any,
      estimatedHours: 2,
      needsAssistance: false,
      ridingAlong: false,
      totalCost: 90,
      status: 'pending',
      createdAt: { toDate: () => new Date() } as any,
      updatedAt: { toDate: () => new Date() } as any
    };
    
    (createBooking as jest.Mock).mockResolvedValue(mockBooking);
    
    const successCallback = jest.fn();
    
    const { getByTestId } = render(
      <BookingForm onSuccess={successCallback} />
    );
    
    // Fill in the form
    fireEvent.changeText(getByTestId('cargo-input'), 'Moving furniture');
    fireEvent.changeText(getByTestId('pickup-input'), '123 Main St');
    fireEvent.changeText(getByTestId('destination-input'), '456 Elm St');
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });
    
    // Verify createBooking was called with the correct parameters
    expect(createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'test-customer-id',
        cargoDescription: 'Moving furniture',
        pickupAddress: '123 Main St',
        destinationAddress: '456 Elm St'
      })
    );
    
    // Verify success callback was called
    expect(successCallback).toHaveBeenCalled();
  });

  test('booking form handles submission errors', async () => {
    // Mock booking error
    (createBooking as jest.Mock).mockRejectedValue(new Error('Failed to create booking'));
    
    const { getByTestId, findByTestId } = render(
      <BookingForm />
    );
    
    // Fill in the form
    fireEvent.changeText(getByTestId('cargo-input'), 'Moving furniture');
    fireEvent.changeText(getByTestId('pickup-input'), '123 Main St');
    fireEvent.changeText(getByTestId('destination-input'), '456 Elm St');
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });
    
    // Verify error message is displayed
    const errorMessage = await findByTestId('error-message');
    expect(errorMessage).toBeTruthy();
  });

  test('active bookings component fetches and displays bookings', async () => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: 'booking-1',
        customerId: 'test-customer-id',
        ownerId: 'test-owner-id',
        vehicleId: 'test-vehicle-id',
        cargoDescription: 'Moving furniture',
        pickupAddress: '123 Main St',
        destinationAddress: '456 Elm St',
        pickupDateTime: { toDate: () => new Date() } as any,
        estimatedHours: 2,
        needsAssistance: false,
        ridingAlong: false,
        totalCost: 90,
        status: 'pending',
        createdAt: { toDate: () => new Date() } as any,
        updatedAt: { toDate: () => new Date() } as any
      },
      {
        id: 'booking-2',
        customerId: 'test-customer-id',
        ownerId: 'test-owner-id',
        vehicleId: 'test-vehicle-id',
        cargoDescription: 'Moving appliances',
        pickupAddress: '789 Oak St',
        destinationAddress: '101 Pine St',
        pickupDateTime: { toDate: () => new Date() } as any,
        estimatedHours: 3,
        needsAssistance: true,
        ridingAlong: false,
        totalCost: 155,
        assistanceCost: 65,
        status: 'confirmed',
        createdAt: { toDate: () => new Date() } as any,
        updatedAt: { toDate: () => new Date() } as any
      }
    ];
    
    // Mock getCustomerBookings to return bookings
    (getCustomerBookings as jest.Mock).mockResolvedValue(mockBookings);
    
    const { queryByTestId } = render(
      <ActiveBookings />
    );
    
    // Verify bookings are displayed
    await waitFor(() => {
      expect(queryByTestId('booking-booking-1')).toBeTruthy();
      expect(queryByTestId('booking-booking-2')).toBeTruthy();
      expect(queryByTestId('loading-message')).toBeFalsy();
    });
    
    // Verify getCustomerBookings was called with correct parameter
    expect(getCustomerBookings).toHaveBeenCalledWith('test-customer-id');
  });

  test('active bookings component displays no bookings message', async () => {
    // Mock empty bookings data
    (getCustomerBookings as jest.Mock).mockResolvedValue([]);
    
    const { queryByTestId } = render(
      <ActiveBookings />
    );
    
    // Verify no bookings message is displayed
    await waitFor(() => {
      expect(queryByTestId('no-bookings-message')).toBeTruthy();
      expect(queryByTestId('loading-message')).toBeFalsy();
    });
  });

  test('cancel booking functionality works', async () => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: 'booking-1',
        customerId: 'test-customer-id',
        ownerId: 'test-owner-id',
        vehicleId: 'test-vehicle-id',
        cargoDescription: 'Moving furniture',
        pickupAddress: '123 Main St',
        destinationAddress: '456 Elm St',
        pickupDateTime: { toDate: () => new Date() } as any,
        estimatedHours: 2,
        needsAssistance: false,
        ridingAlong: false,
        totalCost: 90,
        status: 'pending',
        createdAt: { toDate: () => new Date() } as any,
        updatedAt: { toDate: () => new Date() } as any
      }
    ];
    
    // Mock booking service functions
    (getCustomerBookings as jest.Mock).mockResolvedValue(mockBookings);
    (updateBookingStatus as jest.Mock).mockResolvedValue(undefined);
    
    // After cancellation, return an empty list
    (getCustomerBookings as jest.Mock).mockResolvedValueOnce(mockBookings)
                                      .mockResolvedValueOnce([]);
    
    const { getByTestId, queryByTestId } = render(
      <ActiveBookings />
    );
    
    // Wait for booking to be displayed
    await waitFor(() => {
      expect(queryByTestId('booking-booking-1')).toBeTruthy();
    });
    
    // Cancel the booking
    await act(async () => {
      fireEvent.press(getByTestId('cancel-booking-1'));
    });
    
    // Verify updateBookingStatus was called with correct parameters
    expect(updateBookingStatus).toHaveBeenCalledWith('booking-1', 'cancelled');
    
    // Verify booking list was refreshed
    expect(getCustomerBookings).toHaveBeenCalledTimes(2);
    
    // Verify no bookings message is now displayed
    await waitFor(() => {
      expect(queryByTestId('no-bookings-message')).toBeTruthy();
    });
  });

  test('handles booking fetch errors', async () => {
    // Mock error when fetching bookings
    (getCustomerBookings as jest.Mock).mockRejectedValue(new Error('Failed to fetch bookings'));
    
    const { queryByTestId } = render(
      <ActiveBookings />
    );
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(queryByTestId('error-message')).toBeTruthy();
      expect(queryByTestId('loading-message')).toBeFalsy();
    });
  });
});