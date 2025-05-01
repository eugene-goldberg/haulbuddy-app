import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Text, View, Button, TextInput } from 'react-native';

// Set up mock implementations before imports
jest.mock('../firebase', () => ({
  auth: {},
  db: {}
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn()
}));

// Import after mocks are set up
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { registerUser, loginWithEmail, signOut } from '../contexts/auth-service';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// A simple login form component that uses auth service
const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithEmail({ email, password });
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
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button testID="login-button" title="Login" onPress={handleLogin} disabled={loading} />
      {error ? <Text testID="error-message">{error}</Text> : null}
    </View>
  );
};

// A simple registration form component that uses auth service
const RegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      await registerUser({ name, email, password });
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
        testID="name-input"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button testID="register-button" title="Register" onPress={handleRegister} disabled={loading} />
      {error ? <Text testID="error-message">{error}</Text> : null}
    </View>
  );
};

// A profile component that uses auth context
const ProfileComponent = () => {
  const { user, userRole, logout } = useAuth();

  if (!user) {
    return <Text testID="no-user-message">Please log in</Text>;
  }

  return (
    <View>
      <Text testID="user-email">{user.email}</Text>
      <Text testID="user-role">{userRole}</Text>
      <Button testID="logout-button" title="Logout" onPress={logout} />
    </View>
  );
};

describe('Firebase Authentication Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock onAuthStateChanged to initially return no user
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn(); // Return unsubscribe function
    });

    // Mock getDoc to return a user with a role
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'user' })
    });
  });

  test('login form submits credentials and handles success', async () => {
    // Mock successful login
    const mockUser = { uid: 'test-user-id', email: 'test@example.com' };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
    
    const successCallback = jest.fn();
    
    const { getByTestId } = render(
      <AuthProvider>
        <LoginForm onSuccess={successCallback} />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('login-button'));
    });
    
    // Verify signInWithEmailAndPassword was called with the correct parameters
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    
    // Verify success callback was called
    expect(successCallback).toHaveBeenCalled();
  });

  test('login form handles authentication errors', async () => {
    // Mock authentication error
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/user-not-found',
      message: 'User not found'
    });
    
    const { getByTestId, findByTestId } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.changeText(getByTestId('email-input'), 'nonexistent@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('login-button'));
    });
    
    // Verify error message is displayed
    const errorMessage = await findByTestId('error-message');
    expect(errorMessage).toBeTruthy();
  });

  test('register form creates a new user account', async () => {
    // Mock successful registration
    const mockUser = { uid: 'new-user-id', email: 'newuser@example.com' };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    
    const successCallback = jest.fn();
    
    const { getByTestId } = render(
      <AuthProvider>
        <RegisterForm onSuccess={successCallback} />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.changeText(getByTestId('name-input'), 'New User');
    fireEvent.changeText(getByTestId('email-input'), 'newuser@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });
    
    // Verify createUserWithEmailAndPassword was called with the correct parameters
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'newuser@example.com',
      'password123'
    );
    
    // Verify user document was created in Firestore
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: 'New User',
        email: 'newuser@example.com',
        role: 'user'
      })
    );
    
    // Verify success callback was called
    expect(successCallback).toHaveBeenCalled();
  });

  test('profile component displays user information and allows logout', async () => {
    // Mock authenticated user
    const mockUser = { uid: 'test-user-id', email: 'test@example.com' };
    
    // Mock onAuthStateChanged to return an authenticated user
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    // Mock signOut function
    (signOut as jest.Function).mockResolvedValue(true);
    
    const { getByTestId, queryByTestId } = render(
      <AuthProvider>
        <ProfileComponent />
      </AuthProvider>
    );
    
    // Wait for user information to be displayed
    await waitFor(() => {
      expect(getByTestId('user-email').props.children).toBe('test@example.com');
      expect(getByTestId('user-role').props.children).toBe('user');
    });
    
    // Trigger logout
    await act(async () => {
      fireEvent.press(getByTestId('logout-button'));
    });
    
    // Verify signOut was called
    expect(signOut).toHaveBeenCalled();
  });

  test('auth state changes are reflected in UI', async () => {
    let authCallback: (user: any) => void;
    
    // Mock onAuthStateChanged to be controllable from the test
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authCallback = callback;
      callback(null); // Start with no user
      return jest.fn(); // Return unsubscribe function
    });
    
    const { getByTestId, queryByTestId, rerender } = render(
      <AuthProvider>
        <ProfileComponent />
      </AuthProvider>
    );
    
    // Initially, the user should not be logged in
    expect(getByTestId('no-user-message')).toBeTruthy();
    
    // Simulate login
    const mockUser = { uid: 'test-user-id', email: 'test@example.com' };
    await act(async () => {
      authCallback(mockUser);
    });
    
    // Rerender to ensure state updates are reflected
    rerender(
      <AuthProvider>
        <ProfileComponent />
      </AuthProvider>
    );
    
    // After login, user information should be displayed
    await waitFor(() => {
      expect(getByTestId('user-email').props.children).toBe('test@example.com');
    });
    
    // Simulate logout
    await act(async () => {
      authCallback(null);
    });
    
    // Rerender to ensure state updates are reflected
    rerender(
      <AuthProvider>
        <ProfileComponent />
      </AuthProvider>
    );
    
    // After logout, the login message should be displayed again
    await waitFor(() => {
      expect(getByTestId('no-user-message')).toBeTruthy();
    });
  });
});