import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ChoiceScreen() {
  const { user, isLoading } = useAuth();
  
  // Make sure the user is authenticated to access this screen
  useEffect(() => {
    console.log('Choice screen - Auth state:', { user: !!user, isLoading });
    if (!isLoading && !user) {
      // User is not authenticated, redirect to onboarding
      console.log('Redirecting to onboarding from choice screen');
      router.replace('/onboarding');
    }
  }, [user, isLoading]);
  
  // Handle button presses with logging for debugging
  const handleNeedTruck = () => {
    console.log('I need a truck button pressed');
    router.push('/choice1/screen1');
  };
  
  const handleOwnTruck = () => {
    console.log('I own a truck button pressed');
    router.push('/owner-onboarding');
  };

  // If still loading or not authenticated, show nothing
  if (isLoading || !user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How will you use HaulBuddy?</Text>
      
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleNeedTruck}
      >
        <Text style={styles.choiceButtonText}>I need a truck</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleOwnTruck}
      >
        <Text style={styles.choiceButtonText}>I own a truck</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#0096FF',
    textAlign: 'center',
  },
  choiceButton: {
    width: '80%',
    backgroundColor: '#E6F7FF',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});