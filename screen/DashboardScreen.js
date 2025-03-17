import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../app/context/ThemeContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalScans: 0,
    sensitiveDetected: 0,
    riskLevels: { high: 0, medium: 0, low: 0 },
    sensitiveTypes: {},
    recentActivity: [],
  });

  useEffect(() => {
    // Mock data for demonstration
    const mockData = {
      totalScans: 28,
      sensitiveDetected: 17,
      riskLevels: { high: 7, medium: 6, low: 4 },
      sensitiveTypes: {
        'Credit Card': 5,
        'Phone Number': 8,
        'Address': 3,
        'Email': 6,
        'SSN': 2,
      },
      recentActivity: [
        { id: 1, date: '2023-06-15', type: 'Document', risk: 'high' },
        { id: 2, date: '2023-06-14', type: 'Image', risk: 'medium' },
        { id: 3, date: '2023-06-12', type: 'Document', risk: 'low' },
        { id: 4, date: '2023-06-10', type: 'Image', risk: 'high' },
      ],
    };
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats(mockData);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
      onPress={() => navigation.navigate('History')}
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          {renderStatCard('search', 'Total Scans', stats.totalScans, 'All time')}
          {renderStatCard('shield', 'Sensitive Detected', stats.sensitiveDetected, `${Math.round((stats.sensitiveDetected / stats.totalScans) * 100)}% of scans`)}
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Risk Level Distribution
          </Text>
          {stats.totalScans > 0 ? (
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
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No data available yet
            </Text>
          )}
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
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
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Sensitive Information Types
          </Text>
          {Object.keys(stats.sensitiveTypes).length > 0 ? (
            <View style={styles.sensitiveTypesContainer}>
              {Object.entries(stats.sensitiveTypes).map(([type, count]) => 
                renderSensitiveTypeItem(type, count, stats.sensitiveDetected)
              )}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No sensitive information detected yet
            </Text>
          )}
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default DashboardScreen; 