import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  // This would come from your user state management
  const mockUserData = {
    name: 'John Doe',
    subscriptionType: 'Premium',
    scansThisMonth: 35,
    totalScans: 150,
    scanLimit: 'Unlimited',
    subscriptionEnds: '2024-04-17',
    recentActivity: [
      { date: '2024-03-17', type: 'Image Scan', status: 'Clean' },
      { date: '2024-03-16', type: 'Video Scan', status: 'Sensitive Content' },
      { date: '2024-03-15', type: 'Image Scan', status: 'Clean' },
    ],
  };

  const stats = [
    {
      title: 'Scans This Month',
      value: mockUserData.scansThisMonth,
      icon: 'bar-chart',
    },
    {
      title: 'Total Scans',
      value: mockUserData.totalScans,
      icon: 'line-chart',
    },
    {
      title: 'Scan Limit',
      value: mockUserData.scanLimit,
      icon: 'dashboard',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#43034d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cog" size={24} color="#43034d" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Subscription Status */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <FontAwesome name="crown" size={24} color="#FFD700" />
            <Text style={styles.subscriptionType}>
              {mockUserData.subscriptionType}
            </Text>
          </View>
          <Text style={styles.subscriptionExpiry}>
            Expires: {mockUserData.subscriptionEnds}
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.upgradeButtonText}>
              {mockUserData.subscriptionType === 'Premium'
                ? 'Manage Subscription'
                : 'Upgrade to Premium'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <FontAwesome name={stat.icon} size={24} color="#43034d" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {mockUserData.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityDate}>{activity.date}</Text>
                <Text style={styles.activityType}>{activity.type}</Text>
              </View>
              <Text
                style={[
                  styles.activityStatus,
                  {
                    color:
                      activity.status === 'Clean' ? '#4CAF50' : '#f44336',
                  },
                ]}
              >
                {activity.status}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43034d',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subscriptionType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#43034d',
    marginLeft: 10,
  },
  subscriptionExpiry: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#43034d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: width / 3 - 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43034d',
    marginVertical: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43034d',
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityInfo: {
    flex: 1,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityType: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 