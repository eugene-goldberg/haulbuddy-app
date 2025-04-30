// Set up required mocks for React Native modules
import 'react-native-gesture-handler/jestSetup';
import mockFetch from 'jest-mock-fetch';

// Mock the Expo Router
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
  Link: 'Link',
  Stack: {
    Screen: ({ children }) => children,
  },
  useSegments: jest.fn(() => []),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');

  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: View,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  
  // Create mock components for each icon set
  const createIconMock = (name) => {
    const IconMock = ({ name, size, color, ...props }) => {
      return <View {...props} testID={`icon-${name}`}><Text>{name}</Text></View>;
    };
    return IconMock;
  };
  
  return {
    Ionicons: createIconMock('Ionicons'),
    MaterialIcons: createIconMock('MaterialIcons'),
    FontAwesome: createIconMock('FontAwesome'),
    FontAwesome5: createIconMock('FontAwesome5'),
    Feather: createIconMock('Feather'),
    MaterialCommunityIcons: createIconMock('MaterialCommunityIcons'),
  };
});

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
    });
    return jest.fn(); // Return unsubscribe function
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() => ({
    exists: jest.fn(() => true),
    data: jest.fn(() => ({})),
  })),
  updateDoc: jest.fn(),
  getDocs: jest.fn(() => ({
    docs: [],
  })),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  Timestamp: {
    fromDate: jest.fn(date => ({ toDate: () => date })),
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  uploadBytes: jest.fn(() => Promise.resolve({})),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/image.jpg')),
}));

// Mock Firebase Analytics
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
  logEvent: jest.fn(),
}));

// Mock Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-messaging-sender-id',
      appId: 'test-app-id',
    },
  },
}));

// Mock Expo Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock Reanimated for gesture handler
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock DateTimePicker 
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    __esModule: true,
    default: (props) => {
      return <View testID="datetimepicker">DateTimePicker Mock</View>;
    },
  };
});

// Setup fetch mock
global.fetch = mockFetch;

// Set up reset for each test
beforeEach(() => {
  mockFetch.reset();
});