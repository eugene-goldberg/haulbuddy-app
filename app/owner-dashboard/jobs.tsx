import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  FlatList,
  TextInput
} from 'react-native';
import { router } from 'expo-router';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  FontAwesome5 
} from '@expo/vector-icons';

// Mock data for jobs
const mockJobs = {
  activeJobs: [
    {
      id: '1',
      customer: 'Michael Brown',
      pickup: '123 Pine St, Chicago',
      destination: '456 Oak Dr, Chicago',
      time: '2:30 PM Today',
      price: 85,
      status: 'active',
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
      status: 'upcoming',
    },
    {
      id: '3',
      customer: 'Robert Martinez',
      pickup: '555 Elm St, Chicago',
      destination: '777 Birch Rd, Chicago',
      time: 'May 2, 9:00 AM',
      price: 120,
      status: 'upcoming',
    },
    {
      id: '4',
      customer: 'Emma Thompson',
      pickup: '222 Spruce Way, Chicago',
      destination: '333 Hickory Blvd, Chicago',
      time: 'May 4, 2:00 PM',
      price: 95,
      status: 'upcoming',
    }
  ],
  pastJobs: [
    {
      id: '5',
      customer: 'David Wilson',
      pickup: '888 Pine Ave, Chicago',
      destination: '999 Maple St, Chicago',
      time: 'April 22, 2025',
      price: 75,
      status: 'completed',
      rating: 5,
    },
    {
      id: '6',
      customer: 'Sophia Anderson',
      pickup: '444 Oak Ln, Chicago',
      destination: '555 Cedar Ave, Chicago',
      time: 'April 20, 2025',
      price: 110,
      status: 'completed',
      rating: 4,
    },
    {
      id: '7',
      customer: 'Liam Garcia',
      pickup: '777 Elm Blvd, Chicago',
      destination: '888 Birch Dr, Chicago',
      time: 'April 18, 2025',
      price: 90,
      status: 'completed',
      rating: 5,
    },
    {
      id: '8',
      customer: 'Olivia Martinez',
      pickup: '123 Spruce St, Chicago',
      destination: '456 Hickory Ave, Chicago',
      time: 'April 15, 2025',
      price: 80,
      status: 'completed',
      rating: 4,
    }
  ],
  cancelledJobs: [
    {
      id: '9',
      customer: 'Noah Taylor',
      pickup: '777 Willow St, Chicago',
      destination: '888 Aspen Ave, Chicago',
      time: 'April 10, 2025',
      price: 70,
      status: 'cancelled',
      reason: 'Customer cancelled',
    }
  ]
};

// Combine all jobs and sort by date (most recent first)
// For a real app, we'd use actual Date objects and proper sorting
const allJobs = [
  ...mockJobs.activeJobs, 
  ...mockJobs.upcomingJobs, 
  ...mockJobs.pastJobs, 
  ...mockJobs.cancelledJobs
];

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigateToDashboard = () => {
    router.push('/owner-dashboard');
  };
  
  const navigateToEarnings = () => {
    // Navigate to earnings screen
    console.log('Navigate to earnings');
  };
  
  const navigateToProfile = () => {
    // Navigate to profile screen
    console.log('Navigate to profile');
  };
  
  const navigateToJobDetail = (jobId: string) => {
    // Navigate to job detail screen
    console.log('Navigate to job detail', jobId);
  };
  
  const contactCustomer = (jobId: string) => {
    // Contact customer
    console.log('Contact customer for job', jobId);
  };
  
  const startNavigation = (jobId: string) => {
    // Start navigation
    console.log('Start navigation for job', jobId);
  };
  
  const getFilteredJobs = () => {
    let filteredJobs = allJobs;
    
    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        filteredJobs = mockJobs.activeJobs;
      } else if (activeTab === 'upcoming') {
        filteredJobs = mockJobs.upcomingJobs;
      } else if (activeTab === 'completed') {
        filteredJobs = mockJobs.pastJobs;
      } else if (activeTab === 'cancelled') {
        filteredJobs = mockJobs.cancelledJobs;
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.customer.toLowerCase().includes(query) ||
        job.pickup.toLowerCase().includes(query) ||
        job.destination.toLowerCase().includes(query)
      );
    }
    
    return filteredJobs;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#4a80f5';
      case 'completed': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#4a80f5';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'In Progress';
      case 'upcoming': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };
  
  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.jobItem} 
      onPress={() => navigateToJobDetail(item.id)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobCustomer}>
          <MaterialIcons name="person" size={18} color="#4a80f5" />
          <Text style={styles.jobCustomerName}>{item.customer}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.jobLocations}>
        <View style={styles.jobLocation}>
          <MaterialIcons name="trip-origin" size={16} color="#4CAF50" />
          <Text style={styles.jobLocationText}>{item.pickup}</Text>
        </View>
        
        <View style={styles.locationConnector}>
          <View style={styles.connectorLine} />
        </View>
        
        <View style={styles.jobLocation}>
          <MaterialIcons name="place" size={16} color="#F44336" />
          <Text style={styles.jobLocationText}>{item.destination}</Text>
        </View>
      </View>
      
      <View style={styles.jobFooter}>
        <View style={styles.jobDetail}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.jobDetailText}>{item.time}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Text style={styles.jobDetailText}>${item.price}</Text>
        </View>
        
        {item.rating && (
          <View style={styles.jobDetail}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.jobDetailText}>{item.rating}</Text>
          </View>
        )}
      </View>
      
      {(item.status === 'active' || item.status === 'upcoming') && (
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.contactButton]}
            onPress={() => contactCustomer(item.id)}
          >
            <MaterialIcons name="call" size={14} color="#4a80f5" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          
          {item.status === 'active' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.navigationButton]}
              onPress={() => startNavigation(item.id)}
            >
              <MaterialIcons name="directions" size={14} color="white" />
              <Text style={styles.navigationButtonText}>Navigate</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#4a80f5" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabs}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.activeTab]} 
            onPress={() => setActiveTab('active')}
          >
            <View style={styles.tabWithBadge}>
              <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
              {mockJobs.activeJobs.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{mockJobs.activeJobs.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} 
            onPress={() => setActiveTab('upcoming')}
          >
            <View style={styles.tabWithBadge}>
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
              {mockJobs.upcomingJobs.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{mockJobs.upcomingJobs.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]} 
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]} 
            onPress={() => setActiveTab('cancelled')}
          >
            <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        style={styles.jobsList}
        contentContainerStyle={styles.jobsListContent}
        data={getFilteredJobs()}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No jobs found</Text>
            <Text style={styles.emptyStateSubText}>
              {searchQuery ? 'Try a different search' : 'Jobs will appear here'}
            </Text>
          </View>
        }
      />
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToDashboard}>
          <MaterialIcons name="dashboard" size={24} color="#888" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="assignment" size={24} color="#4a80f5" />
          <Text style={[styles.navText, styles.activeNavText]}>Jobs</Text>
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
  filterButton: {
    padding: 5,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabs: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#e6f0ff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4a80f5',
    fontWeight: '600',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  jobsList: {
    flex: 1,
  },
  jobsListContent: {
    padding: 12,
    paddingBottom: 80, // For bottom nav
  },
  jobItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobCustomerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobLocations: {
    marginBottom: 12,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobLocationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  locationConnector: {
    paddingLeft: 8,
    marginBottom: 6,
  },
  connectorLine: {
    width: 1,
    height: 14,
    backgroundColor: '#ccc',
    marginLeft: 7,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  contactButton: {
    backgroundColor: '#f0f5ff',
  },
  contactButtonText: {
    color: '#4a80f5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  navigationButton: {
    backgroundColor: '#4a80f5',
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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