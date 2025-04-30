import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render } from '../test-utils';
import LoginScreen from '../app/onboarding/login';
import SignupScreen from '../app/onboarding/signup';
import { router } from 'expo-router';

// Mock the auth service
jest.mock('../contexts/auth-service', () => ({
  signIn: jest.fn(() => Promise.resolve({ 
    user: { 
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User' 
    } 
  })),
  signUp: jest.fn(() => Promise.resolve({
    user: { 
      uid: 'test-uid',
      email: 'new-user@example.com',
      displayName: 'New User' 
    }
  })),
  signOut: jest.fn(() => Promise.resolve()),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a user to sign in and navigate to the app', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    // Fill in login form
    const emailInput = getByPlaceholderText('Email address');
    const passwordInput = getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    // Submit the form
    const loginButton = getByText('Sign In');
    fireEvent.press(loginButton);
    
    // Verify auth service was called with correct credentials
    await waitFor(() => {
      const { signIn } = require('../contexts/auth-service');
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      
      // Verify navigation happened after successful login
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });

  it('should allow a user to sign up and navigate to the app', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    // Fill in signup form
    const nameInput = getByPlaceholderText('Full name');
    const emailInput = getByPlaceholderText('Email address');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    
    fireEvent.changeText(nameInput, 'New User');
    fireEvent.changeText(emailInput, 'new-user@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    // Submit the form
    const signupButton = getByText('Create Account');
    fireEvent.press(signupButton);
    
    // Verify auth service was called with correct credentials
    await waitFor(() => {
      const { signUp } = require('../contexts/auth-service');
      expect(signUp).toHaveBeenCalledWith(
        'new-user@example.com', 
        'password123', 
        expect.objectContaining({ name: 'New User' })
      );
      
      // Verify navigation happened after successful signup
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });
});