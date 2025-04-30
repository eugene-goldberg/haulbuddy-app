/**
 * This file defines the Firestore data model for the application.
 * It provides TypeScript interfaces that represent the structure
 * of documents in each collection.
 */

// User roles
export type UserRole = 'user' | 'owner' | 'admin';

// Base user profile interface shared between all user types
export interface UserProfile {
  uid: string;            // Firebase Auth User ID
  name: string;           // User's display name
  email: string;          // User's email address
  phone?: string;         // Optional phone number
  role: UserRole;         // User role
  createdAt: firebase.firestore.Timestamp; // Account creation timestamp
  updatedAt: firebase.firestore.Timestamp; // Last update timestamp
  profilePicture?: string; // URL to profile picture
  hasCompletedOnboarding: boolean; // Whether the user has completed the onboarding process
}

// Customer user profile - extends the base profile
export interface CustomerProfile extends UserProfile {
  role: 'user';
  // Additional customer-specific fields could be added here
}

// Owner user profile - extends the base profile
export interface OwnerProfile extends UserProfile {
  role: 'owner';
  vehicles: string[];            // Array of vehicle IDs owned by this user
  businessName?: string;         // Optional business name
  availableDays?: {              // Days when the owner is available
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  availableTimeSlots?: {         // Time slots when the owner is available
    morning: boolean;            // 6am-12pm
    afternoon: boolean;          // 12pm-5pm
    evening: boolean;            // 5pm-10pm
  };
}

// Vehicle type enumeration
export type VehicleType = 'pickup' | 'van' | 'box truck' | 'flatbed' | 'other';

// Vehicle document interface
export interface Vehicle {
  id: string;                    // Vehicle document ID
  ownerId: string;               // Owner's user ID
  type: VehicleType;             // Type of vehicle
  make: string;                  // Vehicle make
  model: string;                 // Vehicle model
  year: string;                  // Vehicle year
  licensePlate: string;          // License plate number
  capacity: string;              // Cargo capacity description
  photos: {                      // Vehicle photos
    front?: string;              // Front view photo URL
    back?: string;               // Back view photo URL
    side?: string;               // Side view photo URL
    cargo?: string;              // Cargo area photo URL
    interior?: string;           // Interior photo URL
  };
  hourlyRate: number;            // Base hourly rate
  offerAssistance: boolean;      // Whether the owner offers loading/unloading assistance
  assistanceRate?: number;       // Hourly rate for assistance (if offered)
  createdAt: firebase.firestore.Timestamp; // Creation timestamp
  updatedAt: firebase.firestore.Timestamp; // Last update timestamp
  isActive: boolean;             // Whether this vehicle is active and available for booking
}

// Booking status type
export type BookingStatus = 
  'pending' |         // Awaiting owner confirmation
  'confirmed' |       // Confirmed by owner
  'in-progress' |     // Currently active
  'completed' |       // Completed successfully
  'cancelled' |       // Cancelled by either party
  'declined';         // Declined by owner

// Booking document interface
export interface Booking {
  id: string;                    // Booking document ID
  customerId: string;            // Customer's user ID
  ownerId: string;               // Owner's user ID
  vehicleId: string;             // Vehicle ID
  cargoDescription: string;      // Description of cargo being transported
  pickupAddress: string;         // Pickup address
  destinationAddress: string;    // Destination address
  pickupDateTime: firebase.firestore.Timestamp; // Scheduled pickup date/time
  estimatedHours: number;        // Estimated hours needed
  needsAssistance: boolean;      // Whether assistance is needed for loading/unloading
  ridingAlong: boolean;          // Whether customer is riding along
  status: BookingStatus;         // Current status of the booking
  totalCost: number;             // Total estimated cost
  assistanceCost?: number;       // Additional cost for assistance (if applicable)
  createdAt: firebase.firestore.Timestamp; // Booking creation timestamp
  updatedAt: firebase.firestore.Timestamp; // Last update timestamp
  completedAt?: firebase.firestore.Timestamp; // When the booking was completed
  notes?: string;                // Any additional notes
}

// Review document interface
export interface Review {
  id: string;                    // Review document ID
  bookingId: string;             // Associated booking ID
  reviewerId: string;            // User ID of the reviewer
  recipientId: string;           // User ID of the person being reviewed
  vehicleId?: string;            // Vehicle ID (if applicable)
  rating: number;                // Rating (1-5)
  comment: string;               // Review text
  createdAt: firebase.firestore.Timestamp; // Creation timestamp
}

// Message document interface for in-app chat
export interface Message {
  id: string;                    // Message document ID
  bookingId: string;             // Associated booking ID
  senderId: string;              // User ID of sender
  recipientId: string;           // User ID of recipient
  text: string;                  // Message text
  createdAt: firebase.firestore.Timestamp; // Creation timestamp
  read: boolean;                 // Whether the message has been read
}

// Collection paths for reference
export const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  MESSAGES: 'messages'
};