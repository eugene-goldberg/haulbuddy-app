import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { BookingContext } from '../contexts/BookingContext';
import { OnboardingContext } from '../contexts/OnboardingContext';

// Mock Authentication Context
const mockAuthContext = {
  user: {
    uid: 'test-uid',
    email: 'test@example.com',
    name: 'Test User',
  },
  isAuthenticated: true,
  isLoading: false,
  signIn: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  signUp: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  signOut: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  error: null,
  setError: jest.fn(),
};

// Mock Booking Context
const mockBookingContext = {
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

// Mock Onboarding Context
const mockOnboardingContext = {
  onboardingData: {
    personalInfo: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-123-4567',
    },
    vehicleInfo: {
      make: 'Ford',
      model: 'F-150',
      year: '2022',
      vehicleType: 'pickup',
    },
    pricing: {
      hourlyRate: 45,
      assistanceRate: 25,
    },
  },
  setOnboardingData: jest.fn(),
  resetOnboardingData: jest.fn(),
  updatePersonalInfo: jest.fn(),
  updateVehicleInfo: jest.fn(),
  updatePricing: jest.fn(),
};

const AllTheProviders = ({ children, customAuthContext = {}, customBookingContext = {}, customOnboardingContext = {} }) => {
  // Merge default mocks with any custom overrides provided
  const authContextValue = { ...mockAuthContext, ...customAuthContext };
  const bookingContextValue = { ...mockBookingContext, ...customBookingContext };
  const onboardingContextValue = { ...mockOnboardingContext, ...customOnboardingContext };

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContextValue}>
        <BookingContext.Provider value={bookingContextValue}>
          <OnboardingContext.Provider value={onboardingContextValue}>
            {children}
          </OnboardingContext.Provider>
        </BookingContext.Provider>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};

// Custom render method that includes all providers
const customRender = (ui, options = {}) => {
  const {
    customAuthContext,
    customBookingContext,
    customOnboardingContext,
    ...renderOptions
  } = options;

  return render(
    ui,
    {
      wrapper: (props) => (
        <AllTheProviders
          customAuthContext={customAuthContext}
          customBookingContext={customBookingContext}
          customOnboardingContext={customOnboardingContext}
          {...props}
        />
      ),
      ...renderOptions,
    }
  );
};

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Export testing utilities
export * from '@testing-library/react-native';
export { customRender as render, mockAuthContext, mockBookingContext, mockOnboardingContext };