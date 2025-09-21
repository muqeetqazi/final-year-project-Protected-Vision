import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { UserStatsService } from '../services/UserStatsService';

const UserStats = ({ onStatsUpdate, style }) => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    total_documents_saved: 0,
    total_documents_processed: 0,
    total_documents_shared: 0,
    total_sensitive_items_detected: 0,
    total_non_detected_items: 0,
    detection_accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setError(null);
      const result = await UserStatsService.getUserStats();
      
      if (result.success) {
        setStats(result.data);
        if (onStatsUpdate) {
          onStatsUpdate(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load user statistics');
      console.error('Load user stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserStats();
    setRefreshing(false);
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return '#4CAF50'; // Green
    if (accuracy >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const StatCard = ({ icon, title, value, subtitle, color, gradient }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={gradient || [color, color + '80']}
        style={styles.statIconContainer}
      >
        <FontAwesome name={icon} size={24} color="#fff" />
      </LinearGradient>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {value}
        </Text>
        <Text style={[styles.statTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading your statistics...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Unable to Load Statistics
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadUserStats}
          >
            <FontAwesome name="refresh" size={16} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Your Activity Statistics
        </Text>
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <FontAwesome 
            name="refresh" 
            size={16} 
            color="#fff" 
            style={refreshing ? styles.spinning : null}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Documents
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="save"
              title="Documents Saved"
              value={stats.total_documents_saved || 0}
              color="#2196F3"
              gradient={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
            />
            <StatCard
              icon="cogs"
              title="Documents Processed"
              value={stats.total_documents_processed || 0}
              color="#FF9800"
              gradient={['#FF9800', '#FF980080']}
            />
            <StatCard
              icon="share"
              title="Documents Shared"
              value={stats.total_documents_shared || 0}
              color="#9C27B0"
              gradient={['#9C27B0', '#9C27B080']}
            />
          </View>
        </View>

        {/* Detection Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Detection Analysis
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="exclamation-triangle"
              title="Sensitive Items Detected"
              value={stats.total_sensitive_items_detected || 0}
              color="#F44336"
              gradient={['#F44336', '#F4433680']}
            />
            <StatCard
              icon="check-circle"
              title="Safe Items"
              value={stats.total_non_detected_items || 0}
              color="#4CAF50"
              gradient={['#4CAF50', '#4CAF5080']}
            />
            <StatCard
              icon="target"
              title="Detection Accuracy"
              value={`${(stats.detection_accuracy || 0).toFixed(1)}%`}
              subtitle="Overall Performance"
              color={getAccuracyColor(stats.detection_accuracy || 0)}
              gradient={[getAccuracyColor(stats.detection_accuracy || 0), getAccuracyColor(stats.detection_accuracy || 0) + '80']}
            />
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.summaryGradient}
            >
              <FontAwesome name="chart-line" size={32} color="#fff" />
              <Text style={styles.summaryTitle}>Activity Summary</Text>
            </LinearGradient>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Total Documents:
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {stats.total_documents_saved || 0}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Processing Rate:
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {(stats.total_documents_saved || 0) > 0 
                    ? `${(((stats.total_documents_processed || 0) / (stats.total_documents_saved || 1)) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Items Analyzed:
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {(stats.total_sensitive_items_detected || 0) + (stats.total_non_detected_items || 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryGradient: {
    padding: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryContent: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserStats;
