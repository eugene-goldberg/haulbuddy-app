import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons,
  FontAwesome5 
} from '@expo/vector-icons';

// Mock data for earnings
const mockData = {
  currentWeekEarnings: 450,
  previousWeekEarnings: 375,
  weeklyChange: 20, // percentage
  monthlyEarnings: 1750,
  previousMonthEarnings: 1620,
  monthlyChange: 8, // percentage
  yearToDateEarnings: 6800,
  currentBalance: 730,
  pendingPayments: 450,
  weeklyBreakdown: [
    { day: 'Mon', amount: 85 },
    { day: 'Tue', amount: 110 },
    { day: 'Wed', amount: 65 },
    { day: 'Thu', amount: 95 },
    { day: 'Fri', amount: 70 },
    { day: 'Sat', amount: 25 },
    { day: 'Sun', amount: 0 },
  ],
  monthlyBreakdown: [
    { week: 'Week 1', amount: 375 },
    { week: 'Week 2', amount: 420 },
    { week: 'Week 3', amount: 505 },
    { week: 'Week 4', amount: 450 },
  ],
  recentPayments: [
    { 
      id: '1', 
      amount: 375, 
      date: 'April 21, 2025', 
      status: 'completed',
      method: 'Direct Deposit'
    },
    { 
      id: '2', 
      amount: 420, 
      date: 'April 14, 2025', 
      status: 'completed',
      method: 'Direct Deposit'
    },
    { 
      id: '3', 
      amount: 505, 
      date: 'April 7, 2025', 
      status: 'completed',
      method: 'Direct Deposit'
    },
  ]
};

export default function EarningsScreen() {
  const [timeframe, setTimeframe] = useState('week');
  
  const navigateToDashboard = () => {
    router.push('/owner-dashboard');
  };
  
  const navigateToJobs = () => {
    router.push('/owner-dashboard/jobs');
  };
  
  const navigateToProfile = () => {
    // Navigate to profile screen
    router.push('/owner-dashboard/profile');
  };
  
  const navigateToPaymentHistory = () => {
    // Navigate to payment history screen
    console.log('Navigate to payment history');
  };
  
  const navigateToPaymentSettings = () => {
    // Navigate to payment settings screen
    console.log('Navigate to payment settings');
  };
  
  const renderBarChart = () => {
    const data = timeframe === 'week' ? mockData.weeklyBreakdown : mockData.monthlyBreakdown;
    const maxValue = Math.max(...data.map(item => item.amount));
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barLabel}>{item.day || item.week}</Text>
            </View>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${(item.amount / maxValue) * 100}%`,
                    backgroundColor: item.amount > 0 ? '#4a80f5' : '#e0e0e0'
                  }
                ]}
              />
              <Text style={styles.barValue}>${item.amount}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={navigateToPaymentSettings}>
          <MaterialIcons name="settings" size={24} color="#4a80f5" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <TouchableOpacity style={styles.cashOutButton}>
              <Text style={styles.cashOutButtonText}>Cash Out</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceAmount}>${mockData.currentBalance.toFixed(2)}</Text>
          
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingLabel}>Pending</Text>
            <Text style={styles.pendingAmount}>${mockData.pendingPayments.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Earnings Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.timeframeSelector}>
            <TouchableOpacity
              style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframeButton]}
              onPress={() => setTimeframe('week')}
            >
              <Text style={[styles.timeframeButtonText, timeframe === 'week' && styles.activeTimeframeButtonText]}>This Week</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframeButton]}
              onPress={() => setTimeframe('month')}
            >
              <Text style={[styles.timeframeButtonText, timeframe === 'month' && styles.activeTimeframeButtonText]}>This Month</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryAmount}>
            <Text style={styles.summaryAmountValue}>
              ${timeframe === 'week' ? mockData.currentWeekEarnings : mockData.monthlyEarnings}
            </Text>
            <View style={styles.changeContainer}>
              <MaterialIcons 
                name={timeframe === 'week' && mockData.weeklyChange > 0 || timeframe === 'month' && mockData.monthlyChange > 0 ? "arrow-upward" : "arrow-downward"} 
                size={14} 
                color={timeframe === 'week' && mockData.weeklyChange > 0 || timeframe === 'month' && mockData.monthlyChange > 0 ? "#4CAF50" : "#F44336"} 
              />
              <Text style={[
                styles.changeText, 
                {
                  color: timeframe === 'week' && mockData.weeklyChange > 0 || timeframe === 'month' && mockData.monthlyChange > 0 ? "#4CAF50" : "#F44336"
                }
              ]}>
                {timeframe === 'week' ? mockData.weeklyChange : mockData.monthlyChange}% from last {timeframe}
              </Text>
            </View>
          </View>
          
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonLabel}>Previous {timeframe}</Text>
            <Text style={styles.comparisonValue}>
              ${timeframe === 'week' ? mockData.previousWeekEarnings : mockData.previousMonthEarnings}
            </Text>
          </View>
        </View>
        
        {/* YTD Earnings Card */}
        <View style={styles.ytdCard}>
          <Text style={styles.sectionTitle}>Year-to-Date Earnings</Text>
          <Text style={styles.ytdAmount}>${mockData.yearToDateEarnings.toFixed(2)}</Text>
        </View>
        
        {/* Earnings Breakdown Card */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
            <Text style={styles.breakdownSubtitle}>
              {timeframe === 'week' ? 'Past 7 days' : 'Past 4 weeks'}
            </Text>
          </View>
          
          {renderBarChart()}
        </View>
        
        {/* Recent Payments Card */}
        <View style={styles.paymentsCard}>
          <View style={styles.paymentsHeader}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            <TouchableOpacity onPress={navigateToPaymentHistory}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {mockData.recentPayments.map((payment, index) => (
            <View 
              key={payment.id} 
              style={[
                styles.paymentItem, 
                index < mockData.recentPayments.length - 1 && styles.paymentItemWithBorder
              ]}
            >
              <View style={styles.paymentIconContainer}>
                <MaterialIcons name="account-balance" size={24} color="#4a80f5" />
              </View>
              
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentMethod}>{payment.method}</Text>
                <Text style={styles.paymentDate}>{payment.date}</Text>
              </View>
              
              <View style={styles.paymentAmount}>
                <Text style={styles.paymentAmountText}>${payment.amount}</Text>
                <View style={[
                  styles.paymentStatus, 
                  { backgroundColor: payment.status === 'completed' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.paymentStatusText}>
                    {payment.status === 'completed' ? 'Paid' : 'Pending'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Payment Methods Card */}
        <View style={styles.methodsCard}>
          <View style={styles.methodsHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity style={styles.addMethodButton} onPress={navigateToPaymentSettings}>
              <MaterialIcons name="add" size={20} color="#4a80f5" />
              <Text style={styles.addMethodButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.methodItem}>
            <View style={styles.methodIconContainer}>
              <MaterialIcons name="credit-card" size={24} color="#4a80f5" />
            </View>
            
            <View style={styles.methodDetails}>
              <Text style={styles.methodName}>Bank of America</Text>
              <Text style={styles.methodInfo}>****4567 • Default</Text>
            </View>
            
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
          </View>
        </View>
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
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#4a80f5" />
          <Text style={[styles.navText, styles.activeNavText]}>Earnings</Text>
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
  settingsButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  balanceCard: {
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
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  cashOutButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  cashOutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pendingLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  pendingAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  summaryCard: {
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
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeframeButton: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  timeframeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTimeframeButtonText: {
    color: '#4a80f5',
  },
  summaryAmount: {
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryAmountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#666',
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ytdCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
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
  ytdAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  breakdownCard: {
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
  breakdownHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  breakdownSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabelContainer: {
    width: 40,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
  barWrapper: {
    flex: 1,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 16,
    borderRadius: 8,
  },
  barValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
  paymentsCard: {
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
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 13,
    color: '#666',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  paymentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  methodsCard: {
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
  methodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f5ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addMethodButtonText: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
    marginLeft: 4,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  methodInfo: {
    fontSize: 13,
    color: '#666',
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