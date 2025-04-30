import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { validateVehicleInfo } from '../../utils/validation';

export default function VehicleInfoScreen() {
  const { user } = useAuth();
  const { vehicleInfo, updateVehicleInfo } = useOnboarding();

  // Initialize state with data from context if available
  const [vehicleType, setVehicleType] = useState(vehicleInfo?.type || '');
  const [make, setMake] = useState(vehicleInfo?.make || '');
  const [model, setModel] = useState(vehicleInfo?.model || '');
  const [year, setYear] = useState(vehicleInfo?.year || '');
  const [licensePlate, setLicensePlate] = useState(vehicleInfo?.licensePlate || '');
  const [selectedCapacity, setSelectedCapacity] = useState(vehicleInfo?.capacity || '');

  const handleContinue = () => {
    // Validate the form
    const data = {
      type: vehicleType,
      make,
      model,
      year,
      licensePlate,
      capacity: selectedCapacity
    };

    const validationResult = validateVehicleInfo(data);
    if (!validationResult.isValid) {
      Alert.alert('Please complete all fields', validationResult.message);
      return;
    }

    // Save the data to the onboarding context
    updateVehicleInfo(data);

    // Navigate to the next screen
    router.push('/owner-onboarding/vehicle-photos');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Vehicle Information</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 1 of 3</Text>
            </View>
          </View>

          <Text style={styles.sectionDescription}>
            Please provide details about your truck to help customers find the right vehicle for their needs.
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Vehicle Type</Text>
            <View style={styles.typeSelectContainer}>
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  vehicleType === 'pickup' && styles.selectedType
                ]}
                onPress={() => setVehicleType('pickup')}
              >
                <Ionicons 
                  name="car" 
                  size={24} 
                  color={vehicleType === 'pickup' ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.typeText,
                  vehicleType === 'pickup' && styles.selectedTypeText
                ]}>
                  Pickup Truck
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  vehicleType === 'van' && styles.selectedType
                ]}
                onPress={() => setVehicleType('van')}
              >
                <Ionicons 
                  name="cube" 
                  size={24} 
                  color={vehicleType === 'van' ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.typeText,
                  vehicleType === 'van' && styles.selectedTypeText
                ]}>
                  Cargo Van
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  vehicleType === 'box truck' && styles.selectedType
                ]}
                onPress={() => setVehicleType('box truck')}
              >
                <Ionicons 
                  name="cube-outline" 
                  size={24} 
                  color={vehicleType === 'box truck' ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.typeText,
                  vehicleType === 'box truck' && styles.selectedTypeText
                ]}>
                  Box Truck
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Make</Text>
            <TextInput
              style={styles.input}
              value={make}
              onChangeText={setMake}
              placeholder="e.g., Ford, Chevrolet, Toyota"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Model</Text>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="e.g., F-150, Silverado, Tacoma"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Year</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2020"
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>License Plate</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="License plate number"
              autoCapitalize="characters"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Cargo Capacity</Text>
            <View style={styles.capacityContainer}>
              <TouchableOpacity 
                style={[
                  styles.capacityOption, 
                  selectedCapacity === 'small' && styles.selectedCapacity
                ]}
                onPress={() => setSelectedCapacity('small')}
              >
                <Text style={[
                  styles.capacityText,
                  selectedCapacity === 'small' && styles.selectedCapacityText
                ]}>
                  Small
                </Text>
                <Text style={styles.capacityDescription}>
                  Up to 500 lbs
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.capacityOption, 
                  selectedCapacity === 'medium' && styles.selectedCapacity
                ]}
                onPress={() => setSelectedCapacity('medium')}
              >
                <Text style={[
                  styles.capacityText,
                  selectedCapacity === 'medium' && styles.selectedCapacityText
                ]}>
                  Medium
                </Text>
                <Text style={styles.capacityDescription}>
                  Up to 1,500 lbs
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.capacityOption, 
                  selectedCapacity === 'large' && styles.selectedCapacity
                ]}
                onPress={() => setSelectedCapacity('large')}
              >
                <Text style={[
                  styles.capacityText,
                  selectedCapacity === 'large' && styles.selectedCapacityText
                ]}>
                  Large
                </Text>
                <Text style={styles.capacityDescription}>
                  Up to 3,000+ lbs
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backArrow: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  stepIndicator: {
    paddingHorizontal: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  typeSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  selectedType: {
    borderColor: '#4a80f5',
    backgroundColor: '#f0f5ff',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  selectedTypeText: {
    color: '#4a80f5',
    fontWeight: '500',
  },
  capacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  capacityOption: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  selectedCapacity: {
    borderColor: '#4a80f5',
    backgroundColor: '#f0f5ff',
  },
  capacityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  selectedCapacityText: {
    color: '#4a80f5',
  },
  capacityDescription: {
    fontSize: 12,
    color: '#888',
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: '600',
  },
});