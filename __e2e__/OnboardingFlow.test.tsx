import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render, mockAuthContext } from './test-utils';
import LoginScreen from '../app/onboarding/login';
import SignupScreen from '../app/onboarding/signup';
import { router } from 'expo-router';

// Mock the auth service functions
jest.mock('../contexts/auth-service', () => ({
  signIn: jest.fn(() => Promise.resolve({ 
    user: { uid: 'test-uid', email: 'test@example.com' }
  })),
  signUp: jest.fn(() => Promise.resolve({
    user: { uid: 'new-user-uid', email: 'new-user@example.com' }
  })),
}));

describe('User Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows a user to sign in successfully', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
      {
        // Override the mock to show unauthenticated state
        customAuthContext: {
          ...mockAuthContext,
          isAuthenticated: false,
          user: null
        }
      }
    );

    // Fill in the login form
    const emailInput = getByPlaceholderText('Email address');
    const passwordInput = getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    // Submit the form
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    // Verify auth service was called
    await waitFor(() => {
      const { signIn } = require('../contexts/auth-service');
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Verify navigation to home after successful login
    expect(mockAuthContext.signIn).toHaveBeenCalled();
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });

  it('allows a user to create a new account', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen />,
      {
        customAuthContext: {
          ...mockAuthContext,
          isAuthenticated: false,
          user: null
        }
      }
    );
    
    // Fill in the signup form
    const nameInput = getByPlaceholderText('Full name');
    const emailInput = getByPlaceholderText('Email address');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    
    fireEvent.changeText(nameInput, 'New User');
    fireEvent.changeText(emailInput, 'newuser@example.com');
    fireEvent.changeText(passwordInput, 'securepass123');
    fireEvent.changeText(confirmPasswordInput, 'securepass123');
    
    // Submit the form
    const createAccountButton = getByText('Create Account');
    fireEvent.press(createAccountButton);
    
    // Verify auth service was called
    await waitFor(() => {
      const { signUp } = require('../contexts/auth-service');
      expect(signUp).toHaveBeenCalledWith('newuser@example.com', 'securepass123', {
        name: 'New User'
      });
    });
    
    // Verify navigation to home after successful registration
    expect(mockAuthContext.signUp).toHaveBeenCalled();
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });

  it('shows navigation between login and signup screens', () => {
    // Test login screen navigation
    const loginScreen = render(
      <LoginScreen />,
      {
        customAuthContext: {
          ...mockAuthContext,
          isAuthenticated: false,
          user: null
        }
      }
    );
    
    // Find and press the "Create an account" link
    const createAccountLink = loginScreen.getByText('Create an account');
    fireEvent.press(createAccountLink);
    
    // Verify navigation to signup screen
    expect(router.push).toHaveBeenCalledWith('/onboarding/signup');
    
    // Clear mock to test the reverse navigation
    jest.clearAllMocks();
    
    // Test signup screen navigation
    const signupScreen = render(
      <SignupScreen />,
      {
        customAuthContext: {
          ...mockAuthContext,
          isAuthenticated: false,
          user: null
        }
      }
    );
    
    // Find and press the "Sign in to existing account" link
    const signInLink = signupScreen.getByText('Sign in to existing account');
    fireEvent.press(signInLink);
    
    // Verify navigation to login screen
    expect(router.push).toHaveBeenCalledWith('/onboarding/login');
  });
});