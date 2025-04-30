/**
 * Validation utility functions
 */

// Validate vehicle info form data
export interface VehicleInfoData {
  type: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  capacity: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateVehicleInfo = (data: VehicleInfoData): ValidationResult => {
  if (!data.type) {
    return { isValid: false, message: 'Please select a vehicle type' };
  }
  
  if (!data.make) {
    return { isValid: false, message: 'Please enter the vehicle make' };
  }
  
  if (!data.model) {
    return { isValid: false, message: 'Please enter the vehicle model' };
  }
  
  if (!data.year) {
    return { isValid: false, message: 'Please enter the vehicle year' };
  } else if (!/^\d{4}$/.test(data.year)) {
    return { isValid: false, message: 'Please enter a valid 4-digit year' };
  }
  
  if (!data.licensePlate) {
    return { isValid: false, message: 'Please enter the license plate number' };
  }
  
  if (!data.capacity) {
    return { isValid: false, message: 'Please select a cargo capacity' };
  }
  
  return { isValid: true, message: '' };
};

// Validate vehicle pricing form data
export interface VehiclePricingData {
  hourlyRate: string;
  offerAssistance: boolean;
  assistanceRate?: string;
  availableDays: {
    [key: string]: boolean;
  };
  availableTimeSlots: {
    [key: string]: boolean;
  };
}

export const validateVehiclePricing = (data: VehiclePricingData): ValidationResult => {
  if (!data.hourlyRate) {
    return { isValid: false, message: 'Please enter an hourly rate' };
  }
  
  const hourlyRateNum = parseFloat(data.hourlyRate);
  if (isNaN(hourlyRateNum) || hourlyRateNum <= 0) {
    return { isValid: false, message: 'Please enter a valid hourly rate greater than 0' };
  }
  
  if (data.offerAssistance && (!data.assistanceRate || data.assistanceRate === '0')) {
    return { isValid: false, message: 'Please enter an assistance rate' };
  }
  
  const availableDaysCount = Object.values(data.availableDays).filter(Boolean).length;
  if (availableDaysCount === 0) {
    return { isValid: false, message: 'Please select at least one available day' };
  }
  
  const availableTimeSlotsCount = Object.values(data.availableTimeSlots).filter(Boolean).length;
  if (availableTimeSlotsCount === 0) {
    return { isValid: false, message: 'Please select at least one available time slot' };
  }
  
  return { isValid: true, message: '' };
};

// Validate vehicle photos
export interface PhotoItem {
  id: string;
  type: string;
  uri: string;
}

export const validateVehiclePhotos = (photos: PhotoItem[]): ValidationResult => {
  if (photos.length < 3) {
    return { isValid: false, message: 'Please add at least 3 photos of your vehicle' };
  }
  
  return { isValid: true, message: '' };
};