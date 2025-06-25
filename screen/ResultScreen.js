import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { media } = route.params;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [riskLevel, setRiskLevel] = useState('high');

  useEffect(() => {
    // Simulate API call to analyze image
    const timer = setTimeout(() => {
      const mockResults = {
        sensitiveContent: [
          { type: 'credit_card', confidence: 0.98, count: 1 },
          { type: 'address', confidence: 0.85, count: 1 },
          { type: 'phone_number', confidence: 0.92, count: 2 },
        ],
        riskLevel: 'high',
        processingTime: '1.2s',
      };
      
      setResults(mockResults);
      setRiskLevel(mockResults.riskLevel);
      setLoading(false);
    }, 2000);
    
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
        return '#1890FF';
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'credit_card':
        return { name: 'credit-card', component: FontAwesome };
      case 'address':
        return { name: 'map-marker', component: FontAwesome };
      case 'phone_number':
        return { name: 'phone', component: FontAwesome };
      case 'email':
        return { name: 'envelope', component: FontAwesome };
      case 'ssn':
        return { name: 'id-card', component: FontAwesome };
      case 'passport':
        return { name: 'passport', component: FontAwesome };
      case 'license':
        return { name: 'id-badge', component: FontAwesome };
      case 'bank_account':
        return { name: 'bank', component: FontAwesome };
      default:
        return { name: 'exclamation-circle', component: FontAwesome };
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this sensitive content analysis from Protected Vision!',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the results');
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Results saved to your history',
      [{ text: 'OK' }]
    );
    navigation.navigate('History');
  };

  const handleRedact = () => {
    Alert.alert(
      'Redaction Complete',
      'Sensitive information has been redacted from your image',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LinearGradient
          colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Analyzing your content...</Text>
          <Text style={styles.loadingSubText}>Detecting sensitive information</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.mediaContainer}>
          {media.uri ? (
            <Image
              source={{ uri: media.uri }}
              style={styles.mediaPreview}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: 'red', textAlign: 'center' }}>No image to display</Text>
          )}
          <View 
            style={[
              styles.riskBadge, 
              { backgroundColor: getRiskColor(riskLevel) }
            ]}
          >
            <Text style={styles.riskText}>
              {riskLevel.toUpperCase()} RISK
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Summary
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {results.sensitiveContent.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Types Detected
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {results.sensitiveContent.reduce((acc, item) => acc + item.count, 0)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Instances
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {results.processingTime}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Processing Time
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Detected Sensitive Information
          </Text>
          
          {results.sensitiveContent.map((item, index) => {
            const iconInfo = getContentTypeIcon(item.type);
            const IconComponent = iconInfo.component;
            
            return (
              <View 
                key={index} 
                style={[
                  styles.detailItem, 
                  index < results.sensitiveContent.length - 1 && 
                  { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <IconComponent name={iconInfo.name} size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailType, { color: theme.colors.text }]}>
                    {item.type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                  <Text style={[styles.detailCount, { color: theme.colors.textSecondary }]}>
                    {item.count} {item.count === 1 ? 'instance' : 'instances'} detected
                  </Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text 
                    style={[
                      styles.confidenceText, 
                      { color: item.confidence > 0.9 ? '#FF4D4F' : '#FAAD14' }
                    ]}
                  >
                    {Math.round(item.confidence * 100)}%
                  </Text>
                  <Text style={[styles.confidenceLabel, { color: theme.colors.textSecondary }]}>
                    confidence
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.recommendationsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Recommendations
          </Text>
          <View style={styles.recommendationItem}>
            <MaterialCommunityIcons 
              name="shield-alert" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
              This image contains sensitive information that should not be shared publicly.
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <MaterialCommunityIcons 
              name="eye-off" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
              Consider redacting the sensitive information before sharing.
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleRedact}
          >
            <FontAwesome name="eraser" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Redact</Text>
          </TouchableOpacity>

        <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]} 
            onPress={handleSave}
        >
            <FontAwesome name="save" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
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
  },
  loadingGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  loadingSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    position: 'relative',
    width: width,
    height: width * 0.6,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  riskBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  riskText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  summaryCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailCount: {
    fontSize: 14,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    fontSize: 12,
  },
  recommendationsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 0,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ResultScreen; 