import React from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const mockAuthContext = {
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

export const AuthContextProvider: React.FC = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

export default mockAuthContext;