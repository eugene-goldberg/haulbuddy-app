import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons,
  FontAwesome5,
  Feather
} from '@expo/vector-icons';

// Mock data for profile
const mockData = {
  profile: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(312) 555-0123',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    memberSince: 'February 2025',
    completedJobs: 42,
  },
  vehicle: {
    make: 'Ford',
    model: 'F-150',
    year: '2022',
    licensePlate: 'IL-1234AB',
    color: 'Silver',
    capacity: '1500 lbs',
    dimensions: '6.5ft x 5.5ft x 4ft',
  },
  settings: {
    notifications: true,
    emailUpdates: true,
    autoAcceptJobs: false,
    darkMode: false,
    locationSharing: true,
  }
};

export default function ProfileScreen() {
  const [settings, setSettings] = useState(mockData.settings);
  
  const navigateToDashboard = () => {
    router.push('/owner-dashboard');
  };
  
  const navigateToJobs = () => {
    router.push('/owner-dashboard/jobs');
  };
  
  const navigateToEarnings = () => {
    router.push('/owner-dashboard/earnings');
  };
  
  const navigateToEditProfile = () => {
    // Navigate to edit profile
    console.log('Navigate to edit profile');
  };
  
  const navigateToVehicleInfo = () => {
    // Navigate to vehicle info
    console.log('Navigate to vehicle info');
  };
  
  const navigateToPaymentMethods = () => {
    // Navigate to payment methods
    console.log('Navigate to payment methods');
  };
  
  const navigateToSupport = () => {
    // Navigate to support
    console.log('Navigate to support');
  };
  
  const navigateToTerms = () => {
    // Navigate to terms and conditions
    console.log('Navigate to terms');
  };
  
  const navigateToPrivacy = () => {
    // Navigate to privacy policy
    console.log('Navigate to privacy');
  };
  
  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => console.log("Log out pressed"),
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{mockData.profile.name}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{mockData.profile.rating}</Text>
                <Text style={styles.memberSince}>• Member since {mockData.profile.memberSince}</Text>
              </View>
              <Text style={styles.completedJobs}>{mockData.profile.completedJobs} jobs completed</Text>
            </View>
            
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: mockData.profile.profileImage }} 
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editImageButton}>
                <MaterialIcons name="edit" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={navigateToEditProfile}
          >
            <MaterialIcons name="edit" size={16} color="#4a80f5" />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.contactDetails}>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={18} color="#666" />
              <Text style={styles.contactText}>{mockData.profile.email}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <MaterialIcons name="phone" size={18} color="#666" />
              <Text style={styles.contactText}>{mockData.profile.phone}</Text>
            </View>
          </View>
        </View>
        
        {/* Vehicle Information Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <TouchableOpacity onPress={navigateToVehicleInfo}>
              <Text style={styles.sectionLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.vehicleDetails}>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Make & Model</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.make} {mockData.vehicle.model}</Text>
              </View>
              
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Year</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.year}</Text>
              </View>
            </View>
            
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>License Plate</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.licensePlate}</Text>
              </View>
              
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Color</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.color}</Text>
              </View>
            </View>
            
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Capacity</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.capacity}</Text>
              </View>
              
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>Dimensions</Text>
                <Text style={styles.vehicleValue}>{mockData.vehicle.dimensions}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Account Settings Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem} onPress={navigateToEditProfile}>
              <View style={styles.settingStart}>
                <MaterialIcons name="person" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Personal Information</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={navigateToVehicleInfo}>
              <View style={styles.settingStart}>
                <MaterialIcons name="local-shipping" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Vehicle Information</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={navigateToPaymentMethods}>
              <View style={styles.settingStart}>
                <MaterialIcons name="credit-card" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Payment Methods</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Preferences Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingsGroup}>
            <View style={styles.switchItem}>
              <View style={styles.settingStart}>
                <MaterialIcons name="notifications" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
                trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                thumbColor={settings.notifications ? '#4a80f5' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d6"
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.settingStart}>
                <MaterialIcons name="email" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Email Updates</Text>
              </View>
              <Switch
                value={settings.emailUpdates}
                onValueChange={() => toggleSetting('emailUpdates')}
                trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                thumbColor={settings.emailUpdates ? '#4a80f5' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d6"
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.settingStart}>
                <MaterialIcons name="check-circle" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Auto-accept Jobs</Text>
              </View>
              <Switch
                value={settings.autoAcceptJobs}
                onValueChange={() => toggleSetting('autoAcceptJobs')}
                trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                thumbColor={settings.autoAcceptJobs ? '#4a80f5' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d6"
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.settingStart}>
                <MaterialIcons name="location-on" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Location Sharing</Text>
              </View>
              <Switch
                value={settings.locationSharing}
                onValueChange={() => toggleSetting('locationSharing')}
                trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                thumbColor={settings.locationSharing ? '#4a80f5' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d6"
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.settingStart}>
                <MaterialIcons name="nightlight-round" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => toggleSetting('darkMode')}
                trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
                thumbColor={settings.darkMode ? '#4a80f5' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d6"
              />
            </View>
          </View>
        </View>
        
        {/* Support Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem} onPress={navigateToSupport}>
              <View style={styles.settingStart}>
                <MaterialIcons name="help" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={navigateToTerms}>
              <View style={styles.settingStart}>
                <MaterialIcons name="description" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Terms & Conditions</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={navigateToPrivacy}>
              <View style={styles.settingStart}>
                <MaterialIcons name="security" size={22} color="#4a80f5" />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={18} color="#F44336" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToDashboard}>
          <MaterialIcons name="dashboard" size={24} color="#888" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToJobs}>
          <MaterialIcons name="assignment" size={24} color="#888" />
          <Text style={styles.navText}>Jobs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToEarnings}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#888" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#4a80f5" />
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#666',
  },
  completedJobs: {
    fontSize: 14,
    color: '#666',
  },
  profileImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#4a80f5',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a80f5',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f5ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  editProfileButtonText: {
    color: '#4a80f5',
    fontWeight: '600',
    marginLeft: 8,
  },
  contactDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionLink: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  vehicleDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vehicleItem: {
    flex: 1,
  },
  vehicleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  vehicleValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  settingsGroup: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeNavText: {
    color: '#4a80f5',
  },
});