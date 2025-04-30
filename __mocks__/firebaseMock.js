// Generic Firebase mock for all Firebase modules
const firebaseMock = {
  // Firebase app related
  initializeApp: jest.fn(() => ({})),
  getApp: jest.fn(() => ({})),
  
  // Firebase auth related
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    });
    return jest.fn(); // Return unsubscribe function
  }),
  
  // Firebase firestore related
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => ({
    exists: jest.fn(() => true),
    data: jest.fn(() => ({})),
  })),
  updateDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(() => ({
    docs: [],
  })),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  serverTimestamp: jest.fn(() => new Date()),
  Timestamp: {
    fromDate: jest.fn(date => ({ toDate: () => date })),
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
  
  // Firebase storage related
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  uploadBytes: jest.fn(() => Promise.resolve({})),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/image.jpg')),
  
  // Firebase analytics related
  getAnalytics: jest.fn(() => ({})),
  logEvent: jest.fn(),
};

module.exports = firebaseMock;