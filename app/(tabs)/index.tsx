// app/(tabs)/index.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function WelcomeScreen() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await logout();
      console.log('Logged out successfully');
      
      // Stay on the Welcome screen after logout instead of going to onboarding
      console.log('Staying on Welcome screen after logout');
      // No navigation needed - we'll stay on the current screen
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Pickup Truck Sharing Made Easy</Text>
        
        {/* Truck Icon/Image */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name="truck" size={80} color="#e74c3c" />
        </View>
        
        {/* Description */}
        <Text style={styles.description}>
          Connect with truck owners in your area for moving, hauling, and delivery needs.
        </Text>
        
        {/* How It Works Section */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepIconContainer}>
            <Ionicons name="phone-portrait" size={50} color="#333" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Book a Truck</Text>
            <Text style={styles.stepDescription}>
              Find available trucks in your area and book with just a few taps
            </Text>
          </View>
        </View>
        
        {/* Step 2 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepIconContainer}>
            <FontAwesome5 name="truck" size={40} color="#e74c3c" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Meet Your Driver</Text>
            <Text style={styles.stepDescription}>
              Connect with verified truck owners for your moving needs
            </Text>
          </View>
        </View>
        
        {/* Step 3 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepIconContainer}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Complete Your Move</Text>
            <Text style={styles.stepDescription}>
              Get your items moved safely and affordably
            </Text>
          </View>
        </View>
        
        {/* Continue Button - Checks auth before navigating */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            console.log('Continue button pressed');
            if (user) {
              // User is logged in, go to choice screen
              console.log('User is authenticated, navigating to choice screen');
              router.push('/choice');
            } else {
              // User is not logged in, go to onboarding
              console.log('User is not authenticated, navigating to onboarding');
              router.push('/onboarding/login');
            }
          }}
        >
          <Text style={styles.loginButtonText}>Continue</Text>
        </TouchableOpacity>
        
        {/* Logout Button - Only show when user is logged in */}
        {user && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
        
        {/* Spacer at bottom for scrolling */}
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(140, 210, 245, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});