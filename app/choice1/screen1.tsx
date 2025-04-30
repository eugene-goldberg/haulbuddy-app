import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function Choice1Screen1() {
  const [cargoDescription, setCargoDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [needsAssistance, setNeedsAssistance] = useState<boolean | null>(null);
  
  // Combined date and time for submission
  const pickupDateTime = pickupDate && pickupTime ? `${pickupDate} ${pickupTime}` : '';

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
          
          <Text style={styles.formLabel}>Will you require assistance with loading / unloading?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setNeedsAssistance(true)}
            >
              <View style={[
                styles.radioCircle, 
                needsAssistance === true && styles.radioCircleSelected
              ]}>
                {needsAssistance === true && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setNeedsAssistance(false)}
            >
              <View style={[
                styles.radioCircle, 
                needsAssistance === false && styles.radioCircleSelected
              ]}>
                {needsAssistance === false && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/choice1/screen2')}
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
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: '#4a80f5',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4a80f5',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
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