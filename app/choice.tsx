import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ChoiceScreen() {
  const { user, isLoading } = useAuth();
  
  // Make sure the user is authenticated to access this screen
  useEffect(() => {
    console.log('Choice screen - Auth state:', { 
      isAuthenticated: !!user, 
      isLoading, 
      userEmail: user?.email 
    });
    
    if (!isLoading && !user) {
      // User is not authenticated, redirect to onboarding
      console.log('Redirecting to onboarding from choice screen - NO AUTH');
      router.replace('/onboarding');
    }
  }, [user, isLoading]);
  
  // Run this effect only once when the component mounts
  useEffect(() => {
    // Double check auth state on initial render
    if (!user) {
      console.log('Choice screen - Initial check: Not authenticated');
      router.replace('/onboarding');
    } else {
      console.log('Choice screen - Initial check: User authenticated:', user.email);
    }
  }, []);
  
  // Handle button presses with logging for debugging
  const handleNeedTruck = () => {
    console.log('I need a truck button pressed');
    router.push('/choice1/screen1');
  };
  
  const handleOwnTruck = () => {
    console.log('I own a truck button pressed');
    router.push('/owner-onboarding');
  };

  // If not authenticated, redirect to onboarding
  if (!isLoading && !user) {
    console.log('Choice screen - Not authenticated, redirecting to onboarding');
    router.replace('/onboarding');
    return null;
  }

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