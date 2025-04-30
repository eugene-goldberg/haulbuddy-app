import { 
  updateUserProfile,
  completeUserOnboarding
} from '../firebase/firestore-service';
import { CustomerProfile } from '../firebase/firestore-schema';

// Interface for customer profile data
export interface CustomerProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  // Additional customer preferences can be added here
  preferredNotifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  savedAddresses?: {
    home?: string;
    work?: string;
    other?: string[];
  };
}

/**
 * Complete the customer onboarding process by updating their profile
 * with customer-specific information
 */
export const completeCustomerOnboarding = async (
  userId: string,
  profileData: CustomerProfileData
): Promise<void> => {
  try {
    // Prepare profile updates with customer-specific fields
    const profileUpdates: Partial<CustomerProfile> = {
      role: 'user',
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      hasCompletedOnboarding: true,
      profilePicture: profileData.profilePicture
    };

    // Update additional fields if provided
    if (profileData.preferredNotifications) {
      profileUpdates.preferredNotifications = profileData.preferredNotifications;
    }

    if (profileData.savedAddresses) {
      profileUpdates.savedAddresses = profileData.savedAddresses;
    }

    // Update the user profile
    await updateUserProfile(userId, profileUpdates);
    
    // Mark onboarding as complete
    await completeUserOnboarding(userId);
    
    return;
  } catch (error) {
    console.error('Error completing customer onboarding:', error);
    throw error;
  }
};

/**
 * Check if a user has completed customer onboarding
 * This is a utility function to determine if the user should be shown
 * the onboarding screens or be taken directly to the booking interface
 */
export const hasCompletedCustomerOnboarding = async (
  userProfile: CustomerProfile | null
): Promise<boolean> => {
  // If no profile exists, onboarding is definitely not complete
  if (!userProfile) return false;
  
  // Check if the user has the right role and has completed onboarding
  return (
    userProfile.role === 'user' && 
    userProfile.hasCompletedOnboarding === true
  );
};

/**
 * Creates initial data for a new booking request
 * This is used to populate the booking form with default values
 */
export const createInitialBookingData = (customerId: string) => {
  return {
    customerId,
    cargoDescription: '',
    pickupAddress: '',
    destinationAddress: '',
    pickupDateTime: new Date(),
    estimatedHours: 2,
    needsAssistance: false,
    ridingAlong: true,
    totalCost: 0, // This will be calculated based on the selected vehicle
  };
};