import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function TruckOwnerOnboarding1() {
  const handleContinue = () => {
    router.push('/owner-onboarding/vehicle-info');
  };

  const handleBack = () => {
    router.push('/choice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Become a HaulBuddy Partner</Text>
          <Text style={styles.subtitle}>
            Share your truck and earn money on your own schedule
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <FontAwesome5 name="truck" size={80} color="#4a80f5" />
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Why Partner With Us?</Text>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="cash-outline" size={24} color="white" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Earn Extra Income</Text>
              <Text style={styles.benefitDescription}>
                Make money from your truck when you're not using it
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="calendar-outline" size={24} color="white" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Flexible Schedule</Text>
              <Text style={styles.benefitDescription}>
                You decide when and where to accept haul requests
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="shield-checkmark-outline" size={24} color="white" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Insurance Coverage</Text>
              <Text style={styles.benefitDescription}>
                We provide coverage during all official HaulBuddy trips
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="people-outline" size={24} color="white" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Local Connections</Text>
              <Text style={styles.benefitDescription}>
                Help neighbors in your community while growing your network
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <Text style={styles.requirementsText}>
            • Valid driver's license
          </Text>
          <Text style={styles.requirementsText}>
            • Vehicle registration
          </Text>
          <Text style={styles.requirementsText}>
            • Proof of insurance
          </Text>
          <Text style={styles.requirementsText}>
            • Be at least 21 years old
          </Text>
          <Text style={styles.requirementsText}>
            • Pass a background check
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Back</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e6efff',
    alignSelf: 'center',
    marginBottom: 30,
  },
  benefitsContainer: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a80f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  requirementsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementsText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    paddingLeft: 10,
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