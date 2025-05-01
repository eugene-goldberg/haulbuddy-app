import { 
  registerUser, 
  loginWithEmail, 
  resetPassword, 
  signOut 
} from '../contexts/auth-service';

// Set up mock implementations before imports
jest.mock('firebase/auth', () => {
  return {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn()
  };
});

jest.mock('firebase/firestore', () => {
  return {
    doc: jest.fn(),
    setDoc: jest.fn(),
    serverTimestamp: jest.fn(),
    collection: jest.fn()
  };
});

jest.mock('../firebase', () => ({
  auth: {},
  db: {}
}));

// Import the mocked modules
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';

describe('Authentication Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('registers a new user successfully', async () => {
      // Mock successful user creation
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ 
        user: mockUser 
      });
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (doc as jest.Mock).mockReturnValue({});
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      (collection as jest.Mock).mockReturnValue({});
      (serverTimestamp as jest.Mock).mockReturnValue({});
      
      // Call the function
      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Verify function calls
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth, 
        'test@example.com', 
        'password123'
      );
      expect(updateProfile).toHaveBeenCalledWith(
        mockUser, 
        { displayName: 'Test User' }
      );
      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(doc).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        })
      );
      expect(result).toEqual(mockUser);
    });

    test('handles registration error: email already in use', async () => {
      // Mock email already in use error
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/email-already-in-use',
        message: 'Email already in use'
      });
      
      // Call the function and expect it to throw
      await expect(registerUser({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      })).rejects.toThrow('Email already in use');
      
      // Verify no other functions were called
      expect(updateProfile).not.toHaveBeenCalled();
      expect(setDoc).not.toHaveBeenCalled();
    });

    test('handles registration error: weak password', async () => {
      // Mock weak password error
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/weak-password',
        message: 'Weak password'
      });
      
      // Call the function and expect it to throw
      await expect(registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      })).rejects.toThrow('Password is too weak');
    });
  });

  describe('loginWithEmail', () => {
    test('logs in a user successfully', async () => {
      // Mock successful login
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ 
        user: mockUser 
      });
      
      // Call the function
      const result = await loginWithEmail({
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Verify function calls
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth, 
        'test@example.com', 
        'password123'
      );
      expect(result).toEqual(mockUser);
    });

    test('handles login error: invalid credentials', async () => {
      // Mock invalid credentials error
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
        message: 'User not found'
      });
      
      // Call the function and expect it to throw
      await expect(loginWithEmail({
        email: 'nonexistent@example.com',
        password: 'password123'
      })).rejects.toThrow('Invalid email or password');
    });

    test('handles login error: too many requests', async () => {
      // Mock too many requests error
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/too-many-requests',
        message: 'Too many requests'
      });
      
      // Call the function and expect it to throw
      await expect(loginWithEmail({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Too many failed login attempts');
    });
  });

  describe('resetPassword', () => {
    test('sends a password reset email successfully', async () => {
      // Mock successful password reset
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
      
      // Call the function
      const result = await resetPassword('test@example.com');
      
      // Verify function calls
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        auth, 
        'test@example.com'
      );
      expect(result).toBe(true);
    });

    test('handles password reset error: user not found', async () => {
      // Mock user not found error
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
        message: 'User not found'
      });
      
      // Call the function and expect it to throw
      await expect(resetPassword('nonexistent@example.com'))
        .rejects
        .toThrow('No user found with this email address');
    });
  });

  describe('signOut', () => {
    test('signs out a user successfully', async () => {
      // Mock successful sign out
      (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);
      
      // Call the function
      const result = await signOut();
      
      // Verify function calls
      expect(firebaseSignOut).toHaveBeenCalledWith(auth);
      expect(result).toBe(true);
    });

    test('handles sign out error', async () => {
      // Mock sign out error
      (firebaseSignOut as jest.Mock).mockRejectedValue(new Error('Sign out error'));
      
      // Call the function and expect it to throw
      await expect(signOut())
        .rejects
        .toThrow('Failed to sign out');
    });
  });
});