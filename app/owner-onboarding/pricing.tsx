import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function PricingScreen() {
  const [hourlyRate, setHourlyRate] = useState('45');
  const [offerAssistance, setOfferAssistance] = useState(false);
  const [assistanceRate, setAssistanceRate] = useState('15');
  const [availableDays, setAvailableDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: true,
    saturday: true,
    sunday: true,
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState({
    morning: true,
    afternoon: true,
    evening: false,
    night: false,
  });

  const toggleDay = (day: keyof typeof availableDays) => {
    setAvailableDays(prevState => ({
      ...prevState,
      [day]: !prevState[day]
    }));
  };

  const toggleTimeSlot = (slot: keyof typeof availableTimeSlots) => {
    setAvailableTimeSlots(prevState => ({
      ...prevState,
      [slot]: !prevState[slot]
    }));
  };

  const handleContinue = () => {
    // In a real app, this would submit the data and proceed
    // For now, navigate to a confirmation page
    router.push('/owner-onboarding/confirmation');
  };

  const handleBack = () => {
    router.back();
  };

  const calculatePotentialEarnings = () => {
    const hourlyRateNum = parseInt(hourlyRate) || 0;
    const assistanceRateNum = parseInt(assistanceRate) || 0;
    const averageTripsPerWeek = 3; // Assumed value
    const averageHoursPerTrip = 2; // Assumed value
    
    // Calculate based on availability
    const daysAvailable = Object.values(availableDays).filter(Boolean).length;
    const daysMultiplier = daysAvailable / 7;
    
    const baseEarnings = hourlyRateNum * averageHoursPerTrip * averageTripsPerWeek;
    const assistanceEarnings = offerAssistance ? assistanceRateNum * averageHoursPerTrip * averageTripsPerWeek : 0;
    const totalPotential = (baseEarnings + assistanceEarnings) * daysMultiplier;
    
    return `$${Math.round(totalPotential)} - $${Math.round(totalPotential * 1.5)}`;
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
            <Text style={styles.title}>Pricing & Availability</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 3 of 3</Text>
            </View>
          </View>

          <Text style={styles.sectionDescription}>
            Set your rates and when your truck is available for booking.
          </Text>

          <View style={styles.pricingContainer}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            
            <View style={styles.hourlyRateContainer}>
              <Text style={styles.inputLabel}>Hourly Rate</Text>
              <View style={styles.rateInputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.rateInput}
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  keyboardType="number-pad"
                  placeholder="45"
                  placeholderTextColor="#999"
                />
                <Text style={styles.perHour}>/hr</Text>
              </View>
            </View>
            
            <View style={styles.assistanceContainer}>
              <View style={styles.assistanceHeader}>
                <Text style={styles.inputLabel}>Offer Loading/Unloading Assistance</Text>
                <Switch
                  value={offerAssistance}
                  onValueChange={setOfferAssistance}
                  trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                  thumbColor={offerAssistance ? '#4a80f5' : '#f4f3f4'}
                  ios_backgroundColor="#d1d1d6"
                />
              </View>
              
              {offerAssistance && (
                <View style={styles.assistanceRateContainer}>
                  <Text style={styles.inputSubLabel}>Additional Rate for Assistance</Text>
                  <View style={styles.rateInputContainer}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.rateInput}
                      value={assistanceRate}
                      onChangeText={setAssistanceRate}
                      keyboardType="number-pad"
                      placeholder="15"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.perHour}>/hr</Text>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.earningsContainer}>
              <Text style={styles.earningsLabel}>Potential Weekly Earnings</Text>
              <Text style={styles.earningsAmount}>{calculatePotentialEarnings()}</Text>
              <Text style={styles.earningsSubtext}>Based on your availability and rates</Text>
            </View>
          </View>

          <View style={styles.availabilityContainer}>
            <Text style={styles.sectionTitle}>Availability</Text>
            
            <Text style={styles.availabilitySubtitle}>Available Days</Text>
            <View style={styles.daysContainer}>
              {Object.entries(availableDays).map(([day, isSelected]) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    isSelected && styles.selectedDay
                  ]}
                  onPress={() => toggleDay(day as keyof typeof availableDays)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    isSelected && styles.selectedDayText
                  ]}>
                    {day.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.availabilitySubtitle}>Available Time Slots</Text>
            <View style={styles.timeSlotsContainer}>
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  availableTimeSlots.morning && styles.selectedTimeSlot
                ]}
                onPress={() => toggleTimeSlot('morning')}
              >
                <Ionicons 
                  name="sunny-outline" 
                  size={24} 
                  color={availableTimeSlots.morning ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.timeSlotText,
                  availableTimeSlots.morning && styles.selectedTimeSlotText
                ]}>
                  Morning
                </Text>
                <Text style={styles.timeSlotHours}>6 AM - 12 PM</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  availableTimeSlots.afternoon && styles.selectedTimeSlot
                ]}
                onPress={() => toggleTimeSlot('afternoon')}
              >
                <Ionicons 
                  name="partly-sunny-outline" 
                  size={24} 
                  color={availableTimeSlots.afternoon ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.timeSlotText,
                  availableTimeSlots.afternoon && styles.selectedTimeSlotText
                ]}>
                  Afternoon
                </Text>
                <Text style={styles.timeSlotHours}>12 PM - 5 PM</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  availableTimeSlots.evening && styles.selectedTimeSlot
                ]}
                onPress={() => toggleTimeSlot('evening')}
              >
                <Ionicons 
                  name="moon-outline" 
                  size={24} 
                  color={availableTimeSlots.evening ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.timeSlotText,
                  availableTimeSlots.evening && styles.selectedTimeSlotText
                ]}>
                  Evening
                </Text>
                <Text style={styles.timeSlotHours}>5 PM - 10 PM</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  availableTimeSlots.night && styles.selectedTimeSlot
                ]}
                onPress={() => toggleTimeSlot('night')}
              >
                <Ionicons 
                  name="moon" 
                  size={24} 
                  color={availableTimeSlots.night ? '#4a80f5' : '#888'} 
                />
                <Text style={[
                  styles.timeSlotText,
                  availableTimeSlots.night && styles.selectedTimeSlotText
                ]}>
                  Night
                </Text>
                <Text style={styles.timeSlotHours}>10 PM - 6 AM</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.noteContainer}>
              <MaterialIcons name="info-outline" size={20} color="#4a80f5" />
              <Text style={styles.noteText}>
                You can update your availability anytime in settings.
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Submit & Finish</Text>
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
  pricingContainer: {
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
  availabilityContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  hourlyRateContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  dollarSign: {
    fontSize: 18,
    color: '#4a80f5',
    marginRight: 8,
  },
  rateInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  perHour: {
    fontSize: 16,
    color: '#666',
  },
  assistanceContainer: {
    marginBottom: 20,
  },
  assistanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  assistanceRateContainer: {
    marginLeft: 10,
  },
  inputSubLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  earningsContainer: {
    backgroundColor: '#f0f5ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#4a80f5',
    marginBottom: 5,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  earningsSubtext: {
    fontSize: 12,
    color: '#888',
  },
  availabilitySubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    marginTop: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedDay: {
    backgroundColor: '#4a80f5',
    borderColor: '#4a80f5',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedDayText: {
    color: 'white',
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: '#f0f5ff',
    borderColor: '#4a80f5',
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  selectedTimeSlotText: {
    color: '#4a80f5',
  },
  timeSlotHours: {
    fontSize: 12,
    color: '#888',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
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