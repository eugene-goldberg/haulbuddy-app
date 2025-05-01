import { 
  registerUser, 
  loginWithEmail, 
  resetPassword, 
  signOut 
} from '../contexts/auth-service';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loginWithEmail logs in users successfully', async () => {
    // Import and configure mocks
    const { signInWithEmailAndPassword } = require('firebase/auth');
    
    // Configure mocks
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    
    // Call the function
    const result = await loginWithEmail({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    
    // Verify the result
    expect(result).toEqual(mockUser);
    
    // Verify the mock was called correctly
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
  });

  test('loginWithEmail handles authentication errors', async () => {
    // Import and configure mocks
    const { signInWithEmailAndPassword } = require('firebase/auth');
    
    // Configure mocks to simulate an error
    signInWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/user-not-found',
      message: 'User not found'
    });
    
    // Call the function and expect it to throw the correct error
    await expect(loginWithEmail({
      email: 'nonexistent@example.com',
      password: 'password123'
    })).rejects.toThrow('Invalid email or password');
  });

  test('registerUser creates a new user', async () => {
    // Import and configure mocks
    const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
    const { doc, setDoc, collection } = require('firebase/firestore');
    
    // Configure mocks
    const mockUser = { uid: 'new-user-id', email: 'new@example.com' };
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    updateProfile.mockResolvedValueOnce(undefined);
    doc.mockReturnValueOnce('mock-user-doc-ref');
    collection.mockReturnValueOnce('mock-users-collection');
    setDoc.mockResolvedValueOnce(undefined);
    
    // Call the function
    const result = await registerUser({
      name: 'New User',
      email: 'new@example.com',
      password: 'securepass123'
    });
    
    // Verify the result
    expect(result).toEqual(mockUser);
    
    // Verify the mocks were called correctly
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'new@example.com',
      'securepass123'
    );
    
    expect(updateProfile).toHaveBeenCalledWith(
      mockUser,
      { displayName: 'New User' }
    );
    
    expect(collection).toHaveBeenCalledWith(
      expect.anything(),
      'users'
    );
    
    expect(doc).toHaveBeenCalledWith(
      'mock-users-collection',
      mockUser.uid
    );
    
    expect(setDoc).toHaveBeenCalledWith(
      'mock-user-doc-ref',
      expect.objectContaining({
        name: 'New User',
        email: 'new@example.com',
        role: 'user'
      })
    );
  });

  test('resetPassword sends password reset email', async () => {
    // Import and configure mocks
    const { sendPasswordResetEmail } = require('firebase/auth');
    
    // Configure mocks
    sendPasswordResetEmail.mockResolvedValueOnce(undefined);
    
    // Call the function
    const result = await resetPassword('test@example.com');
    
    // Verify the result
    expect(result).toBe(true);
    
    // Verify the mock was called correctly
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });

  test('signOut signs out the user', async () => {
    // Import and configure mocks
    const { signOut: firebaseSignOut } = require('firebase/auth');
    
    // Configure mocks
    firebaseSignOut.mockResolvedValueOnce(undefined);
    
    // Call the function
    const result = await signOut();
    
    // Verify the result
    expect(result).toBe(true);
    
    // Verify the mock was called correctly
    expect(firebaseSignOut).toHaveBeenCalledWith(expect.anything());
  });
});