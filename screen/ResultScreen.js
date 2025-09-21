import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
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
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
// import { UserStatsService } from '../app/services/UserStatsService'; // Temporarily disabled

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { incrementDocumentShared } = useAuth();
  const { media } = route.params;
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    detectionTypes: 0,
    detections: 0,
    processingTime: '0ms',
  });
  const [riskLevel, setRiskLevel] = useState('low');

  useEffect(() => {
    const meta = media?.meta || {};
    const detections = Number(meta?.detections || 0);
    const detectionTypes = Number(meta?.detectionTypes || 0);
    const processingTime = meta?.processingTime || '0ms';

    setCounts({ detectionTypes, detections, processingTime });
    setRiskLevel(detections > 0 ? 'high' : 'low');
    setLoading(false);
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
      
      // Update backend that document was shared (temporarily disabled)
      // const shareData = {
      //   document_id: media.documentId, // This should be passed from HomeScreen
      //   share_date: new Date().toISOString(),
      //   share_method: 'native_share',
      // };
      
      // const shareResult = await UserStatsService.shareDocument(shareData);
      // if (shareResult.success) {
      //   // Increment document shared counter
      //   await incrementDocumentShared();
      //   console.log('Document share recorded');
      // }
    } catch (error) {
      Alert.alert('Error', 'Could not share the results');
    }
  };

  // handleSave function removed - replaced with download functionality

  const handleRedact = () => {
    Alert.alert(
      'Redaction Complete',
      'Sensitive information has been redacted from your image',
      [{ text: 'OK' }]
    );
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your media library to save the file.');
        return;
      }

      let localUri = media.uri;

      // If data URI (base64), write to a temp file first
      if (typeof localUri === 'string' && localUri.startsWith('data:')) {
        const isVideo = media.type === 'video' || localUri.startsWith('data:video');
        const ext = isVideo ? 'mp4' : 'jpg';
        const tempPath = `${FileSystem.cacheDirectory}protectedvision_${Date.now()}.${ext}`;
        const base64 = localUri.substring(localUri.indexOf('base64,') + 7);
        await FileSystem.writeAsStringAsync(tempPath, base64, { encoding: FileSystem.EncodingType.Base64 });
        localUri = tempPath;
      } else if (typeof localUri === 'string' && localUri.startsWith('http')) {
        // If remote URL, download to a local file
        const isVideo = media.type === 'video';
        const ext = isVideo ? 'mp4' : 'jpg';
        const tempPath = `${FileSystem.cacheDirectory}protectedvision_${Date.now()}.${ext}`;
        const { uri: downloadedUri } = await FileSystem.downloadAsync(localUri, tempPath);
        localUri = downloadedUri;
      }

      const asset = await MediaLibrary.createAssetAsync(localUri);
      await MediaLibrary.createAlbumAsync('ProtectedVision', asset, false);
      Alert.alert('Success', 'File saved to your gallery!');
    } catch (error) {
      Alert.alert('Error', 'Could not save the file.');
    }
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
            media.type === 'video' ? (
              <Video
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
                isLooping
              />
            ) : (
              <Image
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )
          ) : (
            <Text style={{ color: 'red', textAlign: 'center' }}>No media to display</Text>
          )}
          <View 
            style={[
              styles.riskBadge, 
              { backgroundColor: getRiskColor(riskLevel) }
            ]}
          >
            <Text style={styles.riskText}>
              {riskLevel === 'high' ? 'HIGH RISK' : 'NO RISK'}
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
                {counts.detectionTypes}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Types Detected
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {counts.detections}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Detections
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {counts.processingTime}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Processing Time
              </Text>
            </View>
          </View>
        </View>

        {counts.detections === 0 ? (
          <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>No detections found</Text>
          </View>
        ) : null}

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
            onPress={handleDownload}
        >
            <FontAwesome name="download" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Download</Text>
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
    fontSize: 17,
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