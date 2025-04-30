// Firebase initialization script with authentication
// This script creates the initial collections and sample documents in your Firebase project
// Run with: node scripts/init-firebase-with-auth.js

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  Timestamp 
} = require('firebase/firestore');
const { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} = require('firebase/auth');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC3WwxamAscg_uK1b4y_buannwRJyG3Mk",
  authDomain: "pickuptruckapp.firebaseapp.com",
  projectId: "pickuptruckapp",
  storageBucket: "pickuptruckapp.appspot.com",
  messagingSenderId: "843958766652",
  appId: "1:843958766652:web:5efa2599441df2ba380739",
  measurementId: "G-QJWM3B1Y5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  MESSAGES: 'messages'
};

// User credentials for authentication
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!'; // You should use a strong password
const CUSTOMER_EMAIL = 'customer@example.com';
const CUSTOMER_PASSWORD = 'Customer123!';
const OWNER_EMAIL = 'owner@example.com';
const OWNER_PASSWORD = 'Owner123!';

// Helper function to create a timestamp for demo data
const createTimestamp = (dateStr) => {
  return Timestamp.fromDate(new Date(dateStr));
};

// Create a user in Firebase Auth and then in Firestore
const createUserWithProfile = async (email, password, profile) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Update profile with the actual UID
    const userProfile = {
      ...profile,
      uid: uid
    };
    
    // Create user document in Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, uid), userProfile);
    
    console.log(`Created user: ${email} with uid: ${uid}`);
    return uid;
  } catch (error) {
    console.error(`Error creating user ${email}:`, error);
    
    // If user already exists, try to sign in and continue
    if (error.code === 'auth/email-already-in-use') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(`User ${email} already exists, signed in instead.`);
        return userCredential.user.uid;
      } catch (signInError) {
        console.error(`Error signing in as ${email}:`, signInError);
        throw signInError;
      }
    } else {
      throw error;
    }
  }
};

// Create sample users
const createSampleUsers = async () => {
  console.log('Creating sample users...');
  
  // Admin user
  const adminUid = await createUserWithProfile(ADMIN_EMAIL, ADMIN_PASSWORD, {
    name: 'Admin User',
    email: ADMIN_EMAIL,
    role: 'admin',
    createdAt: createTimestamp('2023-01-01'),
    updatedAt: createTimestamp('2023-01-01'),
    hasCompletedOnboarding: true
  });
  
  // Customer user
  const customerUid = await createUserWithProfile(CUSTOMER_EMAIL, CUSTOMER_PASSWORD, {
    name: 'Sam Customer',
    email: CUSTOMER_EMAIL,
    phone: '555-123-4567',
    role: 'user',
    createdAt: createTimestamp('2023-01-15'),
    updatedAt: createTimestamp('2023-01-15'),
    profilePicture: 'https://i.pravatar.cc/150?u=customer123',
    hasCompletedOnboarding: true
  });
  
  // Owner user
  const ownerUid = await createUserWithProfile(OWNER_EMAIL, OWNER_PASSWORD, {
    name: 'Alex Owner',
    email: OWNER_EMAIL,
    phone: '555-987-6543',
    role: 'owner',
    vehicles: [],  // We'll update this after creating the vehicle
    businessName: 'Alex\'s Truck Services',
    availableDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    availableTimeSlots: {
      morning: true,
      afternoon: true,
      evening: false
    },
    createdAt: createTimestamp('2023-01-10'),
    updatedAt: createTimestamp('2023-01-10'),
    profilePicture: 'https://i.pravatar.cc/150?u=owner123',
    hasCompletedOnboarding: true
  });
  
  console.log('Sample users created successfully');
  
  // Return the created UIDs for later use
  return { adminUid, customerUid, ownerUid };
};

// Create sample vehicles
const createSampleVehicles = async (ownerUid) => {
  console.log('Creating sample vehicles...');
  
  // First, log in as the owner to have proper permissions
  await signInWithEmailAndPassword(auth, OWNER_EMAIL, OWNER_PASSWORD);
  
  // Sample pickup truck
  const vehicle1Id = 'vehicle_' + Date.now();
  await setDoc(doc(db, COLLECTIONS.VEHICLES, vehicle1Id), {
    id: vehicle1Id,
    ownerId: ownerUid,
    type: 'pickup',
    make: 'Ford',
    model: 'F-150',
    year: '2021',
    licensePlate: 'ABC123',
    capacity: 'Up to 1,500 lbs, 6.5 ft bed',
    photos: {
      front: 'https://images.unsplash.com/photo-1612972786010-9b7f6c97e3d4?w=600',
      back: 'https://images.unsplash.com/photo-1650845220672-4ccb69fa5443?w=600',
      side: 'https://images.unsplash.com/photo-1583866755917-c85213fd68de?w=600',
      cargo: 'https://images.unsplash.com/photo-1531758458995-80468aec72e4?w=600',
    },
    hourlyRate: 45,
    offerAssistance: true,
    assistanceRate: 25,
    createdAt: createTimestamp('2023-02-01'),
    updatedAt: createTimestamp('2023-02-01'),
    isActive: true
  });
  
  // Sample van
  const vehicle2Id = 'vehicle_' + (Date.now() + 1);
  await setDoc(doc(db, COLLECTIONS.VEHICLES, vehicle2Id), {
    id: vehicle2Id,
    ownerId: ownerUid,
    type: 'van',
    make: 'Mercedes',
    model: 'Sprinter',
    year: '2022',
    licensePlate: 'XYZ789',
    capacity: 'Up to 3,000 lbs, 170 cubic feet',
    photos: {
      front: 'https://images.unsplash.com/photo-1627728724880-03debb8ccdff?w=600',
      side: 'https://images.unsplash.com/photo-1631607160625-4171467ce37e?w=600',
      interior: 'https://images.unsplash.com/photo-1525742030284-0dae347943c4?w=600'
    },
    hourlyRate: 65,
    offerAssistance: false,
    createdAt: createTimestamp('2023-02-15'),
    updatedAt: createTimestamp('2023-02-15'),
    isActive: true
  });
  
  // Update the owner's profile with the vehicle IDs
  await setDoc(doc(db, COLLECTIONS.USERS, ownerUid), {
    vehicles: [vehicle1Id, vehicle2Id],
    updatedAt: createTimestamp(new Date().toISOString())
  }, { merge: true });
  
  console.log('Sample vehicles created successfully');
  
  return { vehicle1Id, vehicle2Id };
};

// Create sample bookings
const createSampleBookings = async (customerUid, ownerUid, vehicle1Id, vehicle2Id) => {
  console.log('Creating sample bookings...');
  
  // First, log in as the customer to have proper permissions
  await signInWithEmailAndPassword(auth, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
  
  // Completed booking
  const booking1Id = 'booking_' + Date.now();
  await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking1Id), {
    id: booking1Id,
    customerId: customerUid,
    ownerId: ownerUid,
    vehicleId: vehicle1Id,
    cargoDescription: 'Moving furniture (sofa, table, chairs)',
    pickupAddress: '123 Main St, New York, NY',
    destinationAddress: '456 Oak Ave, New York, NY',
    pickupDateTime: createTimestamp('2023-03-10T10:00:00'),
    estimatedHours: 3,
    needsAssistance: true,
    ridingAlong: true,
    status: 'completed',
    totalCost: 210,
    assistanceCost: 75,
    createdAt: createTimestamp('2023-03-05'),
    updatedAt: createTimestamp('2023-03-10'),
    completedAt: createTimestamp('2023-03-10T13:15:00'),
    notes: 'Customer has a narrow staircase at destination'
  });
  
  // Upcoming booking
  const booking2Id = 'booking_' + (Date.now() + 1);
  await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking2Id), {
    id: booking2Id,
    customerId: customerUid,
    ownerId: ownerUid,
    vehicleId: vehicle2Id,
    cargoDescription: 'Moving boxes from storage unit',
    pickupAddress: '789 Storage Ln, Brooklyn, NY',
    destinationAddress: '101 New Home St, Queens, NY',
    pickupDateTime: createTimestamp('2023-06-15T09:00:00'),
    estimatedHours: 4,
    needsAssistance: false,
    ridingAlong: true,
    status: 'confirmed',
    totalCost: 260,
    createdAt: createTimestamp('2023-06-01'),
    updatedAt: createTimestamp('2023-06-02'),
    notes: 'Customer will have 15-20 medium-sized boxes'
  });
  
  console.log('Sample bookings created successfully');
  
  return { booking1Id, booking2Id };
};

// Create sample reviews
const createSampleReviews = async (customerUid, ownerUid, vehicle1Id, booking1Id) => {
  console.log('Creating sample reviews...');
  
  // Customer review for owner
  await signInWithEmailAndPassword(auth, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
  const review1Id = 'review_' + Date.now();
  await setDoc(doc(db, COLLECTIONS.REVIEWS, review1Id), {
    id: review1Id,
    bookingId: booking1Id,
    reviewerId: customerUid,
    recipientId: ownerUid,
    vehicleId: vehicle1Id,
    rating: 5,
    comment: 'Alex was extremely helpful and made my move so much easier. The truck was clean and well-maintained. Highly recommend!',
    createdAt: createTimestamp('2023-03-11')
  });
  
  // Owner review for customer
  await signInWithEmailAndPassword(auth, OWNER_EMAIL, OWNER_PASSWORD);
  const review2Id = 'review_' + (Date.now() + 1);
  await setDoc(doc(db, COLLECTIONS.REVIEWS, review2Id), {
    id: review2Id,
    bookingId: booking1Id,
    reviewerId: ownerUid,
    recipientId: customerUid,
    rating: 4,
    comment: 'Sam was polite and punctual. Everything went smoothly with the move.',
    createdAt: createTimestamp('2023-03-12')
  });
  
  console.log('Sample reviews created successfully');
};

// Create sample messages
const createSampleMessages = async (customerUid, ownerUid, booking2Id) => {
  console.log('Creating sample messages...');
  
  // First message from customer
  await signInWithEmailAndPassword(auth, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
  const message1Id = 'message_' + Date.now();
  await setDoc(doc(db, COLLECTIONS.MESSAGES, message1Id), {
    id: message1Id,
    bookingId: booking2Id,
    senderId: customerUid,
    recipientId: ownerUid,
    text: 'Hi Alex, is it possible to start an hour earlier at 8am instead of 9am?',
    createdAt: createTimestamp('2023-06-10T14:23:15'),
    read: true
  });
  
  // Reply from owner
  await signInWithEmailAndPassword(auth, OWNER_EMAIL, OWNER_PASSWORD);
  const message2Id = 'message_' + (Date.now() + 1);
  await setDoc(doc(db, COLLECTIONS.MESSAGES, message2Id), {
    id: message2Id,
    bookingId: booking2Id,
    senderId: ownerUid,
    recipientId: customerUid,
    text: 'Sure Sam, 8am works for me. I\'ll see you then!',
    createdAt: createTimestamp('2023-06-10T15:45:22'),
    read: true
  });
  
  // Follow-up from customer
  await signInWithEmailAndPassword(auth, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
  const message3Id = 'message_' + (Date.now() + 2);
  await setDoc(doc(db, COLLECTIONS.MESSAGES, message3Id), {
    id: message3Id,
    bookingId: booking2Id,
    senderId: customerUid,
    recipientId: ownerUid,
    text: 'Great, thanks for accommodating! Do you have any moving blankets for the furniture?',
    createdAt: createTimestamp('2023-06-10T16:12:05'),
    read: false
  });
  
  console.log('Sample messages created successfully');
};

// Main function to run all initializations
const initializeFirestore = async () => {
  try {
    console.log('Starting Firebase initialization with authentication...');
    
    // Create users and get their UIDs
    const { adminUid, customerUid, ownerUid } = await createSampleUsers();
    
    // Create vehicles linked to the owner
    const { vehicle1Id, vehicle2Id } = await createSampleVehicles(ownerUid);
    
    // Create bookings between the customer and owner
    const { booking1Id, booking2Id } = await createSampleBookings(customerUid, ownerUid, vehicle1Id, vehicle2Id);
    
    // Create reviews for the completed booking
    await createSampleReviews(customerUid, ownerUid, vehicle1Id, booking1Id);
    
    // Create messages for the upcoming booking
    await createSampleMessages(customerUid, ownerUid, booking2Id);
    
    console.log('Firebase initialization completed successfully!');
    console.log('\nYou can now use these accounts to log in:');
    console.log(`Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log(`Customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
    console.log(`Owner: ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeFirestore();