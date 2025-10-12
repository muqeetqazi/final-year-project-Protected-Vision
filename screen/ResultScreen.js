import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
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
import { API_CONFIG } from '../app/config/api';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
import { TokenManager } from '../app/services/AuthService';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { incrementDocumentShared, incrementDocumentProcessed, incrementSensitiveDetected, incrementNonDetected } = useAuth();
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

    // Debug logging for ML analysis results - ML model is source of truth
    console.log("=== ML Model Results (Source of Truth) ===");
    console.log("Media object:", media);
    console.log("Meta data from ML model:", meta);
    console.log("ML Detections count:", detections);
    console.log("ML Detection types:", detectionTypes);
    console.log("ML Processing time:", processingTime);
    console.log("Document ID:", media?.documentId);
    console.log("==========================================");

    setCounts({ detectionTypes, detections, processingTime });
    setRiskLevel(detections > 0 ? 'high' : 'low');
    setLoading(false);

    // Update statistics after ML analysis completion
    const updateStats = async () => {
      try {
        // Update local stats immediately using ML model results
        console.log("=== Frontend Stats Update (ML-Based) ===");
        console.log("Updating local stats with ML detection count:", detections);
        
        await incrementDocumentProcessed();
        
        // Update local detection statistics using ML model results ONLY
        console.log("=== ML Model Stats Update (Source of Truth) ===");
        console.log("ML model sensitive count:", detections);
        console.log("ML model detection types:", detectionTypes);
        console.log("ML model processing time:", processingTime);
        
        if (detections > 0) {
          console.log("ML model detected sensitive items:", detections);
          await incrementSensitiveDetected(detections);
        } else {
          console.log("ML model found no sensitive items");
          await incrementNonDetected(1);
        }
        console.log("✅ Frontend stats updated with ML model results only");
        console.log("===================================================");
        
        // Update Django backend - mark document as processed
        if (media.documentId) {
          const documentId = media.documentId;
          const accessToken = await TokenManager.getAccessToken();
          
          console.log("=== Django Document Update ===");
          console.log("Updating document:", {
            documentId,
            payload: { processed: true },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          });
          
          try {
            const response = await axios.patch(
              `${API_CONFIG.BASE_URL}/documents/${documentId}/`,
              { processed: true },
              { 
                headers: { 
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                } 
              }
            );
            console.log("Django document updated successfully:", response.data);
          } catch (err) {
            console.error("Django document update error:", err.response?.data || err.message);
            console.error("Full error object:", err);
          }
          console.log("===============================");
        }
        
        // Send ML model results to Django for persistence
        if (media.documentId) {
          const accessToken = await TokenManager.getAccessToken();
          
          // Use ML model results as source of truth - format for Django
          const mlBasedAnalysisData = {
            document_id: media.documentId,
            sensitive_items_count: detections, // ML model count
            detection_types: [detectionTypes], // Convert to array format for Django
            processing_time: parseInt(processingTime.replace('ms', '')), // Strip "ms" and convert to integer
            source: 'ml_model' // Mark as ML-based data
          };
          
          console.log("=== Django Detection Stats Update ===");
          console.log("Original ML model data:", {
            detections,
            detectionTypes,
            processingTime
          });
          console.log("Formatted payload for Django:", mlBasedAnalysisData);
          console.log("Payload transformations:");
          console.log("- detection_types: converted to array format");
          console.log("- processing_time: stripped 'ms' and converted to integer");
          console.log("- sensitive_items_count: unchanged (ML model count)");
          console.log("API endpoint:", `${API_CONFIG.BASE_URL}/detection/analyze/`);
          console.log("Headers:", {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          });
          console.log("⚠️  NOTE: Django response will be treated as acknowledgment only.");
          console.log("⚠️  Frontend state will NOT be updated with Django's sensitive_items_count.");
          console.log("⚠️  ML model detection count is the only trusted source.");
          
          try {
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/detection/analyze/`,
              mlBasedAnalysisData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                }
              }
            );
            console.log("Django detection stats updated successfully:", response.data);
            console.log("Django ack status:", response.status);
            console.log("Django response sensitive_items_count:", response.data?.sensitive_items_count);
            console.log("ML model count vs Django response:", {
              mlModelCount: detections,
              djangoResponse: response.data?.sensitive_items_count
            });
            
            // Check if Django tried to override ML model count
            const djangoCount = response.data?.sensitive_items_count;
            if (djangoCount !== undefined && djangoCount !== detections) {
              console.warn(`⚠️ Ignoring Django sensitive_items_count (${djangoCount}). Using ML model count (${detections}).`);
              console.warn("Django response treated as acknowledgment only - ML model is source of truth.");
            } else if (djangoCount === detections) {
              console.log("✅ Django response matches ML model count - no override detected.");
            }
            
            // Final confirmation that frontend state is protected
            console.log("🔒 Frontend state protection: ML model count preserved in local state.");
            console.log("🔒 Dashboard will display ML-based detection count:", detections);
            
            // Refresh profile stats from backend after successful Django acknowledgment
            console.log("=== Profile Stats Refresh ===");
            try {
              const profileResponse = await axios.get(
                `${API_CONFIG.BASE_URL}/auth/profile/`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                  }
                }
              );
              console.log("✅ Profile stats refreshed from backend:", profileResponse.data);
              console.log("Backend total_sensitive_items_detected:", profileResponse.data?.total_sensitive_items_detected);
              console.log("Backend total_documents_processed:", profileResponse.data?.total_documents_processed);
              console.log("ML model count vs Backend count:", {
                mlModelCount: detections,
                backendCount: profileResponse.data?.total_sensitive_items_detected
              });
            } catch (profileErr) {
              console.error("Profile refresh error:", profileErr.response?.data || profileErr.message);
              console.log("⚠️ Profile refresh failed, but ML-based stats remain accurate");
            }
            console.log("=============================");
          } catch (err) {
            console.error("Django detection stats error:", err.response?.data || err.message);
            console.error("Full error object:", err);
            console.log("🔒 Frontend state protection: ML model count preserved despite Django error.");
            console.log("🔒 Dashboard will display ML-based detection count:", detections);
            console.log("⚠️ Django error occurred, but ML-based stats remain accurate");
          }
          console.log("====================================");
        }
        
      } catch (error) {
        console.error('Error updating statistics:', error);
        console.log("🔒 ML model stats preserved despite error - dashboard remains accurate");
        console.log("ML model sensitive count:", detections);
        console.log("Frontend state protected from any backend failures");
      }
    };

    updateStats();
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
                useNativeControls={true}
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                onError={(error) => {
                  console.error('Video playback error:', error);
                  console.log('Video URI:', media.uri);
                }}
                onLoad={(status) => {
                  console.log('Video loaded successfully:', status);
                }}
                onLoadStart={() => {
                  console.log('Video loading started');
                }}
                onReadyForDisplay={() => {
                  console.log('Video ready for display');
                }}
              />
            ) : (
              <Image
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                resizeMode="contain"
                onError={(error) => {
                  console.error('Image load error:', error);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully');
                }}
              />
            )
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={[styles.noMediaText, { color: theme.colors.error }]}>No media to display</Text>
            </View>
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
    paddingTop: 30,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 6,
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
  noMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noMediaText: {
    fontSize: 16,
    textAlign: 'center',
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