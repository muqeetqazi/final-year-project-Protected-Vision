import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
import { UserStatsService } from '../app/services/UserStatsService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const { userStats, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalScans: 0,
    sensitiveDetected: 0,
    riskLevels: { high: 0, medium: 0, low: 0 },
    sensitiveTypes: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user statistics from backend
        const result = await UserStatsService.getUserStats();
        
        if (result.success) {
          const userData = result.data;
          
          // Transform backend data to dashboard format
          const dashboardData = {
            totalScans: userData.total_documents_saved || 0,
            sensitiveDetected: userData.total_sensitive_items_detected || 0,
            documentsProcessed: userData.total_documents_processed || 0,
            nonDetectedItems: userData.total_non_detected_items || 0,
            riskLevels: {
              high: Math.floor((userData.total_sensitive_items_detected || 0) * 0.4),
              medium: Math.floor((userData.total_sensitive_items_detected || 0) * 0.35),
              low: Math.floor((userData.total_sensitive_items_detected || 0) * 0.25),
            },
            sensitiveTypes: {
              'Credit Card': Math.floor((userData.total_sensitive_items_detected || 0) * 0.3),
              'Phone Number': Math.floor((userData.total_sensitive_items_detected || 0) * 0.4),
              'Address': Math.floor((userData.total_sensitive_items_detected || 0) * 0.15),
              'Email': Math.floor((userData.total_sensitive_items_detected || 0) * 0.35),
              'SSN': Math.floor((userData.total_sensitive_items_detected || 0) * 0.1),
            },
            recentActivity: [
              // This would ideally come from a separate API endpoint for recent activity
              { id: 1, date: new Date().toISOString().split('T')[0], type: 'Document', risk: 'high' },
            ],
          };
          
          setStats(dashboardData);
        } else {
          setError(result.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard data loading error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, userStats]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return '#FF4D4F';
      case 'medium':
        return '#FAAD14';
      case 'low':
        return '#52C41A';
      default:
        return theme.colors.textSecondary;
    }
  };

  const pieChartData = [
    {
      name: 'High',
      population: stats.riskLevels.high,
      color: '#FF4D4F',
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Medium',
      population: stats.riskLevels.medium,
      color: '#FAAD14',
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Low',
      population: stats.riskLevels.low,
      color: '#52C41A',
      legendFontColor: theme.colors.text,
    },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5, 8, 6, 9, 12, 15],
        color: () => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: () => theme.colors.primary,
    labelColor: () => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const renderStatCard = (icon, title, value, subtitle) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <FontAwesome name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const renderSensitiveTypeItem = (type, count, total) => {
    const percentage = Math.round((count / total) * 100);
    
    return (
      <View key={type} style={styles.sensitiveTypeItem}>
        <View style={styles.sensitiveTypeHeader}>
          <Text style={[styles.sensitiveTypeName, { color: theme.colors.text }]}>{type}</Text>
          <Text style={[styles.sensitiveTypeCount, { color: theme.colors.primary }]}>
            {count} ({percentage}%)
          </Text>
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${percentage}%`, 
                backgroundColor: theme.colors.primary 
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const renderActivityItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.activityItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => {}}
    >
      <View style={[styles.activityIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <MaterialCommunityIcons 
          name={item.type === 'Document' ? 'file-document' : 'image'} 
          size={20} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
          {item.type} Scan
        </Text>
        <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
          {item.date}
        </Text>
      </View>
      <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.risk) + '20' }]}>
        <Text style={[styles.riskText, { color: getRiskColor(item.risk) }]}>
          {item.risk.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading dashboard...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Unable to Load Dashboard
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <FontAwesome name="refresh" size={16} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Your sensitive data insights</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {renderStatCard('search', 'Total Scans', stats.totalScans, 'All time')}
            {renderStatCard('shield', 'Sensitive Detected', stats.sensitiveDetected, `${Math.round((stats.sensitiveDetected / stats.totalScans) * 100)}% of scans`)}
          </View>
          <View style={styles.statsRow}>
            {renderStatCard('file-text', 'Documents Processed', stats.documentsProcessed, 'Successfully analyzed')}
            {renderStatCard('check-circle', 'Non-Sensitive Items', stats.nonDetectedItems, 'Safe documents')}
          </View>
        </View>
        {/* Risk Level Distribution Section */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Risk Level Distribution
            </Text>
            <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <FontAwesome name="pie-chart" size={16} color={theme.colors.primary} />
            </View>
          </View>
          {stats.totalScans > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={width - 32}
                height={180}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <FontAwesome name="chart-pie" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No data available yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Start scanning documents to see your risk distribution
              </Text>
            </View>
          )}
        </View>

        {/* <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Scan Activity
          </Text>
          {stats.totalScans > 0 ? (
            <LineChart
              data={lineChartData}
              width={width - 32}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No data available yet
            </Text>
          )}
        </View> */}

        
        {/* <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {stats.recentActivity.length > 0 ? (
            <View style={styles.activityList}>
              {stats.recentActivity.map(item => renderActivityItem(item))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No recent activity
            </Text>
          )}
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  statsContainer: {
    marginTop: -16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
  },
  sectionContainer: {
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sensitiveTypesContainer: {
    marginTop: 8,
  },
  sensitiveTypeItem: {
    marginBottom: 16,
  },
  sensitiveTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sensitiveTypeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  sensitiveTypeCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
});

export default DashboardScreen; 