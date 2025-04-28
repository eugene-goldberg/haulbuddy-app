import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  Switch,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  FontAwesome5 
} from '@expo/vector-icons';

// Mock data for the dashboard
const mockData = {
  currentWeekEarnings: 450,
  previousWeekEarnings: 375,
  monthlyEarnings: 1750,
  rating: 4.8,
  completionRate: 98,
  onTimeRate: 95,
  activeJobs: [
    {
      id: '1',
      customer: 'Michael Brown',
      pickup: '123 Pine St, Chicago',
      destination: '456 Oak Dr, Chicago',
      time: '2:30 PM Today',
      price: 85,
    }
  ],
  upcomingJobs: [
    {
      id: '2',
      customer: 'Sarah Johnson',
      pickup: '789 Maple Ave, Chicago',
      destination: '321 Cedar Ln, Chicago',
      time: 'Tomorrow, 10:00 AM',
      price: 65,
    },
    {
      id: '3',
      customer: 'Robert Martinez',
      pickup: '555 Elm St, Chicago',
      destination: '777 Birch Rd, Chicago',
      time: 'May 2, 9:00 AM',
      price: 120,
    }
  ],
  jobRequests: [
    {
      id: '4',
      customer: 'Jennifer Williams',
      pickup: '888 Spruce Ct, Chicago',
      destination: '999 Willow Way, Chicago',
      time: 'May 3, 1:00 PM',
      price: 95,
      expiry: '12 hours',
    }
  ]
};

export default function OwnerDashboardScreen() {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  const navigateToJobs = () => {
    // Navigate to jobs management screen
    router.push('/owner-dashboard/jobs');
  };

  const navigateToEarnings = () => {
    // Navigate to earnings screen
    router.push('/owner-dashboard/earnings');
  };

  const navigateToRequests = () => {
    // Navigate to job requests screen
    console.log('Navigate to requests');
  };

  const navigateToProfile = () => {
    // Navigate to truck profile screen
    router.push('/owner-dashboard/profile');
  };

  const acceptJobRequest = (jobId: string) => {
    // Handle job acceptance
    console.log('Accept job', jobId);
  };

  const declineJobRequest = (jobId: string) => {
    // Handle job decline
    console.log('Decline job', jobId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.hello}>Hello, John</Text>
          <Text style={styles.date}>Monday, April 28, 2025</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.availabilityToggle}>
        <Text style={styles.availabilityText}>
          {isAvailable ? 'You are online' : 'You are offline'}
        </Text>
        <Switch
          value={isAvailable}
          onValueChange={toggleAvailability}
          trackColor={{ false: '#d1d1d6', true: '#a4c2f5' }}
          thumbColor={isAvailable ? '#4a80f5' : '#f4f3f4'}
          ios_backgroundColor="#d1d1d6"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.sectionTitle}>Earnings</Text>
            <TouchableOpacity onPress={navigateToEarnings}>
              <Text style={styles.viewAllLink}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.earningsGrid}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>This Week</Text>
              <Text style={styles.earningsAmount}>${mockData.currentWeekEarnings}</Text>
            </View>
            
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>Last Week</Text>
              <Text style={styles.earningsAmount}>${mockData.previousWeekEarnings}</Text>
            </View>
            
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>This Month</Text>
              <Text style={styles.earningsAmount}>${mockData.monthlyEarnings}</Text>
            </View>
          </View>
        </View>

        {/* Performance Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="star-rate" size={20} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>{mockData.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{mockData.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="timelapse" size={20} color="#4a80f5" />
              </View>
              <Text style={styles.statValue}>{mockData.onTimeRate}%</Text>
              <Text style={styles.statLabel}>On Time</Text>
            </View>
          </View>
        </View>

        {/* Active Jobs Card */}
        {mockData.activeJobs.length > 0 && (
          <View style={styles.jobsCard}>
            <View style={styles.jobsHeader}>
              <Text style={styles.sectionTitle}>Active Job</Text>
              <TouchableOpacity style={styles.startNavButton}>
                <MaterialIcons name="directions" size={14} color="white" />
                <Text style={styles.startNavButtonText}>Start Navigation</Text>
              </TouchableOpacity>
            </View>
            
            {mockData.activeJobs.map(job => (
              <View key={job.id} style={styles.jobItem}>
                <View style={styles.jobCustomer}>
                  <MaterialIcons name="person" size={20} color="#4a80f5" />
                  <Text style={styles.jobCustomerName}>{job.customer}</Text>
                </View>
                
                <View style={styles.jobLocations}>
                  <View style={styles.jobLocation}>
                    <MaterialIcons name="trip-origin" size={20} color="#4CAF50" />
                    <Text style={styles.jobLocationText}>{job.pickup}</Text>
                  </View>
                  
                  <View style={styles.locationConnector}>
                    <View style={styles.connectorLine} />
                  </View>
                  
                  <View style={styles.jobLocation}>
                    <MaterialIcons name="place" size={20} color="#F44336" />
                    <Text style={styles.jobLocationText}>{job.destination}</Text>
                  </View>
                </View>
                
                <View style={styles.jobFooter}>
                  <View style={styles.jobTime}>
                    <MaterialIcons name="schedule" size={16} color="#666" />
                    <Text style={styles.jobTimeText}>{job.time}</Text>
                  </View>
                  
                  <View style={styles.jobPrice}>
                    <MaterialIcons name="attach-money" size={16} color="#666" />
                    <Text style={styles.jobPriceText}>${job.price}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.contactButton}>
                    <MaterialIcons name="call" size={16} color="#4a80f5" />
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Upcoming Jobs Card */}
        <View style={styles.jobsCard}>
          <View style={styles.jobsHeader}>
            <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
            <TouchableOpacity onPress={navigateToJobs}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {mockData.upcomingJobs.length > 0 ? (
            mockData.upcomingJobs.slice(0, 2).map(job => (
              <View key={job.id} style={styles.upcomingJobItem}>
                <View style={styles.upcomingJobTop}>
                  <View style={styles.jobCustomer}>
                    <MaterialIcons name="person" size={16} color="#4a80f5" />
                    <Text style={styles.jobCustomerName}>{job.customer}</Text>
                  </View>
                  
                  <View style={styles.jobTime}>
                    <MaterialIcons name="schedule" size={16} color="#666" />
                    <Text style={styles.jobTimeText}>{job.time}</Text>
                  </View>
                </View>
                
                <View style={styles.jobLocations}>
                  <View style={styles.jobLocation}>
                    <MaterialIcons name="trip-origin" size={16} color="#4CAF50" />
                    <Text style={[styles.jobLocationText, styles.jobLocationTextSmall]}>{job.pickup}</Text>
                  </View>
                  
                  <View style={styles.jobLocation}>
                    <MaterialIcons name="place" size={16} color="#F44336" />
                    <Text style={[styles.jobLocationText, styles.jobLocationTextSmall]}>{job.destination}</Text>
                  </View>
                </View>
                
                <Text style={styles.jobPriceText}>Estimated earnings: ${job.price}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="calendar-check" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No upcoming jobs scheduled</Text>
            </View>
          )}
        </View>

        {/* Job Requests Card */}
        <View style={styles.jobsCard}>
          <View style={styles.jobsHeader}>
            <Text style={styles.sectionTitle}>Job Requests</Text>
            <TouchableOpacity onPress={navigateToRequests}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {mockData.jobRequests.length > 0 ? (
            mockData.jobRequests.map(job => (
              <View key={job.id} style={styles.requestItem}>
                <View style={styles.requestContent}>
                  <View style={styles.requestCustomer}>
                    <MaterialIcons name="person" size={16} color="#4a80f5" />
                    <Text style={styles.jobCustomerName}>{job.customer}</Text>
                  </View>
                  
                  <View style={styles.jobLocations}>
                    <View style={styles.jobLocation}>
                      <MaterialIcons name="trip-origin" size={16} color="#4CAF50" />
                      <Text style={[styles.jobLocationText, styles.jobLocationTextSmall]}>{job.pickup}</Text>
                    </View>
                    
                    <View style={styles.jobLocation}>
                      <MaterialIcons name="place" size={16} color="#F44336" />
                      <Text style={[styles.jobLocationText, styles.jobLocationTextSmall]}>{job.destination}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.requestDetailsRow}>
                    <View style={styles.requestDetail}>
                      <MaterialIcons name="schedule" size={14} color="#666" />
                      <Text style={styles.requestDetailText}>{job.time}</Text>
                    </View>
                    
                    <View style={styles.requestDetail}>
                      <MaterialIcons name="attach-money" size={14} color="#666" />
                      <Text style={styles.requestDetailText}>${job.price}</Text>
                    </View>
                    
                    <View style={styles.requestDetail}>
                      <MaterialIcons name="timer" size={14} color="#FF9800" />
                      <Text style={styles.requestDetailText}>Expires in {job.expiry}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.requestActions}>
                  <TouchableOpacity 
                    style={[styles.requestButton, styles.acceptButton]}
                    onPress={() => acceptJobRequest(job.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.requestButton, styles.declineButton]}
                    onPress={() => declineJobRequest(job.id)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="bell-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No pending job requests</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="dashboard" size={24} color="#4a80f5" />
          <Text style={[styles.navText, styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToJobs}>
          <MaterialIcons name="assignment" size={24} color="#888" />
          <Text style={styles.navText}>Jobs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToEarnings}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#888" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
          <MaterialIcons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Profile</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  greeting: {
    flex: 1,
  },
  hello: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    marginLeft: 15,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4a80f5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  availabilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Provide space for the bottom nav
  },
  earningsCard: {
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
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  jobsCard: {
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
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  startNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a80f5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  startNavButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  jobItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
  },
  jobCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobCustomerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  jobLocations: {
    marginBottom: 10,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationConnector: {
    paddingLeft: 10,
    marginBottom: 6,
  },
  connectorLine: {
    width: 1,
    height: 16,
    backgroundColor: '#ccc',
    marginLeft: 9, // Aligns with the center of the icon
  },
  jobLocationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  jobLocationTextSmall: {
    fontSize: 13,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobTimeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  jobPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobPriceText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f5ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  contactButtonText: {
    color: '#4a80f5',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  upcomingJobItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  upcomingJobTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  requestContent: {
    marginBottom: 10,
  },
  requestCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  requestDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  declineButton: {
    backgroundColor: '#f3f3f3',
  },
  declineButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
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