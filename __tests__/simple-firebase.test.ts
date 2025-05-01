/**
 * Simple Firebase test to demonstrate how to test Firebase functionality
 * following the pattern described in TESTING-README.md
 */

describe('Simple Firebase Mocking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('auth mocks work correctly', async () => {
    // Import and configure mocks
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
    
    // Configure mocks
    signInWithEmailAndPassword.mockResolvedValueOnce({ 
      user: { uid: 'test-uid' } 
    });
    
    createUserWithEmailAndPassword.mockResolvedValueOnce({ 
      user: { uid: 'new-test-uid' } 
    });
    
    // Perform tests using the mocked functions
    const signInResult = await signInWithEmailAndPassword(null, 'test@example.com', 'password');
    expect(signInResult.user.uid).toBe('test-uid');
    
    const signUpResult = await createUserWithEmailAndPassword(null, 'new@example.com', 'password');
    expect(signUpResult.user.uid).toBe('new-test-uid');
    
    // Verify the mocks were called correctly
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      null,
      'test@example.com',
      'password'
    );
    
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      null,
      'new@example.com',
      'password'
    );
  });

  test('firestore mocks work correctly', async () => {
    // Import and configure mocks
    const { 
      collection, 
      doc, 
      setDoc, 
      getDoc, 
      updateDoc, 
      getDocs,
      Timestamp 
    } = require('firebase/firestore');
    
    // Configure mocks
    collection.mockReturnValue('mock-collection-ref');
    doc.mockReturnValue('mock-doc-ref');
    setDoc.mockResolvedValue(undefined);
    
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ name: 'Test User', email: 'test@example.com' })
    });
    
    updateDoc.mockResolvedValue(undefined);
    
    getDocs.mockResolvedValue({
      docs: [
        {
          id: 'doc-1',
          data: () => ({ name: 'User 1' })
        },
        {
          id: 'doc-2',
          data: () => ({ name: 'User 2' })
        }
      ]
    });
    
    // Verify Timestamp functions
    expect(Timestamp.fromDate).toBeDefined();
    expect(Timestamp.now).toBeDefined();
    
    // Test setDoc
    await setDoc('mock-doc-ref', { name: 'Test User' });
    expect(setDoc).toHaveBeenCalledWith('mock-doc-ref', { name: 'Test User' });
    
    // Test getDoc
    const docSnapshot = await getDoc('mock-doc-ref');
    expect(getDoc).toHaveBeenCalledWith('mock-doc-ref');
    expect(docSnapshot.exists()).toBe(true);
    expect(docSnapshot.data()).toEqual({ name: 'Test User', email: 'test@example.com' });
    
    // Test updateDoc
    await updateDoc('mock-doc-ref', { name: 'Updated User' });
    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', { name: 'Updated User' });
    
    // Test getDocs
    const querySnapshot = await getDocs('mock-query');
    expect(getDocs).toHaveBeenCalledWith('mock-query');
    expect(querySnapshot.docs).toHaveLength(2);
    expect(querySnapshot.docs[0].id).toBe('doc-1');
    expect(querySnapshot.docs[0].data().name).toBe('User 1');
  });
});