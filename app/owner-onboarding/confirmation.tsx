import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { completeOwnerOnboarding } from '../../services/owner-onboarding-service';

export default function ConfirmationScreen() {
  const { user, refreshUserRole } = useAuth();
  const { vehicleInfo, vehiclePhotos, vehiclePricing, resetOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOnboarding = async () => {
    if (!user || !vehicleInfo || !vehiclePricing || vehiclePhotos.length < 3) {
      Alert.alert(
        "Missing Information",
        "Please complete all previous steps before submitting."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit onboarding data to Firestore
      await completeOwnerOnboarding(user.uid, {
        vehicleInfo,
        photos: vehiclePhotos,
        pricing: vehiclePricing
      });

      // Refresh the user role to reflect the completed onboarding
      await refreshUserRole();

      // Reset the onboarding context
      resetOnboarding();

      // Show success message
      Alert.alert(
        "Onboarding Complete",
        "Your truck has been registered successfully. You'll be notified when your account is approved.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to the dashboard
              router.push('/owner-dashboard');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        `Failed to complete onboarding: ${error.message || 'Unknown error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToProfile = () => {
    // Navigate to the profile or main tabs
    router.push('/(tabs)');
  };

  const handleGoToDashboard = () => {
    // Navigate to the owner dashboard
    router.push('/owner-dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={80} color="white" />
          </View>
          
          <Text style={styles.title}>Ready to Submit!</Text>
          <Text style={styles.subtitle}>
            Your truck information is ready to be registered with HaulBuddy
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="verified" size={24} color="#4CAF50" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Verification Process</Text>
              <Text style={styles.infoDescription}>
                After submission, our team will review your information within 1-2 business days.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="notifications-active" size={24} color="#4a80f5" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>You'll Be Notified</Text>
              <Text style={styles.infoDescription}>
                We'll send you a notification when your account is approved and you can start receiving haul requests.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="edit" size={24} color="#FF9800" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Update Anytime</Text>
              <Text style={styles.infoDescription}>
                You can update your vehicle details, photos, pricing, and availability at any time from your profile.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>
              We'll verify your account information and vehicle details
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Once approved, you'll start receiving haul requests that match your availability
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Accept requests, provide great service, and earn money!
            </Text>
          </View>
        </View>

        <View style={styles.supportContainer}>
          <View style={styles.supportHeader}>
            <MaterialIcons name="headset-mic" size={24} color="#4a80f5" />
            <Text style={styles.supportTitle}>Need Help?</Text>
          </View>
          <Text style={styles.supportText}>
            Our support team is available 7 days a week to answer any questions you might have about being a HaulBuddy partner.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleSubmitOnboarding}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Submit Registration</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleGoToProfile}
            disabled={isSubmitting}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoContainer: {
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
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nextStepsContainer: {
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
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a80f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  supportContainer: {
    backgroundColor: '#e6f2ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  supportText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a80f5',
  },
  supportButtonText: {
    color: '#4a80f5',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: '600',
  },
});