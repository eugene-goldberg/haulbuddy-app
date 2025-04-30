import React, { createContext, useState, useContext, ReactNode } from 'react';
import { VehicleInfoData, PhotoItem, VehiclePricingData } from '../utils/validation';

// Onboarding state interface
interface OnboardingState {
  vehicleInfo: VehicleInfoData | null;
  vehiclePhotos: PhotoItem[];
  vehiclePricing: VehiclePricingData | null;
}

// Onboarding context interface
interface OnboardingContextValue extends OnboardingState {
  updateVehicleInfo: (info: VehicleInfoData) => void;
  updateVehiclePhotos: (photos: PhotoItem[]) => void;
  updateVehiclePricing: (pricing: VehiclePricingData) => void;
  resetOnboarding: () => void;
}

// Function to create the onboarding context and provider
export function createOnboardingContext() {
  // Create the context
  const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

  // Provider component
  function OnboardingProvider({ children }: { children: ReactNode }) {
    // Initial state
    const [state, setState] = useState<OnboardingState>({
      vehicleInfo: null,
      vehiclePhotos: [],
      vehiclePricing: null
    });

    // Update vehicle info
    const updateVehicleInfo = (info: VehicleInfoData) => {
      setState(prevState => ({
        ...prevState,
        vehicleInfo: info
      }));
    };

    // Update vehicle photos
    const updateVehiclePhotos = (photos: PhotoItem[]) => {
      setState(prevState => ({
        ...prevState,
        vehiclePhotos: photos
      }));
    };

    // Update vehicle pricing
    const updateVehiclePricing = (pricing: VehiclePricingData) => {
      setState(prevState => ({
        ...prevState,
        vehiclePricing: pricing
      }));
    };

    // Reset onboarding state
    const resetOnboarding = () => {
      setState({
        vehicleInfo: null,
        vehiclePhotos: [],
        vehiclePricing: null
      });
    };

    return (
      <OnboardingContext.Provider
        value={{
          ...state,
          updateVehicleInfo,
          updateVehiclePhotos,
          updateVehiclePricing,
          resetOnboarding
        }}
      >
        {children}
      </OnboardingContext.Provider>
    );
  }

  // Custom hook to use the onboarding context
  function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
      throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
  }

  return {
    OnboardingProvider,
    useOnboarding
  };
}

// Export a default instance of the onboarding context
const { OnboardingProvider, useOnboarding } = createOnboardingContext();
export { OnboardingProvider, useOnboarding };