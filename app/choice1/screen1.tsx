import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { useBooking } from '../../contexts/BookingContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  
  // Native datetime picker states - using natural initialization
  const [nativeDatetime, setNativeDatetime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Format the native picker's date for display
  const formattedNativeDate = nativeDatetime.toLocaleDateString('en-US');
  const formattedNativeTime = nativeDatetime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Native date/time picker handlers with text input syncing
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Only hide on Android
    
    if (selectedDate) {
      // Preserve the current time
      const currentTime = nativeDatetime;
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      
      // Update the native picker state
      setNativeDatetime(selectedDate);
      console.log('Native date selected:', selectedDate.toISOString());
      
      // SYNC: Also update the text input for date
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      setPickupDate(formattedDate);
      console.log('Synced text date to:', formattedDate);
    }
  };
  
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios'); // Only hide on Android
    
    if (selectedTime) {
      // Preserve the current date
      const currentDate = nativeDatetime;
      selectedTime.setFullYear(currentDate.getFullYear());
      selectedTime.setMonth(currentDate.getMonth());
      selectedTime.setDate(currentDate.getDate());
      
      // Update the native picker state
      setNativeDatetime(selectedTime);
      console.log('Native time selected:', selectedTime.toISOString());
      
      // SYNC: Also update the text input for time
      const formattedTime = selectedTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      setPickupTime(formattedTime);
      console.log('Synced text time to:', formattedTime);
    }
  };
  
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
  
  // Time adjustment approach using direct time management with sync to native picker
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
    
    // SYNC: Also update the native datetime picker
    const newNativeDateTime = new Date(nativeDatetime);
    newNativeDateTime.setHours(timeHours);
    newNativeDateTime.setMinutes(timeMinutes);
    setNativeDatetime(newNativeDateTime);
    console.log('Synced native datetime picker to:', newNativeDateTime.toISOString());
  };
  
  // Initialize from context only if there's existing data
  useEffect(() => {
    // If we have existing booking data, use it
    if (bookingData.pickupDateTime) {
      // Set the native picker to the existing value
      const existingDateTime = new Date(bookingData.pickupDateTime);
      setNativeDatetime(existingDateTime);
      
      // Also set the text inputs for consistency
      const month = existingDateTime.getMonth() + 1;
      const day = existingDateTime.getDate();
      const year = existingDateTime.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      
      const formattedTime = existingDateTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      console.log('Using existing booking date/time:', formattedDate, formattedTime);
      setPickupDate(formattedDate);
      setPickupTime(formattedTime);
    } else {
      // For new bookings, use the native picker's natural date/time
      // and sync it to text inputs
      const current = new Date();
      
      const month = current.getMonth() + 1;
      const day = current.getDate();
      const year = current.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      
      const formattedTime = current.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      console.log('Setting new booking with current date/time:', formattedDate, formattedTime);
      setPickupDate(formattedDate);
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
          
          {/* Original Date and Time inputs - commented out in favor of native controls
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
          
          <Text style={styles.helperText}>
            Please enter date as MM/DD/YYYY and time as HH:MM AM/PM
          </Text>
          */}
          
          {/* Native DateTime Picker Section */}
          <View style={styles.nativeDateTimeSection}>
            <Text style={styles.sectionTitle}>Date and Time Selection</Text>
            
            <View style={styles.nativeDateTimeRow}>
              <View style={styles.nativeDateTimeDisplay}>
                <Text style={styles.dateTimeLabel}>Selected Date:</Text>
                <Text style={styles.dateTimeValue}>{formattedNativeDate}</Text>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateTimeButtonText}>Change Date</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.nativeDateTimeDisplay}>
                <Text style={styles.dateTimeLabel}>Selected Time:</Text>
                <Text style={styles.dateTimeValue}>{formattedNativeTime}</Text>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateTimeButtonText}>Change Time</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Native pickers (shown conditionally) */}
            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={nativeDatetime}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={nativeDatetime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
                minuteInterval={15}
              />
            )}
            
            <Text style={styles.helperText}>
              Select your pickup date and time using the controls above
            </Text>
          </View>
          
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
              // Use the native datetime picker value
              const pickupDateTimeObj = nativeDatetime;
              
              console.log('Using native picker datetime:', pickupDateTimeObj.toISOString());
              
              // Also update the text inputs for consistency (optional)
              setPickupDate(formattedNativeDate);
              setPickupTime(formattedNativeTime);
              
              // Save form data to the context before navigating
              updateBookingData({
                cargoDescription,
                pickupAddress,
                destinationAddress,
                pickupDateTime: pickupDateTimeObj, // using native picker value
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
  // Native date time picker styles
  nativeDateTimeSection: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f5f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  nativeDateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nativeDateTimeDisplay: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  dateTimeValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  dateTimeButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  dateTimeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});