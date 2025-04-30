import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getOwnerVehicles, getUserProfile } from '../firebase/firestore-service';
import { hasCompletedCustomerOnboarding } from '../services/customer-onboarding-service';

export default function ChoiceScreen() {
  const { user, isLoading, userRole } = useAuth();
  const [checkingVehicles, setCheckingVehicles] = useState(false);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  
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
  const handleNeedTruck = async () => {
    console.log('I need a truck button pressed');
    
    if (!user) return;
    
    try {
      setCheckingCustomer(true);
      
      // Check if the user is already a customer with completed onboarding
      const userProfile = await getUserProfile(user.uid);
      const hasCompletedOnboarding = await hasCompletedCustomerOnboarding(userProfile);
      
      if (hasCompletedOnboarding) {
        // User has already completed customer onboarding
        console.log('User has already completed customer onboarding, skipping to customer dashboard');
        // Go directly to the customer dashboard
        router.push('/choice1/customer-dashboard');
      } else {
        // User needs to complete onboarding
        console.log('User needs to complete customer onboarding');
        router.push('/choice1/screen1');
      }
    } catch (error) {
      console.error('Error checking customer status:', error);
      // On error, default to onboarding flow
      router.push('/choice1/screen1');
    } finally {
      setCheckingCustomer(false);
    }
  };
  
  // Check if the user is already an owner with vehicles
  const handleOwnTruck = async () => {
    console.log('I own a truck button pressed');
    
    if (!user) return;
    
    try {
      setCheckingVehicles(true);
      
      // If the user already has the owner role, they've already been through onboarding
      if (userRole === 'owner') {
        console.log('User is already an owner, redirecting to dashboard');
        router.push('/owner-dashboard');
        return;
      }
      
      // Check if the user has any vehicles
      const vehicles = await getOwnerVehicles(user.uid);
      
      if (vehicles && vehicles.length > 0) {
        // User has vehicles, send them to the dashboard
        console.log('User has vehicles, redirecting to dashboard');
        router.push('/owner-dashboard');
      } else {
        // User has no vehicles, send them to onboarding
        console.log('User has no vehicles, redirecting to onboarding');
        router.push('/owner-onboarding');
      }
    } catch (error) {
      console.error('Error checking owner status:', error);
      // On error, default to onboarding
      router.push('/owner-onboarding');
    } finally {
      setCheckingVehicles(false);
    }
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
        style={[styles.choiceButton, checkingCustomer && styles.disabledButton]}
        onPress={handleNeedTruck}
        disabled={checkingCustomer || checkingVehicles}
      >
        {checkingCustomer ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4a80f5" />
            <Text style={styles.loadingText}>Checking...</Text>
          </View>
        ) : (
          <Text style={styles.choiceButtonText}>I need a truck</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.choiceButton, checkingVehicles && styles.disabledButton]}
        onPress={handleOwnTruck}
        disabled={checkingVehicles || checkingCustomer}
      >
        {checkingVehicles ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4a80f5" />
            <Text style={styles.loadingText}>Checking...</Text>
          </View>
        ) : (
          <Text style={styles.choiceButtonText}>I own a truck</Text>
        )}
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
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 10,
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});