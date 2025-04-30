import { collection, doc, setDoc, getDoc, updateDoc, addDoc, serverTimestamp, 
  getDocs, query, where, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  UserProfile, CustomerProfile, OwnerProfile, Vehicle, Booking, Review, Message, 
  COLLECTIONS, BookingStatus, VehicleType
} from './firestore-schema';

/**
 * User Profile Functions
 */

// Create a new user profile document
export const createUserProfile = async (profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, profile.uid);
    
    const newProfile = {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      hasCompletedOnboarding: false
    };
    
    await setDoc(userRef, newProfile);
    
    // We need to fetch the document with timestamps to return
    const doc = await getDoc(userRef);
    return doc.data() as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get a user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update a user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Mark user onboarding as complete
export const completeUserOnboarding = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      hasCompletedOnboarding: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error completing user onboarding:', error);
    throw error;
  }
};

/**
 * Vehicle Management Functions
 */

// Create a new vehicle
export const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
  try {
    const vehicleRef = doc(collection(db, COLLECTIONS.VEHICLES));
    
    const newVehicle = {
      ...vehicleData,
      id: vehicleRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };
    
    await setDoc(vehicleRef, newVehicle);
    
    // Add this vehicle ID to the owner's profile
    const userRef = doc(db, COLLECTIONS.USERS, vehicleData.ownerId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as OwnerProfile;
      const vehicles = userData.vehicles || [];
      
      await updateDoc(userRef, {
        vehicles: [...vehicles, vehicleRef.id],
        updatedAt: serverTimestamp()
      });
    }
    
    // We need to fetch the document with timestamps to return
    const vehicleDoc = await getDoc(vehicleRef);
    return vehicleDoc.data() as Vehicle;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

// Get a vehicle by ID
export const getVehicle = async (vehicleId: string): Promise<Vehicle | null> => {
  try {
    const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    const vehicleDoc = await getDoc(vehicleRef);
    
    if (!vehicleDoc.exists()) {
      return null;
    }
    
    return vehicleDoc.data() as Vehicle;
  } catch (error) {
    console.error('Error getting vehicle:', error);
    throw error;
  }
};

// Get all vehicles for an owner
export const getOwnerVehicles = async (ownerId: string): Promise<Vehicle[]> => {
  try {
    const vehiclesQuery = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(vehiclesQuery);
    return snapshot.docs.map(doc => doc.data() as Vehicle);
  } catch (error) {
    console.error('Error getting owner vehicles:', error);
    throw error;
  }
};

// Update a vehicle
export const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>): Promise<void> => {
  try {
    const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    await updateDoc(vehicleRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

// Upload a vehicle photo and get the URL
export const uploadVehiclePhoto = async (
  vehicleId: string, 
  photoType: keyof Vehicle['photos'], 
  uri: string
): Promise<string> => {
  try {
    // Create blob from URI
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate a unique filename
    const filename = `${vehicleId}_${photoType}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `vehicle-photos/${filename}`);
    
    // Upload the blob
    await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update the vehicle document with the new photo URL
    const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    await updateDoc(vehicleRef, {
      [`photos.${photoType}`]: downloadUrl,
      updatedAt: serverTimestamp()
    });
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading vehicle photo:', error);
    throw error;
  }
};

/**
 * Booking Functions
 */

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Booking> => {
  try {
    // Generate a document reference with auto-ID
    const bookingRef = doc(collection(db, COLLECTIONS.BOOKINGS));
    const bookingId = bookingRef.id;
    
    console.log('DEBUG - Creating booking with ID:', bookingId);
    
    // Create booking data with ID field
    const newBooking = {
      ...bookingData,
      id: bookingId, // Store ID in the document data
      status: 'pending' as BookingStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Write to Firestore
    await setDoc(bookingRef, newBooking);
    console.log('DEBUG - Booking successfully written to Firestore');
    
    // We need to fetch the document with timestamps to return
    const bookingDoc = await getDoc(bookingRef);
    const data = bookingDoc.data();
    
    // Ensure the ID is included in the returned data
    const bookingWithId = { 
      ...data, 
      id: bookingId 
    } as Booking;
    
    console.log('DEBUG - Returning booking:', JSON.stringify(bookingWithId));
    return bookingWithId;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get a booking by ID
export const getBooking = async (bookingId: string): Promise<Booking | null> => {
  try {
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      return null;
    }
    
    return bookingDoc.data() as Booking;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Get bookings for a customer
export const getCustomerBookings = async (customerId: string): Promise<Booking[]> => {
  try {
    const bookingsQuery = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(bookingsQuery);
    const bookings = snapshot.docs.map(doc => {
      // Ensure we're getting the data with the document ID
      const data = doc.data();
      // Ensure the document ID is set properly
      return { ...data, id: doc.id } as Booking;
    });
    
    console.log('DEBUG - getCustomerBookings found:', bookings.length, 'bookings');
    console.log('DEBUG - getCustomerBookings first booking:', bookings[0] ? JSON.stringify(bookings[0]) : 'No bookings');
    
    return bookings;
  } catch (error) {
    console.error('Error getting customer bookings:', error);
    throw error;
  }
};

// Get bookings for an owner
export const getOwnerBookings = async (ownerId: string): Promise<Booking[]> => {
  try {
    const bookingsQuery = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(bookingsQuery);
    return snapshot.docs.map(doc => doc.data() as Booking);
  } catch (error) {
    console.error('Error getting owner bookings:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
  try {
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    
    const updates: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    // If completing the booking, add the completion timestamp
    if (status === 'completed') {
      updates.completedAt = serverTimestamp();
    }
    
    await updateDoc(bookingRef, updates);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

/**
 * Helper Functions
 */

// Convert Firebase timestamp to Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Convert Date to Firebase timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  try {
    // Ensure the date is valid first
    if (isNaN(date.getTime())) {
      console.error('Invalid date provided to dateToTimestamp:', date);
      // Fallback to current date if invalid
      return Timestamp.fromDate(new Date());
    }
    // Use direct timestamp creation with seconds and nanoseconds
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    return new Timestamp(seconds, nanoseconds);
  } catch (error) {
    console.error('Error converting date to timestamp:', error);
    // Fallback to current date if error occurs
    return Timestamp.fromDate(new Date());
  }
};