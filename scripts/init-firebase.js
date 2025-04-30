// Firebase initialization script
// This script creates the initial collections and sample documents in your Firebase project
// Run with: node scripts/init-firebase.js

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  Timestamp 
} = require('firebase/firestore');

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

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  MESSAGES: 'messages'
};

// Helper function to create a timestamp for demo data
const createTimestamp = (dateStr) => {
  return Timestamp.fromDate(new Date(dateStr));
};

// Create sample users
const createSampleUsers = async () => {
  console.log('Creating sample users...');
  
  // Admin user
  await setDoc(doc(db, COLLECTIONS.USERS, 'admin123'), {
    uid: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: createTimestamp('2023-01-01'),
    updatedAt: createTimestamp('2023-01-01'),
    hasCompletedOnboarding: true
  });
  
  // Customer user
  await setDoc(doc(db, COLLECTIONS.USERS, 'customer123'), {
    uid: 'customer123',
    name: 'Sam Customer',
    email: 'customer@example.com',
    phone: '555-123-4567',
    role: 'user',
    createdAt: createTimestamp('2023-01-15'),
    updatedAt: createTimestamp('2023-01-15'),
    profilePicture: 'https://i.pravatar.cc/150?u=customer123',
    hasCompletedOnboarding: true
  });
  
  // Owner user
  await setDoc(doc(db, COLLECTIONS.USERS, 'owner123'), {
    uid: 'owner123',
    name: 'Alex Owner',
    email: 'owner@example.com',
    phone: '555-987-6543',
    role: 'owner',
    vehicles: ['vehicle123'],
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
};

// Create sample vehicles
const createSampleVehicles = async () => {
  console.log('Creating sample vehicles...');
  
  // Sample pickup truck
  await setDoc(doc(db, COLLECTIONS.VEHICLES, 'vehicle123'), {
    id: 'vehicle123',
    ownerId: 'owner123',
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
  await setDoc(doc(db, COLLECTIONS.VEHICLES, 'vehicle456'), {
    id: 'vehicle456',
    ownerId: 'owner123',
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
  
  console.log('Sample vehicles created successfully');
};

// Create sample bookings
const createSampleBookings = async () => {
  console.log('Creating sample bookings...');
  
  // Completed booking
  await setDoc(doc(db, COLLECTIONS.BOOKINGS, 'booking123'), {
    id: 'booking123',
    customerId: 'customer123',
    ownerId: 'owner123',
    vehicleId: 'vehicle123',
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
  await setDoc(doc(db, COLLECTIONS.BOOKINGS, 'booking456'), {
    id: 'booking456',
    customerId: 'customer123',
    ownerId: 'owner123',
    vehicleId: 'vehicle456',
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
};

// Create sample reviews
const createSampleReviews = async () => {
  console.log('Creating sample reviews...');
  
  // Customer review for owner
  await setDoc(doc(db, COLLECTIONS.REVIEWS, 'review123'), {
    id: 'review123',
    bookingId: 'booking123',
    reviewerId: 'customer123',
    recipientId: 'owner123',
    vehicleId: 'vehicle123',
    rating: 5,
    comment: 'Alex was extremely helpful and made my move so much easier. The truck was clean and well-maintained. Highly recommend!',
    createdAt: createTimestamp('2023-03-11')
  });
  
  // Owner review for customer
  await setDoc(doc(db, COLLECTIONS.REVIEWS, 'review456'), {
    id: 'review456',
    bookingId: 'booking123',
    reviewerId: 'owner123',
    recipientId: 'customer123',
    rating: 4,
    comment: 'Sam was polite and punctual. Everything went smoothly with the move.',
    createdAt: createTimestamp('2023-03-12')
  });
  
  console.log('Sample reviews created successfully');
};

// Create sample messages
const createSampleMessages = async () => {
  console.log('Creating sample messages...');
  
  // Conversation for booking456
  await setDoc(doc(db, COLLECTIONS.MESSAGES, 'message123'), {
    id: 'message123',
    bookingId: 'booking456',
    senderId: 'customer123',
    recipientId: 'owner123',
    text: 'Hi Alex, is it possible to start an hour earlier at 8am instead of 9am?',
    createdAt: createTimestamp('2023-06-10T14:23:15'),
    read: true
  });
  
  await setDoc(doc(db, COLLECTIONS.MESSAGES, 'message456'), {
    id: 'message456',
    bookingId: 'booking456',
    senderId: 'owner123',
    recipientId: 'customer123',
    text: 'Sure Sam, 8am works for me. I\'ll see you then!',
    createdAt: createTimestamp('2023-06-10T15:45:22'),
    read: true
  });
  
  await setDoc(doc(db, COLLECTIONS.MESSAGES, 'message789'), {
    id: 'message789',
    bookingId: 'booking456',
    senderId: 'customer123',
    recipientId: 'owner123',
    text: 'Great, thanks for accommodating! Do you have any moving blankets for the furniture?',
    createdAt: createTimestamp('2023-06-10T16:12:05'),
    read: false
  });
  
  console.log('Sample messages created successfully');
};

// Main function to run all initializations
const initializeFirestore = async () => {
  try {
    console.log('Starting Firebase initialization...');
    console.log('IMPORTANT: For this script to work, you may need to do one of the following:');
    console.log('1. Temporarily update your Firestore rules to allow writes without authentication');
    console.log('2. Or implement authentication in this script (recommended)');
    
    // Create collections in sequence
    await createSampleUsers();
    await createSampleVehicles();
    await createSampleBookings();
    await createSampleReviews();
    await createSampleMessages();
    
    console.log('Firebase initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeFirestore();