import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useBooking } from '../../contexts/BookingContext';
import { Ionicons } from '@expo/vector-icons';

export default function Choice1Screen1() {
  const { bookingData, updateBookingData } = useBooking();
  
  // Helper function to format date and round time to 15 minutes - simplified
  const getFormattedDateAndTime = () => {
    const now = new Date();
    
    // Format date explicitly to ensure correctness: MM/DD/YYYY
    const month = now.getMonth() + 1; // getMonth() is 0-indexed
    const day = now.getDate();
    const year = now.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    
    // Time calculation (current + 15 minutes, rounded to nearest 15)
    let hours = now.getHours();
    let minutes = now.getMinutes() + 15; // Add 15 minutes
    
    // Round minutes to nearest 15
    minutes = Math.ceil(minutes / 15) * 15;
    
    // Handle minute overflow
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    
    // Handle hour overflow (24-hour clock)
    hours = hours % 24;
    
    // Convert to 12-hour format for display
    let displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Format the time string with padded minutes
    const formattedTime = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    console.log('Generated initial time:', formattedTime);
    
    return { formattedDate, formattedTime };
  };

  // Initialize local state from context
  const [cargoDescription, setCargoDescription] = useState(bookingData.cargoDescription || '');
  const [pickupAddress, setPickupAddress] = useState(bookingData.pickupAddress || '');
  const [destinationAddress, setDestinationAddress] = useState(bookingData.destinationAddress || '');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [needsAssistance, setNeedsAssistance] = useState(bookingData.needsAssistance || false);
  const [ridingAlong, setRidingAlong] = useState(bookingData.ridingAlong || false);
  
  // Create a proper Date object from separate date and time inputs
  const createPickupDateTimeObject = () => {
    if (!pickupDate || !pickupTime) return new Date();
    
    try {
      // Parse the date components (MM/DD/YYYY)
      const [month, day, year] = pickupDate.split('/').map(num => parseInt(num, 10));
      
      // Parse the time components (H:MM AM/PM)
      const timeMatch = pickupTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) return new Date();
      
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      // Create the date object (months are 0-indexed in JavaScript)
      const dateObj = new Date(year, month - 1, day, hours, minutes, 0);
      
      console.log(`Creating pickup date: ${dateObj.toString()}`);
      return dateObj;
    } catch (e) {
      console.error('Error creating date object:', e);
      return new Date();
    }
  };
  
  // Even simpler time adjustment approach using direct time management
  const adjustTime = (minutes) => {
    // Store current time values for reference
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    console.log(`Starting with time: ${pickupTime || 'none set'}`);
    
    // We'll maintain an internal 24-hour representation of the time
    // If no time is set yet, start with current time rounded to 15 minutes
    let timeHours, timeMinutes;
    
    // Try to parse current pickup time if it exists
    if (pickupTime) {
      // Handle different format possibilities (regular expression to extract parts)
      const timeMatch = pickupTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const period = timeMatch[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        timeHours = hour;
        timeMinutes = minute;
        console.log(`Successfully parsed time: ${hour}:${minute} (${period})`);
      } else {
        // If unable to parse, start with current time
        console.log(`Unable to parse time string: "${pickupTime}"`);
        timeHours = currentHour;
        timeMinutes = Math.round(currentMinute / 15) * 15;
      }
    } else {
      // No time set, use current time rounded to nearest 15 minutes
      timeHours = currentHour;
      timeMinutes = Math.round(currentMinute / 15) * 15;
    }
    
    // Apply the adjustment
    timeMinutes += minutes;
    
    // Handle minute overflow/underflow
    while (timeMinutes >= 60) {
      timeMinutes -= 60;
      timeHours += 1;
    }
    
    while (timeMinutes < 0) {
      timeMinutes += 60;
      timeHours -= 1;
    }
    
    // Handle hour overflow/underflow (24-hour clock)
    timeHours = (timeHours + 24) % 24;
    
    // Convert back to 12-hour format for display
    let displayHour = timeHours % 12;
    if (displayHour === 0) displayHour = 12;
    const period = timeHours >= 12 ? 'PM' : 'AM';
    
    // Format minutes with leading zero if needed
    const displayMinutes = timeMinutes.toString().padStart(2, '0');
    
    // Create the formatted time string
    const newTime = `${displayHour}:${displayMinutes} ${period}`;
    
    console.log(`Adjusted time: ${newTime}`);
    setPickupTime(newTime);
  };
  
  // Initialize date and time from context if available, or use current date+time if not
  useEffect(() => {
    // Always use current date, ignore any stale data that might be in context
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() is 0-indexed
    const day = now.getDate();
    const year = now.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    
    console.log('Setting date to today:', todayFormatted);
    setPickupDate(todayFormatted);
    
    if (bookingData.pickupDateTime) {
      const date = new Date(bookingData.pickupDateTime);
      setPickupTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } else {
      // Calculate time (current + 15min)
      const { formattedTime } = getFormattedDateAndTime();
      setPickupTime(formattedTime);
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
              <View style={styles.timeControlContainer}>
                <TouchableOpacity 
                  style={styles.timeControlButton}
                  onPress={() => adjustTime(-15)}
                >
                  <Ionicons name="remove" size={20} color="#4a80f5" />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.timeInput}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                  placeholder="HH:MM AM/PM"
                  keyboardType="default"
                />
                
                <TouchableOpacity 
                  style={styles.timeControlButton}
                  onPress={() => adjustTime(15)}
                >
                  <Ionicons name="add" size={20} color="#4a80f5" />
                </TouchableOpacity>
              </View>
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
              // Create properly formatted pickup date/time object
              const pickupDateTimeObj = createPickupDateTimeObject();
              
              console.log('Saving pickup date:', pickupDateTimeObj.toISOString());
              console.log('From date:', pickupDate, 'and time:', pickupTime);
              
              // Save form data to the context before navigating
              updateBookingData({
                cargoDescription,
                pickupAddress,
                destinationAddress,
                pickupDateTime: pickupDateTimeObj,
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
  timeControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4a80f5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    fontSize: 16,
    height: 50,
    flex: 1,
    textAlign: 'center',
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