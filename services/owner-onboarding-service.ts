import { 
  createVehicle, 
  uploadVehiclePhoto, 
  updateUserProfile,
  completeUserOnboarding
} from '../firebase/firestore-service';
import { VehicleInfoData, VehiclePricingData, PhotoItem } from '../utils/validation';
import { Vehicle, OwnerProfile } from '../firebase/firestore-schema';

// Interface that combines all onboarding data
export interface OwnerOnboardingData {
  vehicleInfo: VehicleInfoData;
  photos: PhotoItem[];
  pricing: VehiclePricingData;
}

/**
 * Complete the owner onboarding process by creating a vehicle record,
 * uploading photos, and updating user profile information
 */
export const completeOwnerOnboarding = async (
  userId: string,
  onboardingData: OwnerOnboardingData
): Promise<string> => {
  try {
    // 1. Create the vehicle record
    const vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> = {
      ownerId: userId,
      type: onboardingData.vehicleInfo.type as any, // Cast to VehicleType
      make: onboardingData.vehicleInfo.make,
      model: onboardingData.vehicleInfo.model,
      year: onboardingData.vehicleInfo.year,
      licensePlate: onboardingData.vehicleInfo.licensePlate,
      capacity: onboardingData.vehicleInfo.capacity,
      photos: {},
      hourlyRate: parseFloat(onboardingData.pricing.hourlyRate),
      offerAssistance: onboardingData.pricing.offerAssistance,
      assistanceRate: onboardingData.pricing.offerAssistance ? parseFloat(onboardingData.pricing.assistanceRate || '0') : 0,
      isActive: true
    };

    // Create the vehicle record in Firestore
    const vehicle = await createVehicle(vehicleData);

    // 2. Upload photos one by one
    const photoPromises = onboardingData.photos.map(photo => 
      uploadVehiclePhoto(vehicle.id, photo.type as any, photo.uri)
    );

    // Wait for all photo uploads to complete
    await Promise.all(photoPromises);

    // 3. Update the user profile with availability information
    const profileUpdates: Partial<OwnerProfile> = {
      role: 'owner',
      hasCompletedOnboarding: true,
      availableDays: onboardingData.pricing.availableDays,
      availableTimeSlots: onboardingData.pricing.availableTimeSlots
    };

    await updateUserProfile(userId, profileUpdates);
    await completeUserOnboarding(userId);

    return vehicle.id;
  } catch (error) {
    console.error('Error completing owner onboarding:', error);
    throw error;
  }
};

/**
 * Calculates potential earnings based on pricing and availability
 */
export const calculatePotentialEarnings = (pricing: VehiclePricingData): { min: number, max: number } => {
  const hourlyRateNum = parseFloat(pricing.hourlyRate) || 0;
  const assistanceRateNum = pricing.offerAssistance ? (parseFloat(pricing.assistanceRate || '0') || 0) : 0;
  
  // Calculate based on availability
  const availableDaysCount = Object.values(pricing.availableDays).filter(Boolean).length;
  const daysMultiplier = availableDaysCount / 7;
  
  // Assumed values
  const averageTripsPerWeek = 3;
  const averageHoursPerTrip = 2;
  
  const baseEarnings = hourlyRateNum * averageHoursPerTrip * averageTripsPerWeek;
  const assistanceEarnings = pricing.offerAssistance ? assistanceRateNum * averageHoursPerTrip * averageTripsPerWeek : 0;
  const totalPotential = (baseEarnings + assistanceEarnings) * daysMultiplier;
  
  return {
    min: Math.round(totalPotential),
    max: Math.round(totalPotential * 1.5)
  };
};