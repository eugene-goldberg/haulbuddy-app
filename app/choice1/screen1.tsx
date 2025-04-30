import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useBooking } from '../../contexts/BookingContext';

export default function Choice1Screen1() {
  const { bookingData, updateBookingData } = useBooking();
  
  // Initialize local state from context
  const [cargoDescription, setCargoDescription] = useState(bookingData.cargoDescription || '');
  const [pickupAddress, setPickupAddress] = useState(bookingData.pickupAddress || '');
  const [destinationAddress, setDestinationAddress] = useState(bookingData.destinationAddress || '');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [needsAssistance, setNeedsAssistance] = useState(bookingData.needsAssistance || false);
  const [ridingAlong, setRidingAlong] = useState(bookingData.ridingAlong || false);
  
  // Combined date and time for submission
  const pickupDateTime = pickupDate && pickupTime ? `${pickupDate} ${pickupTime}` : '';
  
  // Initialize date and time from context if available
  useEffect(() => {
    if (bookingData.pickupDateTime) {
      const date = new Date(bookingData.pickupDateTime);
      setPickupDate(date.toLocaleDateString('en-US'));
      setPickupTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Describe your cargo</Text>
          <TextInput
            style={styles.inputField}
            multiline
            numberOfLines={3}
            value={cargoDescription}
            onChangeText={setCargoDescription}
            placeholder="e.g., furniture, appliances, boxes"
          />
          
          <Text style={styles.formLabel}>Enter the pick up address</Text>
          <TextInput
            style={styles.inputField}
            value={pickupAddress}
            onChangeText={setPickupAddress}
            placeholder="Street address, city, state, zip"
          />
          
          <Text style={styles.formLabel}>Enter the destination address</Text>
          <TextInput
            style={styles.inputField}
            value={destinationAddress}
            onChangeText={setDestinationAddress}
            placeholder="Street address, city, state, zip"
          />
          
          <Text style={styles.formLabel}>Enter the desired date and time of the pick up</Text>
          
          {/* Date and Time inputs with separate fields */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateTimeLabel}>Date:</Text>
              <TextInput
                style={styles.dateTimeInput}
                value={pickupDate}
                onChangeText={setPickupDate}
                placeholder="MM/DD/YYYY"
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.timeInputContainer}>
              <Text style={styles.dateTimeLabel}>Time:</Text>
              <TextInput
                style={styles.dateTimeInput}
                value={pickupTime}
                onChangeText={setPickupTime}
                placeholder="HH:MM AM/PM"
                keyboardType="default"
              />
            </View>
          </View>
          
          {/* Helper text for date/time format */}
          <Text style={styles.helperText}>
            Please enter date as MM/DD/YYYY and time as HH:MM AM/PM
          </Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Will you require assistance with loading / unloading?</Text>
            <View style={styles.switchWithLabel}>
              <Text style={styles.switchValueLabel}>{needsAssistance ? 'Yes' : 'No'}</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#4a80f5' }}
                thumbColor={needsAssistance ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
                onValueChange={setNeedsAssistance}
                value={needsAssistance}
                style={styles.switch}
              />
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Will you be riding along with the driver?</Text>
            <View style={styles.switchWithLabel}>
              <Text style={styles.switchValueLabel}>{ridingAlong ? 'Yes' : 'No'}</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#4a80f5' }}
                thumbColor={ridingAlong ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
                onValueChange={setRidingAlong}
                value={ridingAlong}
                style={styles.switch}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Save form data to the context before navigating
              updateBookingData({
                cargoDescription,
                pickupAddress,
                destinationAddress,
                pickupDateTime: pickupDateTime ? new Date(pickupDateTime) : new Date(),
                needsAssistance,
                ridingAlong,
                estimatedHours: 2 // Default value
              });
              router.push('/choice1/screen2');
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/choice')}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  formCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 50,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 5,
  },
  timeInputContainer: {
    flex: 1,
    marginLeft: 5,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  dateTimeInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    height: 50,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  switchContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  switchWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchValueLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 16,
    width: 40,
    textAlign: 'right',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  button: {
    width: '100%',
    backgroundColor: '#4a80f5',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});