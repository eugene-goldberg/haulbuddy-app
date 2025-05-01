import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

// Set up mock implementations before imports
jest.mock('../firebase', () => ({
  auth: {},
  db: {}
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn()
}));

// Mock auth-service
jest.mock('../contexts/auth-service', () => ({
  signOut: jest.fn().mockResolvedValue(true)
}));

// Import after mocking
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection } from 'firebase/firestore';

// Test component that uses the AuthContext
const TestComponent = () => {
  const { user, userRole, isLoading, logout, refreshUserRole } = useAuth();
  
  return (
    <View>
      <Text testID="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</Text>
      <Text testID="user-state">{user ? `User: ${user.uid}` : 'No User'}</Text>
      <Text testID="role-state">{userRole ? `Role: ${userRole}` : 'No Role'}</Text>
      <Button testID="logout-button" title="Logout" onPress={logout} />
      <Button testID="refresh-role-button" title="Refresh Role" onPress={refreshUserRole} />
    </View>
  );
};

describe('AuthContext', () => {
  // Setup and cleanup for each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state is loading with no user', async () => {
    // Setup auth listener to never call the callback
    (onAuthStateChanged as jest.Mock).mockImplementation(() => {
      // Return unsubscribe function
      return jest.fn();
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initial state should be loading
    expect(getByTestId('loading-state').props.children).toBe('Loading');
    expect(getByTestId('user-state').props.children).toBe('No User');
    expect(getByTestId('role-state').props.children).toBe('No Role');
  });

  test('updates state when user logs in', async () => {
    // Mock user data
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    
    // Mock Firestore to return a user with a role
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'user' })
    });
    
    // Setup auth listener to call callback with authenticated user
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for state updates
    await waitFor(() => {
      expect(getByTestId('loading-state').props.children).toBe('Not Loading');
      expect(getByTestId('user-state').props.children).toBe('User: test-uid');
      expect(getByTestId('role-state').props.children).toBe('Role: user');
    });
  });

  test('updates state when user logs out', async () => {
    // Mock user data
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    
    // Mock Firestore to return a user with a role
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'user' })
    });
    
    // Mock initial state as logged in
    let authCallback: (user: any) => void;
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authCallback = callback;
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for state to be logged in
    await waitFor(() => {
      expect(getByTestId('user-state').props.children).toBe('User: test-uid');
    });
    
    // Simulate logout
    await act(async () => {
      authCallback(null);
    });
    
    // State should update to logged out
    await waitFor(() => {
      expect(getByTestId('loading-state').props.children).toBe('Not Loading');
      expect(getByTestId('user-state').props.children).toBe('No User');
      expect(getByTestId('role-state').props.children).toBe('No Role');
    });
  });

  test('logout function works', async () => {
    // Mock user data
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    
    // Mock Firestore to return a user with a role
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'user' })
    });
    
    // Mock auth state as logged in
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    // Mock auth-service signOut
    const { signOut } = require('../contexts/auth-service');
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for state to be logged in
    await waitFor(() => {
      expect(getByTestId('user-state').props.children).toBe('User: test-uid');
    });
    
    // Press logout button
    await act(async () => {
      fireEvent.press(getByTestId('logout-button'));
    });
    
    // Check signOut was called
    expect(signOut).toHaveBeenCalled();
    
    // State should update to logged out
    await waitFor(() => {
      expect(getByTestId('user-state').props.children).toBe('No User');
    });
  });

  test('refreshUserRole function fetches and updates role', async () => {
    // Mock user data
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    
    // Mock Firestore to return a user with an initial role
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    
    let roleData = { role: 'user' };
    (getDoc as jest.Mock).mockImplementation(() => ({
      exists: () => true,
      data: () => ({ ...roleData })
    }));
    
    // Mock auth state as logged in
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for state to be initialized
    await waitFor(() => {
      expect(getByTestId('role-state').props.children).toBe('Role: user');
    });
    
    // Update the mock role that will be returned on next fetch
    roleData.role = 'owner';
    
    // Press refresh role button
    await act(async () => {
      fireEvent.press(getByTestId('refresh-role-button'));
    });
    
    // Role should be updated
    await waitFor(() => {
      expect(getByTestId('role-state').props.children).toBe('Role: owner');
    });
  });
});