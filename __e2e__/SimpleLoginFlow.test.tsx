import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

// Create a simplified login component to test authentication flow
const SimpleLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // Simulate successful authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to home screen after successful login
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const goToSignup = () => {
    router.push('/onboarding/signup');
  };
  
  return (
    <View>
      <Text>Sign In</Text>
      
      {error ? <Text testID="error-message">{error}</Text> : null}
      
      <TextInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        testID="email-input"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={isLoading}
        testID="login-button"
      >
        <Text>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={goToSignup} testID="signup-link">
        <Text>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Simple Login Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('allows navigation to signup screen', () => {
    const { getByTestId } = render(<SimpleLoginScreen />);
    
    // Press the signup link
    fireEvent.press(getByTestId('signup-link'));
    
    // Verify navigation to signup screen
    expect(router.push).toHaveBeenCalledWith('/onboarding/signup');
  });
  
  it('shows error message when submitting with empty fields', async () => {
    const { getByTestId, findByTestId } = render(<SimpleLoginScreen />);
    
    // Submit the form without filling in fields
    fireEvent.press(getByTestId('login-button'));
    
    // Verify error message appears
    const errorMessage = await findByTestId('error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.props.children).toBe('Please enter both email and password');
  });
  
  it('navigates to home screen after successful login', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SimpleLoginScreen />);
    
    // Fill in the login form
    fireEvent.changeText(getByPlaceholderText('Email address'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Submit the form
    fireEvent.press(getByTestId('login-button'));
    
    // Verify navigation after successful login
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
    }, { timeout: 1000 });
  });
});